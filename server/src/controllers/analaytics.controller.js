// controllers/analytics.controller.js
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Order } from "../models/order.model.js";
import { Expense } from "../models/expenses.model.js";
import { Salary } from "../models/salary.model.js";

// Helper: Calculate percentage change safely
const calculatePercentage = (current, previous) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return Number((((current - previous) / previous) * 100).toFixed(2));
};

// Helper: Get date ranges for daily/weekly/monthly comparison (UTC)
const getDateRanges = (type) => {
    const now = new Date();
    let currentStart, previousStart, previousEnd;

    if (type === "weekly") {
        const day = now.getUTCDay(); // 0 (Sun) - 6 (Sat)
        const diffToMonday = day === 0 ? 6 : day - 1;
        currentStart = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() - diffToMonday,
            0, 0, 0, 0
        ));
        previousStart = new Date(currentStart);
        previousStart.setUTCDate(previousStart.getUTCDate() - 7);
        previousEnd = new Date(currentStart);
        previousEnd.setMilliseconds(-1);
    } else if (type === "monthly") {
        currentStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0,0,0,0));
        previousStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1, 0,0,0,0));
        previousEnd = new Date(currentStart);
        previousEnd.setMilliseconds(-1);
    } else {
        currentStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0,0,0,0));
        previousStart = new Date(currentStart);
        previousStart.setUTCDate(previousStart.getUTCDate() - 1);
        previousEnd = new Date(currentStart);
        previousEnd.setMilliseconds(-1);
    }

    return { currentStart, previousStart, previousEnd };
};

// Sales Comparison Controller
export const getSalesComparison = asyncHandler(async (req, res) => {
    const type = req.query.type || "daily";
    const { currentStart, previousStart, previousEnd } = getDateRanges(type);

    // Current period total
    const [currentData] = await Order.aggregate([
        { $match: { createdAt: { $gte: currentStart }, isDeleted: false } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    // Previous period total
    const [previousData] = await Order.aggregate([
        { $match: { createdAt: { $gte: previousStart, $lte: previousEnd }, isDeleted: false } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const currentTotal = currentData?.total || 0;
    const previousTotal = previousData?.total || 0;
    const percentageChange = calculatePercentage(currentTotal, previousTotal);

    res.respond(200, "Sales comparison fetched successfully", {
        type,
        currentPeriodTotal: currentTotal,
        previousPeriodTotal: previousTotal,
        percentageChange,
        trend: percentageChange >= 0 ? "increase" : "decrease"
    });
});

// Top Selling Food Controller
export const getTopSellingFood = asyncHandler(async (req, res) => {
    const result = await Order.aggregate([
        { $match: { isDeleted: false } },
        { $unwind: "$items" },
        { $group: { _id: "$items.foodId", totalSold: { $sum: "$items.quantity" } } },
        { $sort: { totalSold: -1 } },
        { $limit: 1 },
        { $lookup: { from: "foods", localField: "_id", foreignField: "_id", as: "food" } },
        { $unwind: "$food" },
        { $project: { _id: "$food._id", name: "$food.name", image: "$food.image", price: "$food.price", totalSold: 1 } }
    ]);

    if (!result.length) return res.respond(404, "No sales data found");
    res.respond(200, "Top selling food fetched successfully", result[0]);
});

// Top N Best-Selling Food Items
export const getTopSellingItems = asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 10, 20);

    const result = await Order.aggregate([
        { $match: { isDeleted: false, isPaid: true } },
        { $unwind: "$items" },
        { $group: { _id: "$items.foodId", totalSold: { $sum: "$items.quantity" } } },
        { $sort: { totalSold: -1 } },
        { $limit: limit },
        { $lookup: { from: "foods", localField: "_id", foreignField: "_id", as: "food" } },
        { $unwind: { path: "$food", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 1,
                name: { $ifNull: ["$food.name", "Unknown"] },
                totalSold: 1,
                price: { $ifNull: ["$food.price", 0] },
            },
        },
    ]);

    res.respond(200, "Top selling items fetched successfully", result);
});

// Worst Selling Food Controller
export const getWorstSellingFood = asyncHandler(async (req, res) => {
    const result = await Order.aggregate([
        { $unwind: "$items" },
        { $group: { _id: "$items.foodId", totalSold: { $sum: "$items.quantity" } } },
        { $sort: { totalSold: 1 } },
        { $limit: 1 },
        { $lookup: { from: "foods", localField: "_id", foreignField: "_id", as: "food" } },
        { $unwind: "$food" },
        { $project: { _id: "$food._id", name: "$food.name", image: "$food.image", price: "$food.price", totalSold: 1 } }
    ]);

    if (!result.length) return res.respond(404, "No sales data found");
    res.respond(200, "Worst selling food fetched successfully", result[0]);
});

// Chart Data Controller (Daily / Weekly / Monthly grouped)
export const getChartData = asyncHandler(async (req, res) => {
    const { type, start, end } = req.query;

    let startDate, endDate;
    const now = new Date();

    // ✅ Custom Date Filter
    if (start && end) {
        startDate = new Date(start);
        endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);
    }

    // ✅ Type Filter
    else if (type) {
        if (!["daily", "weekly", "monthly"].includes(type)) {
            return res.respond(400, "Invalid type");
        }

        if (type === "daily") {
            startDate = new Date();
            startDate.setUTCDate(startDate.getUTCDate() - 6);
        }

        if (type === "weekly") {
            startDate = new Date();
            startDate.setUTCDate(startDate.getUTCDate() - 28);
        }

        if (type === "monthly") {
            startDate = new Date();
            startDate.setUTCMonth(startDate.getUTCMonth() - 6);
        }

        endDate = now;
    }

    else {
        return res.respond(400, "Provide type or start & end date");
    }

    const data = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate },
                isDeleted: false
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: type === "monthly" ? "%Y-%m" : "%Y-%m-%d",
                        date: "$createdAt"
                    }
                },
                revenue: { $sum: "$totalAmount" },
                orders: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const formatted = data.map(item => ({
        date: item._id,
        revenue: item.revenue,
        orders: item.orders
    }));

    res.respond(200, "Chart data fetched successfully", formatted);
});

export const getDashboardSummary = asyncHandler(async (req, res) => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);

    const orderMatch = (start, end) => ({
        createdAt: { $gte: start, $lte: end },
        isDeleted: false,
    });

    const [
        todayOrderStats,
        monthOrderStats,
        todayExpenseStats,
        monthExpenseStats,
        salaries,
    ] = await Promise.all([
        Order.aggregate([
            { $match: orderMatch(todayStart, todayEnd) },
            { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } },
        ]),
        Order.aggregate([
            { $match: orderMatch(monthStart, monthEnd) },
            { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } },
        ]),
        Expense.aggregate([
            { $match: { expensesDate: { $gte: todayStart, $lte: todayEnd }, isDeleted: false } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Expense.aggregate([
            { $match: { expensesDate: { $gte: monthStart, $lte: monthEnd }, isDeleted: false } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Salary.find({ month, year, isDeleted: false }).select("status finalSalary").lean(),
    ]);

    const todayRevenue = todayOrderStats[0]?.revenue || 0;
    const monthRevenue = monthOrderStats[0]?.revenue || 0;
    const todayExpenseTotal = todayExpenseStats[0]?.total || 0;
    const monthExpenseTotal = monthExpenseStats[0]?.total || 0;
    const paidSalaries = salaries.filter((s) => s.status === "Paid").reduce((sum, s) => sum + s.finalSalary, 0);
    const pendingSalaries = salaries.filter((s) => s.status === "Pending").reduce((sum, s) => sum + s.finalSalary, 0);

    res.respond(200, "Dashboard summary fetched", {
        todayOrders: todayOrderStats[0]?.count || 0,
        monthOrders: monthOrderStats[0]?.count || 0,
        todayRevenue,
        monthRevenue,
        todayExpenses: todayExpenseTotal,
        monthExpenses: monthExpenseTotal,
        monthProfit: monthRevenue - monthExpenseTotal - paidSalaries,
        paidSalaries,
        pendingSalaries,
        salaryPaidCount: salaries.filter((s) => s.status === "Paid").length,
        salaryPendingCount: salaries.filter((s) => s.status === "Pending").length,
    });
});