import { body, param } from "express-validator";

export const createStockValidation = [
  body("item")
    .notEmpty().withMessage("Item name is required")
    .isLength({ min: 2 }).withMessage("Item name must be at least 2 characters")
    .trim(),

  body("quantity")
    .notEmpty().withMessage("Quantity is required")
    .isNumeric().withMessage("Quantity must be a number")
    .custom((value) => {
      if (value < 0) throw new Error("Quantity cannot be negative");
      return true;
    }),

  body("unit")
    .notEmpty().withMessage("Unit is required")
    .isIn(["kg", "liter", "pieces", "man", "gram", "ml"])
    .withMessage("Unit must be one of kg, liter, pieces, man, gram, ml"),

  body("description")
    .optional()
    .isLength({ max: 300 }).withMessage("Description cannot exceed 300 characters")
    .trim(),
];

export const updateStockValidation = [
  param("id")
    .notEmpty().withMessage("Stock ID is required"),
  body("item")
    .notEmpty().withMessage("Item name is required")
    .trim(),
  body("quantity")
    .notEmpty().withMessage("Quantity is required")
    .isNumeric().withMessage("Quantity must be a number")
    .custom((value) => {
      if (value < 0) throw new Error("Quantity cannot be negative");
      return true;
    }),

  body("unit")
    .notEmpty().withMessage("Unit is required")
    .isIn(["kg", "liter", "pieces", "man", "gram", "ml"])
    .withMessage("Unit must be one of kg, liter, pieces, man, gram, ml"),
];