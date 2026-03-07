import { Role } from "../models/role.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.util.js";

// ----------------------- ADD ROLE -----------------------
export const addRole = asyncHandler(async (req, res, next) => {
    const { role, permissions } = req.body;

    // Validate role name
    if (!role) {
        return next(new ErrorHandler(400, "Role is required"));
    }

    // Validate permissions
    if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
        return next(new ErrorHandler(400, "At least one permission is required"));
    }

    // Check if role already exists (case-insensitive)
    const roleFound = await Role.findOne({ 
        role: { $regex: `^${role}$`, $options: "i" }, 
        isDeleted: false 
    });
    if (roleFound) {
        return next(new ErrorHandler(400, "Role already exists"));
    }

    // Create role with permissions
    const newRole = await Role.create({
        role,
        permissions
    });

    // Populate permissions for response
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

    if (role) roleFound.role = role;
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
export const getRoles = asyncHandler(async (req, res, next) => {
    const roles = await Role.find({ isDeleted: false })
        .populate("permissions"); // populate permission details

    res.respond(200, "Roles retrieved successfully", { roles });
});

// ----------------------- GET ROLE BY ID -----------------------
export const getRoleById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const role = await Role.findById(id)
        .populate("permissions");

    if (!role || role.isDeleted) {
        return next(new ErrorHandler(404, "Role not found"));
    }

    res.respond(200, "Role retrieved successfully", { role });
});