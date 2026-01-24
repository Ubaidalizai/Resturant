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
        req.userId = payload.id;
        return next();
    } catch (error) {
        // Check the refresh token
        console.log("Access token expired, checking refresh token...", error);
    }
  }
  // Check refresh token in DB
  const users = await User.find({});
  console.log(users);
  const userFound = await User.findOne({ refreshToken });
  console.log(userFound);
  if (!userFound) return next(new ErrorHanlder(401, "Invalid Token...."));
  // Validate the refresh token
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (userFound.id !== payload.id)
      return next(new ErrorHanlder(401, "Invalid token.."));
    const newAccessToken = generateAccessToken(userFound.id); // Generate new access token
    sentTokenToClient('accessToken', newAccessToken, res);
    req.userId = userFound.id;
    next();  } catch (error) {
    return next(new ErrorHanlder(401, 'Invalid or expire token'));
  }
};
