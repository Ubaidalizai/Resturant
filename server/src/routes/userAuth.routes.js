import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyUser,
} from "../controllers/userAuth.controller.js";
import { validationMiddleware } from "../middlewares/validationsHandler.utils.js";
import { registerValidations } from "../validators/userAuth.validator.js";
import { userAuthMiddleware } from "../middlewares/userAuth.middleware.js";
import { upload } from "../configs/multer.config.js";

const userAuthRouter = express.Router();

userAuthRouter.post(
  "/register",
  upload.single('image'),
  registerValidations,
  validationMiddleware,
  registerUser,
);
userAuthRouter.get("/verify", userAuthMiddleware, verifyUser);
userAuthRouter.post("/login", loginUser);
userAuthRouter.get("/logout", userAuthMiddleware, logoutUser);
export default userAuthRouter;
