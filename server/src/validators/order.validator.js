import { body } from "express-validator";

export const orderValidation = [

  // Items must exist and be array
  body("items")
    .isArray({ min: 1 }).withMessage("Items is required"),

  // Validate each foodId inside items
  body("items.*.foodId")
    .notEmpty().withMessage("foodId is required")
    .isMongoId().withMessage("Invalid foodId"),

  // Validate each quantity inside items
  body("items.*.quantity")
    .notEmpty().withMessage("Quantity is required")
    .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    
  // Table ID validation
  body("tableId")
    .notEmpty().withMessage("Table ID is required")
    .isMongoId().withMessage("Invalid table ID"),


];