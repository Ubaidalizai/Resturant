import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Order } from "../models/order.model.js";
import { Table } from "../models/table.model.js";
import { Food } from "../models/food.model.js";

export const addOrder = asyncHandler(async (req, res) => {
  if (!req.user) return res.respond(401, "User not authenticated");
  const id = req.user.id;
  const { items, tableId, customer } = req.body;

  if (!items || !items.length)
    return res.respond(400, "Order items are required");

  // Check table exists
  const table = await Table.findOne({ _id: tableId, isDeleted: false });
  if (!table) return res.respond(404, "Table not found");

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

  // Create order (removed isOccupied logic)
  const newOrder = await Order.create({
    owner: id,
    items,
    tableId,
    amount: totalAmount,   // keep for reference if needed
    totalAmount,
    isPaid: false, 
    customer
  });
  table.isOccupied = true;
  await table.save();
  console.log(table);
  res.respond(201, "Order placed successfully", newOrder);
});

// Get all unpaid orders for user
export const getOrders = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    // Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // today 00:00:00

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // today 23:59:59

    // Fetch today's orders
    const orders = await Order.find({
        owner:userId,
        isDeleted: false,
        isPaid: false,
        createdAt: { $gte: startOfDay, $lte: endOfDay }
    })
    .populate('tableId', 'tableNumber')
    .populate('items.foodId', 'name price');
    res.respond(200, "Today's orders fetched successfully", orders);
    console.log("Orders:", orders);
});

// Get all orders for admin
export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ isDeleted: false })
        .populate('tableId', 'tableNumber')
        .populate('items.foodId', 'name price');
    res.respond(200, "Orders fetched successfully", orders);
});

// Get kitchen orders for kitchen staff
export const getKitchenOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({
        isDeleted: false,
        status: { $nin: ["Completed"] }
    })
        .populate('tableId', 'tableNumber')
        .populate('items.foodId', 'name price');

    res.respond(200, "Kitchen orders fetched successfully", orders);
});

// Get orders by table
export const getOrdersByTable = asyncHandler(async (req, res) => {
    const { tableId } = req.params;
    if (!tableId) return res.respond(400, "Table ID is required");

    const orders = await Order.find({
        tableId,
        isDeleted: false,
        isPaid: false,
    })
        .populate('tableId', 'tableNumber')
        .populate('items.foodId', 'name price');

    res.respond(200, "Table orders fetched successfully", orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const validStatuses = ["Pending", "In Kitchen", "Ready", "Completed"];

    if (!status || !validStatuses.includes(status)) {
        return res.respond(400, "Invalid status. Use Pending, In Kitchen, Ready, or Completed");
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
    )
        .populate('tableId', 'tableNumber')
        .populate('items.foodId', 'name price');

    if (!updatedOrder) return res.respond(404, "Order not found");

    res.respond(200, "Order status updated successfully", updatedOrder);
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

// Get orders count by type (daily, weekly, monthly)
export const orderCounts = asyncHandler(async (req, res) => {
    const { type } = req.params;

    let startDate = new Date();
    let endDate = new Date();

    if (type === "daily") {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
    }

    else if (type === "weekly") {
        const currentDay = startDate.getDay(); // 0-6
        const diff = startDate.getDate() - currentDay;

        startDate = new Date(startDate.setDate(diff));
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
    }

    else if (type === "monthly") {
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
    }

    else {
        return res.respond(400, "Invalid type. Use daily, weekly, or monthly");
    }

    const count = await Order.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate },
        isDeleted: false
    });

    res.respond(200, `${type} orders count fetched successfully`, { count });
});