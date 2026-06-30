import { Bill } from "../models/bill.model.js";
import { Order } from "../models/order.model.js";
import { Table } from "../models/table.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { recordRevenueEntry } from "../services/accounting.service.js";

export const generateAndPayBillByOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) return res.respond(400, "Order ID is required");

  const order = await Order.findById(orderId);
  if (!order) return res.respond(404, "Order not found");

  if (order.isPaid) return res.respond(400, "Order is already paid");

  const tableId = order.tableId;
  const totalAmount = order.totalAmount || order.amount || 0;
  const grandTotal = totalAmount;

  const bill = await Bill.create({
    tableId,
    orders: [order._id],
    totalAmount,
    grandTotal,
    paymentStatus: "paid",
    paidAt: new Date(),
  });

  await Order.findByIdAndUpdate(orderId, { isPaid: true });

  const remainingUnpaid = await Order.countDocuments({
    tableId,
    isPaid: false,
    isDeleted: false,
  });
  if (remainingUnpaid === 0) {
    await Table.findByIdAndUpdate(tableId, { isOccupied: false });
  }

  await recordRevenueEntry({
    billId: bill._id,
    amount: grandTotal,
    userId: req.user?.id,
  });

  const populatedBill = await Bill.findById(bill._id)
    .populate({
      path: "orders",
      populate: { path: "items.foodId", select: "name price" }
    })
    .populate("tableId", "tableNumber");

  res.respond(201, "Bill generated and paid successfully", populatedBill);
});
