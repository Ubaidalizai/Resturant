import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js"
import ErrorHandler from "../utils/errorHandler.util.js";
import { generateAccessToken, generateRefreshToken } from "../utils/genToken.util.js";
import { sentTokenToClient } from "../utils/sentTokenToClient.util.js";

// Handle register 
export const registerUser = asyncHandler(async (req, res, next)=>{
    const {name, email, password} = req.body;
    // Check does email exist
    const userFound = await User.findOne({email});
    if(userFound)return next(new ErrorHandler(400, 'Email already exists'));
    // Register a new user in DB
    const user = await User.create({name, email, password});
    // Generate tokens 
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    // Store refresh token in DB
    user.refreshToken = refreshToken;
    await User.save();
    // Sent token to client 
    sentTokenToClient('accessToken', accessToken, res);
    sentTokenToClient('refreshToken', refreshToken, res);
    res.respond(201, "User register successfully", {user: user.name});
})

// Handle Login
export const loginUser = asyncHandler(async (req, res, next)=>{
    console.lg("Test")
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
    return res.status(200).json({success: false})
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