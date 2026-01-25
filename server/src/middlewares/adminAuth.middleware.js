import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../utils/errorHandler.utils.js';
export const adminAuthMiddleware = (req, res, next) => {
    const {adminToken} = req.cookies;
    if (!adminToken) {
        return next(new ErrorHandler(401, "Unauthorized: No token provided"));
    }
    try {
        const decoded = jwt.verify(adminToken, process.env.REFRESH_TOKEN_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};    