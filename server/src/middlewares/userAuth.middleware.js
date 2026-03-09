import { User } from "../models/user.model.js";
import ErrorHanlder from "../utils/errorHandler.util.js";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/genToken.util.js";
import { sentTokenToClient } from "../utils/sentTokenToClient.util.js";



export const userAuthMiddleware = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  if (!accessToken && !refreshToken)
    return next(new ErrorHanlder(401, "Unauthorized"));
  if (accessToken) {
    try {
        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const userFound = await User.findById(payload.id);
        req.user = userFound;
        return next();
    } catch (error) {
        // Check the refresh token
    }
  }
  // Check refresh token in DB
  const users = await User.find({});
  const userFound = await User.findOne({ refreshToken });
  if (!userFound) return next(new ErrorHanlder(401, "Invalid Token...."));
  // Validate the refresh token
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (userFound.id !== payload.id)
      return next(new ErrorHanlder(401, "Invalid token.."));
    const newAccessToken = generateAccessToken(userFound.id); // Generate new access token
    sentTokenToClient('accessToken', newAccessToken, res);
    req.user = userFound;
    next();  } catch (error) {
    return next(new ErrorHanlder(401, 'Invalid or expire token'));
  }
};

