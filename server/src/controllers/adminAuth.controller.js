import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.util.js";
import { generateAccessToken, generateRefreshToken } from "../utils/genToken.util.js";
import { sentTokenToClient } from "../utils/sentTokenToClient.util.js";
import { Admin } from "../models/admin.model.js";
import { sendResetPasswordEmail } from "../services/email.js";
import jwt from 'jsonwebtoken'
// Handle admin login
export const handleAdminLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Find admin in DB
  const admin = await Admin.findOne({ email });
  if (!admin) return next(new ErrorHandler(400, "Invalid email or password"));

  // Compare password
  const isMatch = await admin.comparePassword(password);
  if (!isMatch) return next(new ErrorHandler(400, "Invalid email or password"));

  // Generate refresh token and save in DB
  const token = generateRefreshToken(admin.id);
  admin.refreshToken = token;
  await admin.save();

  // Send token as cookie
  sentTokenToClient("adminToken", token, res);
  res.respond(200, "Admin logged in successfully");
});

// Verify the admin
export const verifyAdmin = asyncHandler(async (req, res, next) => {
  const adminId = req.admin; // Assume you decode the token and attach admin ID
  const admin = await Admin.findById(adminId);
  if (!admin) return next(new ErrorHandler(400, "Admin not found"));
  res.respond(200, "Admin verified successfully");
});

// Handle admin logout
export const handleAdminLogout = asyncHandler(async (req, res) => {
  const adminId = req.admin;
  const admin = await Admin.findById(adminId);
  if (admin) {
    admin.refreshToken = null; // remove refresh token
    await admin.save();
  }

  res.clearCookie("adminToken");
  res.respond(200, "Admin logged out successfully");
});



export const requestAdminPasswordReset = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return next(new ErrorHandler(404, "Admin not found"));

  // Generate JWT reset token
  const resetToken = generateAccessToken(admin.id);

  // Optional: store token in DB if you want to invalidate old tokens
  admin.resetToken = resetToken;
  await admin.save();

  // Send email with reset link
  await sendResetPasswordEmail(email, resetToken);

  res.respond(200, "Password reset email sent successfully");
});

// Reset admin password
export const resetAdminPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const {token } = req.params;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    return next(new ErrorHandler(400, "Invalid or expired token"));
  }

  const admin = await Admin.findById(decoded.id);
  if (!admin) return next(new ErrorHandler(404, "Admin not found"));

  // Optional: verify token matches DB (if you stored it)
  if (admin.resetToken !== token) {
    return next(new ErrorHandler(400, "Invalid or expired token"));
  }

  admin.password = password; // hashed automatically
  admin.resetToken = null;
  await admin.save();

  res.respond(200, "Password successfully reset");
});