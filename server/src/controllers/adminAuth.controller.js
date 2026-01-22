import { asyncHandler } from "../utils/asyncHandler.util";

export const handleAdminRegistration = asyncHandler(async (req, res)=>{
    const {name, password} = req.body;
    
})