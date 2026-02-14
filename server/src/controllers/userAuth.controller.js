import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.util.js";
import { generateAccessToken, generateRefreshToken } from "../utils/genToken.util.js";
import { sentTokenToClient } from "../utils/sentTokenToClient.util.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, address } = req.body;

  const image = req.file ? req.file.buffer.toString("base64") : null;

  const userFound = await User.findOne({ email });
  if (userFound) return next(new ErrorHandler(400, "Email already exists"));

  const user = await User.create({
    name,
    email,
    password,
    phone,
    address,
    image,
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  user.refreshToken = refreshToken;
  await user.save();

  sentTokenToClient("accessToken", accessToken, res);
  sentTokenToClient("refreshToken", refreshToken, res);

  res.respond(201, "User registered successfully", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const userFound = await User.findOne({ email });
  if (!userFound) return next(new ErrorHandler(400, "Email does not exist"));

  const isMatchPassword = await userFound.comparePassword(password);
  if (!isMatchPassword)
    return next(new ErrorHandler(400, "Incorrect password"));

  const accessToken = generateAccessToken(userFound.id);
  const refreshToken = generateRefreshToken(userFound.id);

  userFound.refreshToken = refreshToken;
  await userFound.save();

  sentTokenToClient("accessToken", accessToken, res);
  sentTokenToClient("refreshToken", refreshToken, res);

  res.respond(200, "User logged in successfully", {
    user: {
      id: userFound._id,
      name: userFound.name,
      email: userFound.email,
    },
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.userId;

  await User.findByIdAndUpdate(userId, { refreshToken: null });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.respond(200, "Logged out successfully");
});

export const verifyUser = asyncHandler(async (req, res, next) => {
  const userFound = await User.findById(req.userId)
    .select("-password -refreshToken -__v");

  if (!userFound)
    return next(new ErrorHandler(404, "User not found"));

  res.respond(200, "User verified successfully", {
    user: userFound,
  });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler(404, "User not found"));

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    html: `
      <h3>Password Reset</h3>
      <p>Click below link to reset your password:</p>
      <a href="${resetURL}">${resetURL}</a>
      <p>This link expires in 10 minutes.</p>
    `,
  });

  res.respond(200, "Password reset email sent");
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user)
    return next(new ErrorHandler(400, "Invalid or expired token"));

  user.password = newPassword; // Make sure pre-save hook hashes it
  user.resetToken = null;
  user.resetTokenExpiry = null;

  await user.save();

  res.respond(200, "Password reset successfully");
});