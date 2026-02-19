import express from "express";
import { generateAndPayBillByOrder } from "../controllers/biller.controller.js";

const BillRouter = express.Router();

// Generate bill by orderId
BillRouter.post("/generate/:orderId", generateAndPayBillByOrder);

export default BillRouter;
