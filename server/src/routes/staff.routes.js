import express from "express";
import { addStaff, getAllStaff, getSingleStaff, updateStaff, deleteStaff } from "../controllers/staff.controller.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { staffValidation } from "../validators/staff.validator.js";
import { validationMiddleware } from "../middlewares/validationsHandler.utils.js";

const Staffrouter = express.Router();
// All staff routes should be protected (admin only)
// Staffrouter.use(authorizeRoles("admin"));

// Add new staff
Staffrouter.post("/add", staffValidation, validationMiddleware, addStaff);

// Get all staff
Staffrouter.get("/all", getAllStaff);

// Get single staff by ID
Staffrouter.get("/:staffId", getSingleStaff);

// Update staff
Staffrouter.put("/update/:staffId", staffValidation, validationMiddleware, updateStaff);

// Delete staff (soft delete)
Staffrouter.delete("/delete/:staffId", deleteStaff);

export default Staffrouter;