import { asyncHandler } from '../utils/asyncHandler.util.js';
import { Food } from '../models/food.model.js';
import fs from "fs";
import path from "path";
import { Order } from '../models/order.model.js';

// Add Food
export const addFood = asyncHandler(async (req, res) => {
    const { name, catagory, price } = req.body;

    // Check if image exists
    if (!req.file) return res.respond(400, "Image is required");

    // Check if the food already exists
    const existingFood = await Food.findOne({ name });
    if (existingFood) return res.respond(400, "Food item with this name already exists");

    const imagePath = `/uploads/food_images/${req.file.filename}`; // save relative path
    const newFood = await Food.create({ name, catagory, price, image: imagePath });

    res.respond(201, "Product added successfully", newFood);
});

// Get Foods
export const getFoods = asyncHandler(async (req, res) => {
    const foods = await Food.find({ isDeleted: false }, {isDeleted: 0});
    res.respond(200, "Products fetched successfully", foods);
});

// Delete Food
export const deleteFood = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const food = await Food.findById(productId);
    if (!food) return res.respond(404, "Food not found");

    // Delete image file
    if (food.image) {
        const imagePath = path.join(".", food.image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    food.isDeleted = true;
    await food.save();
    res.respond(200, "Product deleted successfully");
});

// Update Food
export const updateFood = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { name, catagory, price } = req.body;
    const updatedData = { name, catagory, price };

    if (req.file) {
        const food = await Food.findById(productId);
        if (!food) return res.respond(404, "Food not found");

        // Delete old image if exists
        if (food.image) {
            const oldImagePath = path.join(".", food.image);
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }

        // Save new image path
        updatedData.image = `/uploads/food_images/${req.file.filename}`;
    }

    const updatedFood = await Food.findByIdAndUpdate(productId, updatedData, { new: true });
    res.respond(200, "Product updated successfully", updatedFood);
});


// Get Foods by Slaes
export const getFoodBySales = asyncHandler(async (req, res) => {

    const type = req.query.type || "top"; // default = top

    // Determine sort order
    const sortOrder = type === "worst" ? 1 : -1;

    const result = await Order.aggregate([
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.foodId",
                totalSold: { $sum: "$items.quantity" }
            }
        },
        { $sort: { totalSold: sortOrder } },
        { $limit: 1 },
        {
            $lookup: {
                from: "foods",
                localField: "_id",
                foreignField: "_id",
                as: "food"
            }
        },
        { $unwind: "$food" },
        {
            $project: {
                _id: "$food._id",
                name: "$food.name",
                image: "$food.image",
                price: "$food.price",
                totalSold: 1
            }
        }
    ]);

    if (!result.length)
        return res.respond(404, "No sales data found");

    res.respond(
        200,
        `${type === "worst" ? "Worst" : "Top"} selling food fetched successfully`,
        result[0]
    );
});

export const getMenueFoods = asyncHandler(async (req, res) => {
    const { menuId } = req.params;
    const foods = await Food.find({ catagory: menuId, isDeleted: false }, {isDeleted: 0});
    if(!foods.length) return res.respond(400, "No foods found for this menu");
    res.respond(200, "Products fetched successfully", foods);
}   
);