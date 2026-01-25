import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/userAuth.controller.js";
import { validationMiddleware } from "../middlewares/validationsHandler.utils.js";
import { registerValidations } from "../validators/userAuth.validator.js";
import { userAuthMiddleware } from "../middlewares/userAuth.middleware.js";

const userAuthRouter = express.Router();

userAuthRouter.post(
  "/register",
  registerValidations,
  validationMiddleware,
  registerUser,
);
userAuthRouter.post("/login", loginUser);
userAuthRouter.get("/logout", userAuthMiddleware, logoutUser);
export default userAuthRouter;
