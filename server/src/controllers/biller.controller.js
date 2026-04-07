import mongoose from "mongoose";
import { Bill } from "../models/bill.model.js";
import { Order } from "../models/order.model.js";
import { Table } from "../models/table.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

/**
 * Generate Bill (PREVIEW ONLY — DOES NOT PAY)
 */
export const generateBillByOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.respond(400, "Order ID is required");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    return res.respond(404, "Order not found");
  }

  if (order.isPaid) {
    return res.respond(400, "Order is already paid");
  }

  // Use $in to safely match array field
  let bill = await Bill.findOne({
    orders: { $in: [order._id] },
    paymentStatus: "pending",
  });

  // If no pending bill exists, create one
  if (!bill) {
    bill = await Bill.create({
      tableId: order.tableId,
      orders: [order._id],
      totalAmount: order.amount ?? order.totalAmount ?? 0,
      grandTotal: order.amount ?? order.totalAmount ?? 0,
      paymentStatus: "pending",
      paidAt: null,
    });
  }

  const populatedBill = await Bill.findById(bill._id)
    .populate({
      path: "orders",
      populate: {
        path: "items.foodId",
        select: "name price",
      },
    })
    .populate("tableId", "tableNumber");

  return res.respond(200, "Bill generated successfully", populatedBill);
});

/**
 * Pay Bill (ONLY HERE ORDER BECOMES PAID)
 */
export const payBillByOrder = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log("PAY ORDER ID:", orderId);

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(orderId);
    console.log("ORDER FOUND:", order);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: "Order already paid" });
    }

    let bill = await Bill.findOne({
      orders: { $in: [order._id] },
      paymentStatus: "pending",
    });

    console.log("BILL FOUND:", bill);

    if (!bill) {
      bill = await Bill.create({
        tableId: order.tableId,
        orders: [order._id],
        totalAmount: order.amount ?? order.totalAmount ?? 0,
        grandTotal: order.amount ?? order.totalAmount ?? 0,
        paymentStatus: "pending",
        paidAt: null,
      });

      console.log("BILL CREATED:", bill);
    }

    bill.paymentStatus = "paid";
    bill.paidAt = new Date();
    await bill.save();

    order.isPaid = true;
    await order.save();

    const remainingUnpaid = await Order.countDocuments({
      tableId: order.tableId,
      isPaid: false,
      isDeleted: false,
    });

    if (remainingUnpaid === 0) {
      await Table.findByIdAndUpdate(order.tableId, {
        isOccupied: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment successful",
    });
  } catch (error) {
    console.error("PAY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});