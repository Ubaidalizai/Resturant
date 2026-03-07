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

const userAuthRouter = express.Router();

userAuthRouter.post(
  "/register",
  registerValidations,
  validationMiddleware,
  registerUser,
);
userAuthRouter.get("/verify", userAuthMiddleware, verifyUser);
userAuthRouter.post("/login", loginValidations, validationMiddleware, loginUser);
userAuthRouter.get("/logout", userAuthMiddleware, logoutUser);
userAuthRouter.post("/reset-password", resetPasswordValidations, validationMiddleware, resetPassword);

userAuthRouter.post("/forgot-password",forgotPasswordValidations, validationMiddleware, forgotPassword);
export default userAuthRouter;
