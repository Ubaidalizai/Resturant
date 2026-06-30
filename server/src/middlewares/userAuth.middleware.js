import { User } from "../models/user.model.js";
import ErrorHanlder from "../utils/errorHandler.util.js";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/genToken.util.js";
import { sentTokenToClient } from "../utils/sentTokenToClient.util.js";

export const userAuthMiddleware = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken && !refreshToken) {
    return next(new ErrorHanlder(401, "Unauthorized"));
  }

  if (accessToken) {
    try {
      const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const userFound = await User.findById(payload.id);
      if (!userFound) return next(new ErrorHanlder(401, "Unauthorized"));
      req.user = userFound;
      return next();
    } catch {
      // Access token expired or invalid — fall through to refresh token
    }
  }

  if (!refreshToken) {
    return next(new ErrorHanlder(401, "Invalid Token...."));
  }

  const userFound = await User.findOne({ refreshToken });
  if (!userFound) return next(new ErrorHanlder(401, "Invalid Token...."));

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (userFound.id !== payload.id) {
      return next(new ErrorHanlder(401, "Invalid token.."));
    }
    const newAccessToken = generateAccessToken(userFound.id);
    sentTokenToClient("accessToken", newAccessToken, res);
    req.user = userFound;
    next();
  } catch {
    return next(new ErrorHanlder(401, "Invalid or expire token"));
  }
};
