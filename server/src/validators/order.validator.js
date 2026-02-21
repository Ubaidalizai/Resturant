import { body } from "express-validator";

// Order validations 
export const orderValidation = [
    body("items")
    .notEmpty().withMessage("Items cannot be empty"),
    // Check the items array, if it contains the food and foodId fields
    body("items")
    .custom((items) => {
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error("Items must be a non-empty array");
        }
        for (const item of items) {
            if (!item.foodId || typeof item.foodId !== "string" || !item.foodId.match(/^[a-f\d]{24}$/i)) {
                throw new Error("Each item must have a valid 'foodId' field");
            }
        } 
        return true; 

    }),
    body("quantity")
    .isInt({ min: 1 }).withMessage("Quantity must be at least 1"), 
    body("tableId")
    .notEmpty().withMessage("Table ID cannot be empty")
    .isMongoId().withMessage("Invalid table ID"),
]