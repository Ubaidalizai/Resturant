import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Account } from "../models/account.model.js";
import { JournalEntry } from "../models/journalEntry.model.js";
import {
  createJournalEntry,
  ensureDefaultAccounts,
} from "../services/accounting.service.js";

export const getAccounts = asyncHandler(async (req, res) => {
  await ensureDefaultAccounts();
  const accounts = await Account.find({ isDeleted: false }).sort({ code: 1 });
  res.respond(200, "Accounts fetched successfully", accounts);
});

export const getJournalEntries = asyncHandler(async (req, res) => {
  const { startDate, endDate, referenceType } = req.query;
  const filter = { isDeleted: false };

  if (referenceType) filter.referenceType = referenceType;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }

  const entries = await JournalEntry.find(filter)
    .populate("lines.accountId", "code name type")
    .populate("createdBy", "name email")
    .sort({ date: -1, createdAt: -1 });

  res.respond(200, "Journal entries fetched successfully", entries);
});

export const getTrialBalance = asyncHandler(async (req, res) => {
  await ensureDefaultAccounts();
  const accounts = await Account.find({ isDeleted: false }).sort({ code: 1 });

  let totalDebits = 0;
  let totalCredits = 0;

  const rows = accounts.map((acc) => {
    const isDebitNormal = ["asset", "expense"].includes(acc.type);
    const debit = isDebitNormal && acc.balance > 0 ? acc.balance : (!isDebitNormal && acc.balance < 0 ? Math.abs(acc.balance) : 0);
    const credit = !isDebitNormal && acc.balance > 0 ? acc.balance : (isDebitNormal && acc.balance < 0 ? Math.abs(acc.balance) : 0);
    totalDebits += debit;
    totalCredits += credit;
    return { account: acc, debit, credit };
  });

  res.respond(200, "Trial balance fetched successfully", {
    rows,
    totalDebits,
    totalCredits,
    isBalanced: Math.abs(totalDebits - totalCredits) < 0.01,
  });
});

export const createManualEntry = asyncHandler(async (req, res) => {
  const { description, date, lines } = req.body;

  if (!description?.trim()) {
    return res.respond(400, "Description is required");
  }

  const entry = await createJournalEntry({
    description: description.trim(),
    referenceType: "manual",
    lines,
    date,
    userId: req.user?.id,
  });

  const populated = await JournalEntry.findById(entry._id)
    .populate("lines.accountId", "code name type");

  res.respond(201, "Journal entry created successfully", populated);
});

export const getAccountingSummary = asyncHandler(async (req, res) => {
  await ensureDefaultAccounts();
  const accounts = await Account.find({ isDeleted: false });

  const summary = {
    assets: 0,
    liabilities: 0,
    equity: 0,
    revenue: 0,
    expenses: 0,
  };

  accounts.forEach((acc) => {
    if (acc.type === "asset") summary.assets += acc.balance;
    else if (acc.type === "liability") summary.liabilities += acc.balance;
    else if (acc.type === "equity") summary.equity += acc.balance;
    else if (acc.type === "revenue") summary.revenue += acc.balance;
    else if (acc.type === "expense") summary.expenses += acc.balance;
  });

  res.respond(200, "Accounting summary fetched successfully", {
    ...summary,
    netIncome: summary.revenue - summary.expenses,
  });
});
