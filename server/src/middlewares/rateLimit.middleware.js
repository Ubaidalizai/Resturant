import rateLimit from "express-rate-limit";

// General API limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 200 requests per IP per window
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for login
export const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // 5 login attempts
    message: {
        success: false,
        message: "Too many login attempts. Try again later."
    }
});