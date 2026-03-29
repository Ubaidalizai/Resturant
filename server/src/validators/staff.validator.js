import { body } from "express-validator";

export const staffValidation = [
  // full name
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters")
    .isString()
    .withMessage("Full name must be a string"),

  // phone number
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^(?:\+93|93|0)?7[0-9]{8}$/)
    .withMessage("Phone must be a valid Afghan mobile number"),

  // address (optional)
  body("address")
    .optional()
    .isString()
    .withMessage("Address must be a string"),

  // salary
  body("salary")
    .notEmpty()
    .withMessage("Salary is required")
    .isFloat({ min: 0 })
    .withMessage("Salary must be a positive number"),


  // national ID (optional)
  body("nationalId")
    .optional()
    .isLength({ min: 5 })
    .withMessage("National ID must be at least 5 characters"),
];
