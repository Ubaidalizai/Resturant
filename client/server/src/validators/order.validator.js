import { body } from "express-validator";

// Order validations 
export const orderValidation = [
    body("userId")
    .isMongoId().withMessage("Invalid user ID"),
    body("items")
    .notEmpty().withMessage("Items cannot be empty"),
    body("quantity")
    .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    body("amount")
    .isFloat({ min: 0.01 }).withMessage("Amount must be at least 0.01"),    
    body("tableId")
    .isMongoId().withMessage("Invalid table ID")
    .notEmpty().withMessage("Table ID cannot be empty"),
]