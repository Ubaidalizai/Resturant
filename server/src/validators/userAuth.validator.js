import { body } from "express-validator";

// Register validations
export const registerValidations = [
  body("name")
    .trim()
    .notEmpty().withMessage("User name is required")
    .isLength({ min: 3 }).withMessage("User name must be at least 3 characters")
    .isLength({ max: 50 }).withMessage("User name must be less than 50 characters")
    .isString().withMessage("User name must be a string"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must be between 8 and 100 characters"),

  body("phone")
    .optional()
    .isMobilePhone().withMessage("Invalid phone number"),

  body("address")
    .optional()
    .isLength({ max: 200 }).withMessage("Address must be less than 200 characters"),

  body("role")
    .notEmpty().withMessage("Role is required")
    .isMongoId().withMessage("Role must be a valid MongoDB ObjectId")
];

// Login validations
export const loginValidations = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8, max: 100 })
    .withMessage("Incorrect Password")
];
