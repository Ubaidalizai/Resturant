import { body } from "express-validator";

export const forgotPasswordValidations = [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
];