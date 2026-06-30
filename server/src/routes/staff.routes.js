import express from "express";
import { addStaff, getAllStaff, getSingleStaff, updateStaff, deleteStaff } from "../controllers/staff.controller.js";
import { staffValidation } from "../validators/staff.validator.js";
import { validationMiddleware } from "../middlewares/validationsHandler.utils.js";
import { userAuthMiddleware } from "../middlewares/userAuth.middleware.js";
import { authorize } from "../middlewares/authorizeRole.middleware.js";

const Staffrouter = express.Router();
Staffrouter.use(userAuthMiddleware); // Ensure user is authenticated for all role routes
Staffrouter.use(authorize('admin_access', 'panel_access'));
// Add new staff → admin only
Staffrouter.post(
  "/add",
  staffValidation,
  validationMiddleware,
  addStaff
);

// Get all staff → admin only
Staffrouter.get(
  "/all",
  getAllStaff
);

// Get single staff by ID → admin only
Staffrouter.get(
  "/:staffId",
  getSingleStaff
);

// Update staff → admin only
Staffrouter.put(
  "/update/:staffId",
  staffValidation,
  validationMiddleware,
  updateStaff
);

// Delete staff (soft delete) → admin only
Staffrouter.delete(
  "/delete/:staffId",
  deleteStaff
);

export default Staffrouter;