import { body } from "express-validator";

export const staffValidation = [

  // full name
  body("fullName")
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 3 }).withMessage("Full name must be at least 3 characters")
    .trim(),

  // phone number
  body("phone")
    .notEmpty().withMessage("Phone number is required")
    .isLength({ min: 7, max: 15 }).withMessage("Phone number must be between 7 and 15 digits"),

  // salary
  body("salary")
    .notEmpty().withMessage("Salary is required")
    .isFloat({ min: 0 }).withMessage("Salary must be a positive number"),

  // employment type
  body("employmentType")
    .optional()
    .isIn(["full-time", "part-time", "contract"])
    .withMessage("Invalid employment type"),

  // status
  body("status")
    .optional()
    .isIn(["active", "inactive", "terminated"])
    .withMessage("Invalid status"),

  // national ID (optional)
  body("nationalId")
    .optional()
    .isLength({ min: 5 })
    .withMessage("National ID must be at least 5 characters"),

];