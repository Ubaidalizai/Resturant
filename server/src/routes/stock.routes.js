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
import { userAuthMiddleware } from "../middlewares/userAuth.middleware.js";
import { authorize } from "../middlewares/authorizeRole.middleware.js";

const stockRouter = express.Router();

// Create stock → add_stock or admin or kitchen_access
stockRouter.post(
  "/add",
  userAuthMiddleware,
  authorize('add_stock', 'admin_access', 'kitchen_access'),
  createStockValidation,
  validationMiddleware,
  createStock
);

// Get all stock → view_stock or admin or kitchen_access
stockRouter.get(
  "/all",
  userAuthMiddleware,
  authorize('view_stock', 'admin_access', 'kitchen_access'),
  getAllStock
);

// Get active stock → view_stock or admin or kitchen_access
stockRouter.get(
  "/active",
  userAuthMiddleware,
  authorize('view_stock', 'admin_access', 'kitchen_access'),
  getActiveStock
);

// Get stock by status → view_stock or admin or kitchen_access
stockRouter.get(
  "/status",
  userAuthMiddleware,
  authorize('view_stock', 'admin_access', 'kitchen_access'),
  getStockByStatus
);

// Get single stock → view_stock or admin or kitchen_access
stockRouter.get(
  "/:id",
  userAuthMiddleware,
  authorize('view_stock', 'admin_access', 'kitchen_access'),
  getSingleStock
);

// Update stock → admin only
stockRouter.put(
  "/update/:id",
  userAuthMiddleware,
  authorize('admin_access'),
  updateStockValidation,
  validationMiddleware,
  updateStock
);

// Delete stock → admin only
stockRouter.delete(
  "/delete/:id",
  userAuthMiddleware,
  authorize('admin_access'),
  deleteStock
);

export default stockRouter;