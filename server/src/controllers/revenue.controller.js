// controllers/revenue.controller.js
import { Expense } from "../models/expenses.model.js";
import { Order } from "../models/order.model.js";
import { Staff } from "../models/staff.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

export const getRevenue = asyncHandler(async (req, res) => {
  const { type } = req.params;

  if (!["daily", "weekly", "monthly"].includes(type)) {
    return res.respond(400, "Please provide a valid type: daily, weekly, or monthly");
  }

  let start, end;
  const now = new Date();

  // DAILY
  if (type === "daily") {
    start = new Date();
    start.setHours(0, 0, 0, 0);

    end = new Date();
    end.setHours(23, 59, 59, 999);
  }

  // WEEKLY (last 7 days)
  else if (type === "weekly") {
    end = new Date();
    end.setHours(23, 59, 59, 999);

    start = new Date();
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
  }

  // MONTHLY
  else if (type === "monthly") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    start.setHours(0, 0, 0, 0);

    end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
  }

  const orders = await Order.find({
    createdAt: { $gte: start, $lte: end },
  });

  // Find expenses by expensesDate, fallback to createdAt if not found
  let expenses = await Expense.find({
    expensesDate: { $gte: start, $lte: end },
  });
  if (expenses.length === 0) {
    expenses = await Expense.find({
      createdAt: { $gte: start, $lte: end },
    });
  }

  // Debug: log found expenses and their dates
  console.log('Revenue calculation:', {
    start,
    end,
    expenses: expenses.map(e => ({ id: e._id, amount: e.amount, expensesDate: e.expensesDate, createdAt: e.createdAt })),
  });

  const staffSalaries = await Staff.find({
    createdAt: { $gte: start, $lte: end },
  });

  const totalRevenue = orders.reduce((s, o) => s + o.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalSalaries = staffSalaries.reduce((s, st) => s + st.salary, 0);

  const profit = totalRevenue - totalExpenses - totalSalaries;

  res.respond(200, `${type} revenue fetched successfully`, {
    type,
    revenue: totalRevenue - totalExpenses,
    expenses: totalExpenses,
    salaries: totalSalaries,
    profit,
    ordersCount: orders.length,
  });
});