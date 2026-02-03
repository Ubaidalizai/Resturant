import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

// Get all the user
export const getAllUser = asyncHandler(async (req, res) => {
    const users = await User.find({ isDeleted: false }).select(['name', 'email', 'phone', 'address', 'image', 'createdAt']);
    res.respond(200, "Users fetched successfully", users);
});

// Delete user
export const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const deleteUser = await User.findByIdAndUpdate(userId, { isDeleted: true });
    if (!deleteUser) {
        return res.respond(404, "User not found");
    }
    res.respond(200, "User deleted successfully");
});

// Update user
export const updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!updatedUser) {
        return res.respond(404, "User not found");
    }
    res.respond(200, "User updated successfully", updatedUser);
});

// Get The single user
export const getSingleUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findOne({_id: userId, isDeleted: false}).select(['name', 'email', 'createdAt']);
    if (!user) {
        return res.respond(404, "User not found");
    }
    res.respond(200, "User fetched successfully", user);
});

// Delete All the user
export const deleteAllUser = asyncHandler(async (req, res) => {
    await User.updateMany({}, { isDeleted: true });
    res.respond(200, "All users deleted successfully");
});