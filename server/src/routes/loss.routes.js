import express from "express";
import { userAuthMiddleware } from "../middlewares/userAuth.middleware.js";
import { authorize } from "../middlewares/authorizeRole.middleware.js";
import { addLoss, getAllLosses } from "../controllers/loss.controller.js";

const lossRouter = express.Router();

lossRouter.use(userAuthMiddleware);
lossRouter.use(authorize("admin_access", "expense_access"));

lossRouter.post("/add", addLoss);
lossRouter.get("/all", getAllLosses);

export default lossRouter;

