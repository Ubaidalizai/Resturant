import { Permission } from "../models/permisson.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

export const getAllPermission = asyncHandler(async (req, res, next)=>{
    const permission = await Permission.find({});
    console.log(permission);
    res.respond(200, "Permission fetched successfully", permission);
});
