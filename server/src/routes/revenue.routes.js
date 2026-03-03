import express from "express";
import { getRevenue } from "../controllers/revenue.controller.js";

const revenueRouter = express.Router();

// Single unified route
revenueRouter.get("/", getRevenue);

export default revenueRouter;