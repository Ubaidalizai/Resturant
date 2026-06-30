import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.util.js";
import { Role } from "../models/role.model.js";

const isValidRoleName = (name) =>
  typeof name === "string" && name.trim().length > 0;

// ----------------------- ADD ROLE -----------------------
export const addRole = asyncHandler(async (req, res, next) => {
  const { role, permissions } = req.body;

  if (!isValidRoleName(role)) {
    return next(new ErrorHandler(400, "Role name is required"));
  }

  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
    return next(new ErrorHandler(400, "At least one permission is required"));
  }

  const trimmedRole = role.trim();

  const roleFound = await Role.findOne({
    role: { $regex: `^${trimmedRole.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
    isDeleted: false,
  });
  if (roleFound) {
    return next(new ErrorHandler(400, "Role already exists"));
  }

  const newRole = await Role.create({
    role: trimmedRole,
    permissions,
  });

  await newRole.populate("permissions");
  res.respond(201, "Role added successfully", { role: newRole });
});

// ----------------------- UPDATE ROLE -----------------------
export const updateRole = asyncHandler(async (req, res, next) => {
  const { id, role, permissions } = req.body;

  const roleFound = await Role.findById(id);
  if (!roleFound || roleFound.isDeleted) {
    return next(new ErrorHandler(404, "Role not found"));
  }

  if (role !== undefined) {
    if (!isValidRoleName(role)) {
      return next(new ErrorHandler(400, "Role name is required"));
    }
    roleFound.role = role.trim();
  }
  if (permissions && Array.isArray(permissions)) roleFound.permissions = permissions;
  await roleFound.save();
  await roleFound.populate("permissions");
  res.respond(200, "Role updated successfully", { role: roleFound });
});

// ----------------------- DELETE ROLE -----------------------
export const deleteRole = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedRole = await Role.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!deletedRole) {
    return next(new ErrorHandler(404, "Role not found"));
  }

  res.respond(200, "Role deleted successfully", { role: deletedRole });
});

// ----------------------- GET ALL ROLES -----------------------
export const getRoles = asyncHandler(async (req, res) => {
  // Soft-delete roles with empty or null names
  await Role.updateMany(
    {
      isDeleted: false,
      $or: [{ role: null }, { role: "" }, { role: { $regex: /^\s*$/ } }],
    },
    { isDeleted: true }
  );

  const roles = await Role.find({
    isDeleted: false,
    role: { $exists: true, $nin: [null, ""] },
  })
    .where("role")
    .ne("")
    .populate("permissions");

  const validRoles = roles.filter((r) => isValidRoleName(r.role));
  res.respond(200, "Roles retrieved successfully", { roles: validRoles });
});

// ----------------------- GET ROLE BY ID -----------------------
export const getRoleById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const role = await Role.findById(id).populate("permissions");

  if (!role || role.isDeleted || !isValidRoleName(role.role)) {
    return next(new ErrorHandler(404, "Role not found"));
  }

  res.respond(200, "Role retrieved successfully", { role });
});
