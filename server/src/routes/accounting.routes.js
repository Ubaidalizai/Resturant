import express from "express";
import {
  getAccounts,
  getJournalEntries,
  getTrialBalance,
  createManualEntry,
  getAccountingSummary,
} from "../controllers/accounting.controller.js";
import { userAuthMiddleware } from "../middlewares/userAuth.middleware.js";
import { authorize } from "../middlewares/authorizeRole.middleware.js";
import { body } from "express-validator";
import { validationMiddleware } from "../middlewares/validationsHandler.utils.js";

const router = express.Router();

router.use(userAuthMiddleware);
router.use(authorize("admin_access", "expense_access"));

router.get("/accounts", getAccounts);
router.get("/entries", getJournalEntries);
router.get("/trial-balance", getTrialBalance);
router.get("/summary", getAccountingSummary);

router.post(
  "/entries",
  [
    body("description").notEmpty().withMessage("Description is required"),
    body("lines").isArray({ min: 2 }).withMessage("At least two lines required"),
    body("lines.*.accountId").notEmpty().withMessage("Account is required"),
  ],
  validationMiddleware,
  createManualEntry
);

export default router;
