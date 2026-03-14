import express from "express";
import { getChartData, getSalesComparison, getTopSellingFood, getWorstSellingFood } from "../controllers/analaytics.controller.js";
import { userAuthMiddleware } from "../middlewares/userAuth.middleware.js";
import { authorize } from "../middlewares/authorizeRole.middleware.js";

const analyticsRouter = express.Router();
analyticsRouter.use(userAuthMiddleware);
analyticsRouter.use(authorize('admin_access', 'overview_access', 'order_history_access', 'sales_report_access'));
//  Sales Comparison
// ?type=daily | weekly | monthly
analyticsRouter.get("/sales-comparison", getSalesComparison);

//  Top Selling Food
analyticsRouter.get("/top-selling", getTopSellingFood);

// Worst Selling Food
analyticsRouter.get("/worst-selling", getWorstSellingFood);
analyticsRouter.get("/chart-data", getChartData);
export default analyticsRouter;