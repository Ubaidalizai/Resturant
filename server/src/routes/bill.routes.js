import express from "express";
import { generateBillByOrder, payBillByOrder } from "../controllers/biller.controller.js";

const BillRouter = express.Router();

// Generate invoice preview for a single order
BillRouter.get("/generate/:orderId", generateBillByOrder);

// Mark the invoice/order as paid
BillRouter.post("/pay/:orderId", payBillByOrder);

export default BillRouter;
