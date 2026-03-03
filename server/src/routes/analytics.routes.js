import express from "express";
import { getSalesComparison, getTopSellingFood, getWorstSellingFood } from "../controllers/analaytics.controller.js";

const analyticsRouter = express.Router();

//  Sales Comparison
// ?type=daily | weekly | monthly
analyticsRouter.get("/sales-comparison", getSalesComparison);

//  Top Selling Food
analyticsRouter.get("/top-selling", getTopSellingFood);

// Worst Selling Food
analyticsRouter.get("/worst-selling", getWorstSellingFood);

export default analyticsRouter;