import { body } from "express-validator";

export const menueValidations = [
    body("name").notEmpty().withMessage("Name is required"),
    body("catagory").notEmpty().withMessage("Category is required")
]