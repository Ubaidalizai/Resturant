import express from "express";
import {
  getTodayRevenue,
  getLastWeekRevenue,
  getMonthlyRevenue,
} from "../controllers/revenue.controller.js";

const revenueRouter = express.Router();

revenueRouter.get("/today", getTodayRevenue);
revenueRouter.get("/last-week", getLastWeekRevenue);
revenueRouter.get("/monthly", getMonthlyRevenue);

export default revenueRouter;