import express from "express";
import { generateAndPayBillByOrder } from "../controllers/biller.controller.js";

const BillRouter = express.Router();

// Generate bill by orderId
BillRouter.get("/generate/:orderId", generateAndPayBillByOrder);

export default BillRouter;
