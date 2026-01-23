import { body } from "express-validator";

export const foodValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Food name is required"),

  body("catagory")
    .trim()
    .notEmpty()
    .withMessage("Food category is required"),

  body("price")
    .notEmpty()
    .withMessage("Food price is required")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be greater than 0"),
];
