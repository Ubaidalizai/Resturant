import {asyncHandler} from '../utils/asyncHandler.util.js'
import {Product} from '../models/product.model.js';
export const addProduct = asyncHandler(async (req, res)=>{
    // Add the product to DB
    const {name, catagory, price } = req.body;
    // Base64 of Image 
    const image = req.file.buffer.toString('base64');
    const newProduct = await Product.create({ name, catagory, price, image });
    res.respond(201, "Product added successfully", newProduct);
});

export const getProducts = asyncHandler(async (req, res)=>{
    // Fetch products from DB
    const products = await Product.find({});
    res.respond(200, "Products fetched successfully", products);
});

export const deleteProduct = asyncHandler(async (req, res)=>{
    // Delete product from DB
    const { productId } = req.params;
    await Product.findByIdAndDelete(productId);
    res.respond(200, "Product deleted successfully");
});