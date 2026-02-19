import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.util.js";
import { generateAccessToken, generateRefreshToken } from "../utils/genToken.util.js";
import { sentTokenToClient } from "../utils/sentTokenToClient.util.js";


// ================= REGISTER =================
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, address } = req.body;

  const image = req.file ? req.file.buffer.toString("base64") : null;

  const userFound = await User.findOne({ email });
  if (userFound) {
    return next(new ErrorHandler(400, "Email already exists"));
  }

  // Always force default role (security)
  const user = await User.create({
    name,
    email,
    password,
    phone,
    address,
    image,
    role: "user"
  });

  // Include role in access token
  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role
  });

  const refreshToken = generateRefreshToken({
    id: user._id
  });

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

  const userFound = await User.findOne({ email });
  if (!userFound) {
    return next(new ErrorHandler(400, "Email does not exist"));
  }

  const isMatchPassword = await userFound.comparePassword(password);
  if (!isMatchPassword) {
    return next(new ErrorHandler(400, "Incorrect password"));
  }

  // Optional: block unapproved sellers
  if (userFound.role === "seller" && !userFound.isSellerApproved) {
    return next(new ErrorHandler(403, "Seller not approved yet"));
  }

  const accessToken = generateAccessToken({
    id: userFound._id,
    role: userFound.role
  });

  const refreshToken = generateRefreshToken({
    id: userFound._id
  });

  userFound.refreshToken = refreshToken;
  await userFound.save();

  sentTokenToClient("accessToken", accessToken, res);
  sentTokenToClient("refreshToken", refreshToken, res);

  res.respond(200, "User logged in successfully", {
    user: {
      id: userFound._id,
      name: userFound.name,
      email: userFound.email,
      role: userFound.role
    }
  });
});


// ================= LOGOUT =================
export const logoutUser = asyncHandler(async (req, res) => {

  const userId = req.user?.id;

  if (userId) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.respond(200, "Logged out successfully");
});


// ================= VERIFY USER =================
export const verifyUser = asyncHandler(async (req, res, next) => {

  const userId = req.user.id;

  const userFound = await User.findById(userId)
    .select("-password -refreshToken -__v -createdAt -updatedAt");

  if (!userFound) {
    return next(new ErrorHandler(404, "User not found"));
  }

  res.respond(200, "User verified successfully", {
    user: userFound
  });
});
