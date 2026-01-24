import { body } from "express-validator";

// Table validator
export const tableValidation = [
    body('tableNumber')
    .notEmpty().withMessage("Table number is required"),
    body('capacity')
    .notEmpty().withMessage('Table capacity is required'),
]