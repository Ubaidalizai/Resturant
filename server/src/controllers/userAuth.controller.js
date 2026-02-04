import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js"
import ErrorHandler from "../utils/errorHandler.util.js";
import { generateAccessToken, generateRefreshToken } from "../utils/genToken.util.js";
import { sentTokenToClient } from "../utils/sentTokenToClient.util.js";

// Handle register 
export const registerUser = asyncHandler(async (req, res, next)=>{
    const {name, email, password, phone, address} = req.body;
    // Image is handled by multer middleware
    const image = req.file ? req.file.buffer.toString('base64') : null;
    
    // Check does email exist
    const userFound = await User.findOne({email});
    if(userFound)return next(new ErrorHandler(400, 'Email already exists'));
    // Register a new user in DB
    const user = await User.create({name, email, password, phone, address, image});
    // Generate tokens 
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    // Store refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();
    // Sent token to client 
    sentTokenToClient('accessToken', accessToken, res);
    sentTokenToClient('refreshToken', refreshToken, res);
    res.respond(201, "User register successfully", {user: user.name});
})

// Handle Login
export const loginUser = asyncHandler(async (req, res, next)=>{
    const {email, password} = req.body;
    // Check email in DB
    const userFound = await User.findOne({email});
    if(!userFound)return next(new ErrorHandler(400, 'Email does not exists'));
    // Compare password 
    const isMatchPassword = await userFound.comparePassword(password);
    if(!isMatchPassword)return next(new ErrorHandler(400, 'Incorrect password'));
    // Generate the Tokens
     const accessToken = generateAccessToken(userFound.id);
    const refreshToken = generateRefreshToken(userFound.id);
    // Store refresh token in DB
    userFound.refreshToken = refreshToken;
    await userFound.save();
    // Sent token to client 
    sentTokenToClient('accessToken', accessToken, res);
    sentTokenToClient('refreshToken', refreshToken, res);
    res.respond(200, 'User logged in successfully', {user: userFound.user});
});

// Handle Logout
export const logoutUser = (req, res)=>{
    res.clearCookie("sellerAccToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
    });
     res.clearCookie("sellerRefToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
    });
    res.respond(200, 'Logged out successfully')
}

// Verify the user 
export const verifyUser = asyncHandler(async (req, res, next)=>{
    const user = req.userId;
    const userFound = await User.findById(user).select('-password -refreshToken -__v -createdAt -updatedAt');
    if(!userFound)return next(new ErrorHandler(404, 'User not found'));
    res.respond(200, 'User verified successfully', {user: userFound});
});
