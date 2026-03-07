import { User } from "../models/user.model.js";
import { sendResetToken } from "../services/email.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.util.js";
import { generateAccessToken, generateRefreshToken } from "../utils/genToken.util.js";
import { sentTokenToClient } from "../utils/sentTokenToClient.util.js";
import jwt from 'jsonwebtoken';

// ================= REGISTER =================
export const registerUser = asyncHandler(async (req, res, next) => {

  const { name, email, password, phone, address, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorHandler(400, "Email already exists"));
  }

  // Force default role (security)
  const user = await User.create({
    name,
    email,
    password,
    phone,
    address,
    role: role
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  sentTokenToClient("accessToken", accessToken, res);
  sentTokenToClient("refreshToken", refreshToken, res);

  res.respond(201, "User registered successfully", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});


// ================= LOGIN =================
export const loginUser = asyncHandler(async (req, res, next) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler(400, "Email does not exist"));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler(400, "Incorrect password"));
  }
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();
  sentTokenToClient("accessToken", accessToken, res);
  sentTokenToClient("refreshToken", refreshToken, res);

  res.respond(200, "User logged in successfully", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// ================= LOGOUT =================
export const logoutUser = asyncHandler(async (req, res) => {

  if (req.user?.id) {
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.respond(200, "Logged out successfully");
});


// ================= VERIFY USER =================
export const verifyUser = asyncHandler(async (req, res, next) => {

  const userId = req.user.id;

  const user = await User.findById(userId)
    .select("-password -refreshToken -__v -createdAt -updatedAt");

  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }

  res.respond(200, "User verified successfully", { user });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const userFound = await User.findOne({ email, isDeleted: false });
  if (!userFound) {
    return next(new ErrorHandler(404, "Email does not exist"));
  }
  // Generate JWT token, valid for 15 minutes
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

  // Send token via email
  const result = await sendResetToken(email, token);

  if (result.success) {
    res.respond(200, "Reset token sent to email");
  } else {
    next(new ErrorHandler(500, "Failed to send reset token"));
    
  }});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { password, token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    const userFound = await User.findOne({ email, isDeleted: false });
    if (!userFound) {
      return next(new ErrorHandler(404, "User not found"));
    }
    userFound.password = password;
    await userFound.save();
    res.respond(200, "Password reset successful");
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ErrorHandler(400, "Reset token has expired"));
    } else if (err.name === "JsonWebTokenError") {
      return next(new ErrorHandler(400, "Invalid reset token"));
    }
    next(new ErrorHandler(500, "An error occurred while resetting password"));
  }

}); 
  