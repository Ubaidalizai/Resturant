import { body } from "express-validator";

export const roleValidator = [
  body("role")
    .notEmpty()
    .withMessage("Role name is required")
    .isString()
    .withMessage("Role must be a string")
    .trim()
    .notEmpty()
    .withMessage("Role name cannot be empty"),

  body("permissions")
    .notEmpty()
    .withMessage("Permissions are required")
    .isArray({ min: 1 })
    .withMessage("Permissions must be an array with at least one permission"),
  body("permissions.*")
    .isMongoId()
    .withMessage("Each permission must be a valid MongoDB ObjectId")
];