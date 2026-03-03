import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Order } from "../models/order.model.js";
import { Table } from "../models/table.model.js";
import { Food } from "../models/food.model.js";

// Add new order
export const addOrder = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const { items, tableId } = req.body;

    if (!items || !items.length)
        return res.respond(400, "Order items are required");

    // Check table exists
    const table = await Table.findOne({ _id: tableId, isDeleted: false });
    if (!table) return res.respond(404, "Table not found");
    if (table.isOccupied) return res.respond(400, "Table is already occupied");

    // Fetch food prices
    const foodIds = items.map(item => item.foodId);
    const foods = await Food.find({ _id: { $in: foodIds } }).select("price");

    const foodMap = {};
    foods.forEach(food => { foodMap[food._id] = food.price });

    // Calculate totalAmount
    let totalAmount = 0;
    for (const item of items) {
        const price = foodMap[item.foodId];
        if (!price) return res.respond(400, "Invalid food item");
        totalAmount += price * item.quantity;
    }

    // Mark table as occupied
    table.isOccupied = true;
    await table.save();

    // Create order
    const newOrder = await Order.create({
        userId,
        items,
        tableId,
        amount: totalAmount,   // keep for reference if needed
        totalAmount,           // this is now correctly stored
        isPaid: false
    });

    res.respond(201, "Order placed successfully", newOrder);
});

// Get all unpaid orders for user
export const getOrders = asyncHandler(async (req, res) => {
    const user = req.user.id;
    
    const orders = await Order.find({ userId: user, isDeleted: false, isPaid: false })
        .populate('tableId', 'number')
        .populate('items.foodId', 'name price');
    res.respond(200, "Orders fetched successfully", orders);
});

// Get all orders for admin
export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ isDeleted: false })
        .populate('tableId', 'number')
        .populate('items.foodId', 'name price');
    res.respond(200, "Orders fetched successfully", orders);
});

// Get single order
export const getOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
        .populate('tableId')
        .populate('items.foodId', 'name price');
    if (!order) return res.respond(404, "Order not found");
    res.respond(200, "Order fetched successfully", order);
});

// Delete order
export const deleteOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.respond(404, "Order not found");

    // Free the table if occupied
    await Table.findByIdAndUpdate(order.tableId, { isOccupied: false });

    await Order.findByIdAndDelete(orderId);
    res.respond(200, "Order deleted successfully");
});

// Update order
export const updateOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { tableId, items } = req.body;

    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) return res.respond(404, "Order not found");

    // Free old table if changed
    if (tableId && existingOrder.tableId.toString() !== tableId) {
        await Table.findByIdAndUpdate(existingOrder.tableId, { isOccupied: false });
        await Table.findByIdAndUpdate(tableId, { isOccupied: true });
    }

    // Recalculate totalAmount if items changed
    let totalAmount = existingOrder.totalAmount;
    if (items && items.length) {
        const foodIds = items.map(i => i.foodId);
        const foods = await Food.find({ _id: { $in: foodIds } }).select("price");
        const foodMap = {};
        foods.forEach(f => { foodMap[f._id] = f.price });

        totalAmount = 0;
        for (const item of items) {
            const price = foodMap[item.foodId];
            if (!price) return res.respond(400, "Invalid food item");
            totalAmount += price * item.quantity;
        }
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { ...req.body, totalAmount }, { new: true });
    res.respond(200, "Order updated successfully", updatedOrder);
});

// Get today's orders count
export const todayOrderCounts = asyncHandler(async (req, res) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todaysOrderCount = await Order.countDocuments({
        createdAt: { $gte: startOfToday, $lte: endOfToday },
        isDeleted: false
    });

    res.respond(200, "Today's orders count fetched successfully", { count: todaysOrderCount });
});