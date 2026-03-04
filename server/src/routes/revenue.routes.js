import express from "express";
import { getRevenue } from "../controllers/revenue.controller.js";

const revenueRouter = express.Router();

// Single unified route
revenueRouter.get("/:type", getRevenue);

export default revenueRouter;