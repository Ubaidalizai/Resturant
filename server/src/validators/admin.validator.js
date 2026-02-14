import { body } from "express-validator";


export const adminLoginPassword = [
    body('email')
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address"),
    body('password')
    .notEmpty().withMessage("Password is required")
]

export const resetPasswordValidation = [
    body('password')
    .notEmpty().withMessage("New password is required")
];

export const forggotPasswordValidation = [
    body('email')
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
]
