// controllers/revenue.controller.js

import { Expense } from "../models/expenses.model.js";
import { Order } from "../models/order.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

export const getTodayRevenue = asyncHandler(async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const orders = await Order.find({
    createdAt: { $gte: start, $lte: end },
  });

  const expenses = await Expense.find({
    expensesDate: { $gte: start, $lte: end },
  });

  const totalRevenue = orders.reduce((s, o) => s + o.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  res.respond(200, "Today revenue fetched successfully", {
    revenue: totalRevenue,
    expenses: totalExpenses,
    profit: totalRevenue - totalExpenses,
    ordersCount: orders.length,
  });
});

export const getLastWeekRevenue = asyncHandler(async (req, res) => {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date();
  start.setDate(start.getDate() - 7);
  start.setHours(0, 0, 0, 0);

  const orders = await Order.find({
    createdAt: { $gte: start, $lte: end },
  });

  const expenses = await Expense.find({
    expensesDate: { $gte: start, $lte: end },
  });

  const revenue = orders.reduce((s, o) => s + o.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  res.respond(200, "Last week revenue fetched successfully", {
    revenue,
    expenses: totalExpenses,
    profit: revenue - totalExpenses,
  });
});

export const getMonthlyRevenue = asyncHandler(async (req, res) => {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);

  const orders = await Order.find({
    createdAt: { $gte: start, $lte: end },
  });

  const expenses = await Expense.find({
    expensesDate: { $gte: start, $lte: end },
  });

  const revenue = orders.reduce((s, o) => s + o.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  res.respond(200, "Monthly revenue fetched successfully", {
    revenue,
    expenses: totalExpenses,
    profit: revenue - totalExpenses,
  });
});
