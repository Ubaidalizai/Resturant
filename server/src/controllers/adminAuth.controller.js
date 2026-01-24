import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.util.js";
import { generateRefreshToken } from "../utils/genToken.util.js";
import { sentTokenToClient } from "../utils/sentTokenToClient.util.js";

// Handle admin login
export const handleAdminLogin = asyncHandler(async (req, res, next)=>{
    const {email, password} = req.body;
    // Check the email address
    if(email !== process.env.email)return next(new ErrorHandler(400, "Invalid email address"));
    if(password !== process.env.password)return next(new ErrorHandler(400, "Invalid Password"));
    const token = generateRefreshToken(email);
    sentTokenToClient('adminToken', token, res);
    res.respond(200, "Admin logged in successfully")
});

// Verify the admin
export const verifyAdmin = asyncHandler(async (req, res, next)=>{
    const adminEmail = req.admin;
    if(adminEmail !== process.env.email)return next(new ErrorHandler(400, "Admin not found"));
    res.respond(200, "Admin verified successfully");
});

// Hndle admin logout
export const handleAdminLogout = asyncHandler(async (req, res)=>{
    res.clearCookie('adminToken');
    res.respond(200, "Admin logged out successfully");
})