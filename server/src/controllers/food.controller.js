import {asyncHandler} from '../utils/asyncHandler.util.js'
import {Food} from '../models/food.model.js';
// Add Product
export const addFood = asyncHandler(async (req, res)=>{
    // Add the product to DB
    const {name, catagory, price } = req.body;
    // Base64 of Image                                                                                                                                                                      
    const image = req.file.buffer.toString('base64');
    // If the food already exists
    const existingFood = await Food.findOne({ name });
    if(existingFood){
        return res.respond(400, "Food item with this name already exists");
    }
    const newFood = await Food.create({ name, catagory, price, image });
    res.respond(201, "Product added successfully", newFood);
});
// Get Products
export const getFoods = asyncHandler(async (req, res)=>{
    // Fetch products from DB
    const foods = await Food.find({});
    res.respond(200, "Products fetched successfully", foods);
});

// Delete Product
export const deleteFood = asyncHandler(async (req, res)=>{
    // Delete product from DB
    const { foodId } = req.params;
    await Food.findByIdAndDelete(foodId);
    res.respond(200, "Product deleted successfully");
});

// Update Product
export const updateFood = asyncHandler(async (req, res)=>{
    // Update product in DB
    const { foodId } = req.params;
    const { name, catagory, price } = req.body;
    const image = req.file ? req.file.buffer.toString('base64') : undefined;
    const updatedData = { name, catagory, price };
    if(image){
        updatedData.image = image;
    }
    const updatedFood = await Food.findByIdAndUpdate(foodId, updatedData, { new: true });
    res.respond(200, "Product updated successfully", updatedFood);
});