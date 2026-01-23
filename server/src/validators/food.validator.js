import { body } from "express-validator";

export const foodValidation = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("catagory").notEmpty().withMessage("Poduct catagory is required"),
  body("price").notEmpty().withMessage("Product price is required"),
];
