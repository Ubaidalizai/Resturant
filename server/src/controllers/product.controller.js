import asyncHandler from '../utils/asyncHandler.util.js'
export const addProduct = asyncHandler(async (req, res)=>{
    // Add the product to DB
    const {name, catagory, price } = req.body;
    
})