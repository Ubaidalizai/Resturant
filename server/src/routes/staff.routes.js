import express from "express";
import { addStaff, getAllStaff, getSingleStaff, updateStaff, deleteStaff } from "../controllers/staff.controller.js";
import { staffValidation } from "../validators/staff.validator.js";
import { validationMiddleware } from "../middlewares/validationsHandler.utils.js";
import { userAuthMiddleware } from "../middlewares/userAuth.middleware.js";
import { authorize } from "../middlewares/authorizeRole.middleware.js";

const Staffrouter = express.Router();

// Add new staff → admin only
Staffrouter.post(
  "/add",
  userAuthMiddleware,
  authorize('admin_access'),
  staffValidation,
  validationMiddleware,
  addStaff
);

// Get all staff → admin only
Staffrouter.get(
  "/all",
  userAuthMiddleware,
  authorize('admin_access'),
  getAllStaff
);

// Get single staff by ID → admin only
Staffrouter.get(
  "/:staffId",
  userAuthMiddleware,
  authorize('admin_access'),
  getSingleStaff
);

// Update staff → admin only
Staffrouter.put(
  "/update/:staffId",
  userAuthMiddleware,
  authorize('admin_access'),
  staffValidation,
  validationMiddleware,
  updateStaff
);

// Delete staff (soft delete) → admin only
Staffrouter.delete(
  "/delete/:staffId",
  userAuthMiddleware,
  authorize('admin_access'),
  deleteStaff
);

export default Staffrouter;