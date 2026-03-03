import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Order } from "../models/order.model.js";
import { Table } from "../models/table.model.js";

// Add the order 
export const addOrder = asyncHandler(async (req, res)=>{
    const userId = req.userId;
    const {items, quantity, amount, tableId} = req.body;
    // Check does the table is occupied or not
    const isTableOccupied = await Order.findOne({tableId,  isDeleted: false});
    if (isTableOccupied) {
        return res.respond(400, "Table is already occupied");
    }
    // Update the table status to occupied
    await Table.findByIdAndUpdate(tableId, {isOccupied: true});
    // Create new order
    const newOrder = await Order.create({userId, items, quantity, amount, tableId});
    res.respond(201, "Order placed successfully", newOrder);
});

// Get all orders
export const getOrders = asyncHandler(async (req, res)=>{
    const user = req.userId;
    const orders = await Order.find({userId: user, isDeleted: false, isPaid: false}).select(['isPaid', 'amount', 'tableId.number', 'userId.name', 'items', 'quantity']);
    res.respond(200, "Orders fetched successfully", orders);
});

// Get all order for admin
export const getAllOrders = asyncHandler(async (req, res)=>{
    const orders = await Order.find({isDeleted:false});
    res.respond(200, "Orders fetched successfully", orders);
});

// Get single order 
export const getOrder = asyncHandler(async (req, res)=>{
    const {orderId} = req.params;
    const order = await Order.findById(orderId).populate('tableId').populate('items.foodId');
    res.respond(200, "Order fetched successfully", order);
});

// Delete order
export const deleteOrder = asyncHandler(async (req, res)=>{
    const {orderId} = req.params;
    // Check if table is occopied by this order and make it false
    const order = await Order.findById(orderId);
    if (order) {
        await Table.findByIdAndUpdate(order.tableId, {isOccupied: false});
    }
    if(!order)return res.respond(404, "Order not found");
    await Order.findByIdAndDelete(orderId);
    res.respond(200, "Order deleted successfully");
});

// Update order
export const updateOrder = asyncHandler(async (req, res)=>{
    const {orderId} = req.params;
    const {tableId} = req.body || {};
    // remove the occopied status from the previous table if tableId is changed
    const existingOrder = await Order.findById(orderId);
    if (existingOrder && existingOrder.tableId.toString() !== tableId) {
        await Table.findByIdAndUpdate(existingOrder.tableId, {isOccupied: false});
    }
    // Update the table status to occupied if tableId is changed
    if (existingOrder && existingOrder.tableId.toString() !== tableId) {
        await Table.findByIdAndUpdate(tableId, {isOccupied: true});
    }
    const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body);
    res.respond(200, "Order updated successfully", updatedOrder);
});

// Get only todays orders
export const todayOrderCounts = asyncHandler(async (req, res) => {
    // Get start of today (00:00:00)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    // Get end of today (23:59:59)
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    
    // Count orders created today
    const todaysOrderCount = await Order.countDocuments({
        createdAt: {
            $gte: startOfToday,
            $lte: endOfToday
        },
        isDeleted: false
    });
    
    res.respond(200, "Today's orders count fetched successfully", { count: todaysOrderCount });
});