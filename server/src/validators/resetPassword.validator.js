import { body } from "express-validator";

export const resetPasswordValidations = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8  })
    .withMessage("Password must be at least 8 characters long"),
    body("token").notEmpty().withMessage("Reset token is required"),
];