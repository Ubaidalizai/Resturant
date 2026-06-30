import express from "express";
import { userAuthMiddleware } from "../middlewares/userAuth.middleware.js";
import { authorize } from "../middlewares/authorizeRole.middleware.js";
import { getDakhalSummary, getDakhalTransactions } from "../controllers/dakhal.controller.js";

const dakhalRouter = express.Router();

dakhalRouter.use(userAuthMiddleware);
dakhalRouter.use(authorize("admin_access", "expense_access"));

dakhalRouter.get("/summary", getDakhalSummary);
dakhalRouter.get("/transactions", getDakhalTransactions);

export default dakhalRouter;

