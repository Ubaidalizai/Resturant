import { body } from "express-validator";

export const expensesCatagoryValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('name').isString().withMessage('Title must be a string'),
    body('description').optional().isString().withMessage('Note must be a string'),
    body('description').optional().isLength({ max: 500 }).withMessage('Note must be less than 500 characters'),
];

export const expensesValidations = [
    body('title').notEmpty().withMessage('Title is required'),
    body('title').isString().withMessage('Title must be a string'),
    body('title').isLength({ max: 100 }).withMessage('Title must be less than 100 characters'),
    body('amount').notEmpty().withMessage('Amount is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('catagory').notEmpty().withMessage('Catagory is required'),
    body('catagory').isMongoId().withMessage("Invalid ID"), 
    body('date')
    .notEmpty().withMessage("Date is required")
    .isDate().withMessage("Invalid Date Formate")
];