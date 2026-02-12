import { body } from "express-validator";

export const stockValidation = [
  body("name")
    .notEmpty()
    .withMessage("Item name is required")
    .isLength({ min: 3 })
    .withMessage("Item name is should be atleast 3 characters"),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isLength({ min: 0.01 })
    .withMessage("Quantity should be greater then zero"),
  body("unit").trim().notEmpty().withMessage("Item unit is required"),
  body('minRequired').notEmpty().withMessage("Minimum item is required")
  .isLength({min: 0.1}).withMessage("Minimum item should be greater then zero"),
  body('status').notEmpty().withMessage("Status is required.")
  

];
