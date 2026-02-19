import { Bill } from "../models/bill.model.js";
import { Order } from "../models/order.model.js";
import { Table } from "../models/table.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

export const generateAndPayBillByOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) return res.respond(400, "Order ID is required");

  // Find the order
  const order = await Order.findById(orderId);
  if (!order) return res.respond(404, "Order not found");

  const tableId = order.tableId;

  // Check unpaid orders for the table
  const orders = await Order.find({ tableId, isPaid: false, isDeleted: false })
    .populate("items.foodId", "name price");

  if (!orders.length) return res.respond(400, "No active orders for this table");

  // Calculate totals
  const totalAmount = orders.reduce((acc, o) => acc + o.amount, 0);
  const grandTotal = totalAmount; // as per your schema

  // Create and pay the bill immediately
  const bill = await Bill.create({
    tableId,
    orders: orders.map(o => o._id),
    totalAmount,
    grandTotal,
    paymentStatus: "paid",
    paidAt: new Date(),
  });

  // Mark all orders of this table as paid
  await Order.updateMany({ tableId, isPaid: false }, { isPaid: true });

  // Free the table
  await Table.findByIdAndUpdate(tableId, { isOccupied: false });

  // Populate the bill for response
  const populatedBill = await Bill.findById(bill._id)
    .populate({
      path: "orders",
      populate: { path: "items.foodId", select: "name price" }
    })
    .populate("tableId", "tableNumber");

  res.respond(201, "Bill generated and paid successfully", populatedBill);
});
