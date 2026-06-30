import { Staff } from "../models/staff.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { generateSalaryForStaff } from "../services/salary.service.js";

// Add new staff
export const addStaff = asyncHandler(async (req, res) => {
  const {
    fullName,
    phone,
    address,
    nationalId,
    salary,
    image,
    employmentType,
    status,
    role,
  } = req.body;

  const existingStaff = await Staff.findOne({ phone, isDeleted: false });
  if (existingStaff) return res.respond(400, "Staff with this phone number already exists");

  const newStaff = await Staff.create({
    fullName,
    phone,
    address,
    nationalId,
    salary,
    image,
    employmentType: employmentType || "full-time",
    status: status || "active",
    role: role || "",
  });

  const now = new Date();
  await generateSalaryForStaff(newStaff._id, now.getMonth() + 1, now.getFullYear());

  res.respond(201, "Staff added successfully", newStaff);
});

// Get all staff
export const getAllStaff = asyncHandler(async (req, res) => {
  const staffList = await Staff.find({ isDeleted: false }).sort({ createdAt: -1 });
  res.respond(200, "All staff fetched successfully", staffList);
});

// Get single staff
export const getSingleStaff = asyncHandler(async (req, res) => {
  const { staffId } = req.params;

  const staff = await Staff.findOne({ _id: staffId, isDeleted: false });

  if (!staff) return res.respond(404, "Staff not found");

  res.respond(200, "Staff fetched successfully", staff);
});

// Update staff
export const updateStaff = asyncHandler(async (req, res) => {
  const { staffId } = req.params;
  const updates = req.body;

  const staff = await Staff.findOneAndUpdate(
    { _id: staffId, isDeleted: false },
    updates,
    { new: true }
  );

  if (!staff) return res.respond(404, "Staff not found");

  res.respond(200, "Staff updated successfully", staff);
});

// Delete staff (soft delete)
export const deleteStaff = asyncHandler(async (req, res) => {
  const { staffId } = req.params;

  const staff = await Staff.findOneAndUpdate(
    { _id: staffId, isDeleted: false },
    { isDeleted: true, status: "inactive" },
    { new: true }
  );

  if (!staff) return res.respond(404, "Staff not found");

  res.respond(200, "Staff deleted successfully", staff);
});