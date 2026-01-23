import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Order } from "../models/order.model.js";

// Add the order 
export const addOrder = asyncHandler(async (req, res)=>{
    const {userId, items, quantity, amount, tableId} = req.body;
    const newOrder = await Order.create({userId, items, quantity, amount, tableId});
    res.respond(201, "Order placed successfully", newOrder);
});
// Get all orders
export const getOrders = asyncHandler(async (req, res)=>{
    const orders = await Order.find({}).populate('userId').populate('tableId').populate('items.foodId');
    res.respond(200, "Orders fetched successfully", orders);
});

// Get single order 
export const getOrder = asyncHandler(async (req, res)=>{
    const {orderId} = req.params;
    const order = await Order.findById(orderId).populate('userId').populate('tableId').populate('items.foodId');
    res.respond(200, "Order fetched successfully", order);
});

// Delete order
export const deleteOrder = asyncHandler(async (req, res)=>{
    const {orderId} = req.params;
    await Order.findByIdAndDelete(orderId);
    res.respond(200, "Order deleted successfully");
});



