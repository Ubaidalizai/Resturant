// controllers/analytics.controller.js
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Order } from "../models/order.model.js";

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