import { body } from "express-validator";

export const menueValidations = [
    body("name").notEmpty().withMessage("Name is required")
    .isString().withMessage("Name must be a string"),
    body("catagory").notEmpty().withMessage("Category is required")
    .isString().withMessage("Category must be a string")
]