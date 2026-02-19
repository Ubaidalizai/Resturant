import { body } from "express-validator";

// Register validations
export const registerValidations = [
  body("name")
    .trim()
    .notEmpty().withMessage("User name is required")
    .isLength({ min: 3 }).withMessage("User name must be at least 3 characters")
    .isLength({ max: 50 }).withMessage("User name must be less than 50 characters")
    .toLowerCase(),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must be between 8 and 100 characters"),

  body("role")
    .optional()
    .isIn(["user", "chef", "admin"])
    .withMessage("Invalid role selected")
];

// Login validations
export const loginValidations = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must be between 8 and 100 characters")
];
