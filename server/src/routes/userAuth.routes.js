import express from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyUser,
} from "../controllers/userAuth.controller.js";
import { validationMiddleware } from "../middlewares/validationsHandler.utils.js";
import { loginValidations, registerValidations } from "../validators/userAuth.validator.js";
import { userAuthMiddleware } from "../middlewares/userAuth.middleware.js";
import { forgotPasswordValidations } from "../validators/forggotPassword.validator.js";
import { resetPasswordValidations } from "../validators/resetPassword.validator.js";
import { authorize } from "../middlewares/authorizeRole.middleware.js";

const userAuthRouter = express.Router();

// Register → only admin or users with add_user permission
userAuthRouter.post(
  "/register",
  userAuthMiddleware,
  authorize('panel_access', 'admin_access'),
  registerValidations,
  validationMiddleware,
  registerUser
);

// Verify → logged-in user
userAuthRouter.get("/verify", userAuthMiddleware, verifyUser);

// Login → public
userAuthRouter.post("/login", loginValidations, validationMiddleware, loginUser);

// Logout → logged-in user
userAuthRouter.get("/logout", userAuthMiddleware, logoutUser);

// Reset password → public
userAuthRouter.post("/reset-password", resetPasswordValidations, validationMiddleware, resetPassword);

// Forgot password → public
userAuthRouter.post("/forgot-password", forgotPasswordValidations, validationMiddleware, forgotPassword);

export default userAuthRouter;