import express from "express";
import {
  createStock,
  getAllStock,
  getSingleStock,
  updateStock,
  deleteStock,
  getActiveStock,
  getStockByStatus,
} from "../controllers/stock.controller.js";
import { createStockValidation, updateStockValidation } from "../validators/stock.validator.js";
import { validationMiddleware } from "../middlewares/validationsHandler.utils.js";

const stockRouter = express.Router();

stockRouter.post("/add", createStockValidation, validationMiddleware, createStock);               // Create
stockRouter.get("/all", getAllStock);               // Get all
stockRouter.get("/active", getActiveStock);      // Get active
stockRouter.get("/status", getStockByStatus);    // Filter by status
stockRouter.get("/:id", getSingleStock);         // Get single
stockRouter.put("/update/:id", updateStockValidation, validationMiddleware, updateStock);            // Update
stockRouter.delete("/delete/:id", deleteStock);         // Soft delete

export default stockRouter;