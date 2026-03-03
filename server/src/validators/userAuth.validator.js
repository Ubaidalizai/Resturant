import { body } from "express-validator";
// Register validations
export const registerValidations = [
    body('name')
    .notEmpty().withMessage('User name is required')
    .isLength({min: 3}).withMessage('User name should be atleast 3 characters')
    .isLength({max: 50}).withMessage("User name should be less than 50 characters")
    .toLowerCase(),
    body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
    body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({min: 8}).withMessage("Password must be atleast 8 characters")
    .isLength({max: 100}).withMessage("Password must be less then 100 characters")
]
// Login validations
export const loginValidations = [
    body('email')
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address"),
    body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({min: 8, max: 100}).withMessage('Incorrect password')
]