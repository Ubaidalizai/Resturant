import { asyncHandler } from "../utils/asyncHandler.util.js";
import { Account } from "../models/account.model.js";
import { JournalEntry } from "../models/journalEntry.model.js";
import { ensureDefaultAccounts } from "../services/accounting.service.js";

const parseDateRange = ({ preset, startDate, endDate }) => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (preset === "today") {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (preset === "week") {
    const day = now.getDay(); // 0-6
    const diff = now.getDate() - day;
    const s = new Date(now.setDate(diff));
    s.setHours(0, 0, 0, 0);
    const e = new Date(s);
    e.setDate(s.getDate() + 6);
    e.setHours(23, 59, 59, 999);
    return { start: s, end: e };
  }

  if (preset === "month") {
    const s = new Date(now.getFullYear(), now.getMonth(), 1);
    s.setHours(0, 0, 0, 0);
    const e = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    e.setHours(23, 59, 59, 999);
    return { start: s, end: e };
  }

  if (preset === "year") {
    const s = new Date(now.getFullYear(), 0, 1);
    s.setHours(0, 0, 0, 0);
    const e = new Date(now.getFullYear(), 11, 31);
    e.setHours(23, 59, 59, 999);
    return { start: s, end: e };
  }

  if (startDate || endDate) {
    const s = startDate ? new Date(startDate) : new Date("1970-01-01");
    const e = endDate ? new Date(endDate) : new Date();
    s.setHours(0, 0, 0, 0);
    e.setHours(23, 59, 59, 999);
    return { start: s, end: e };
  }

  return { start: null, end: null };
};

export const getDakhalSummary = asyncHandler(async (req, res) => {
  await ensureDefaultAccounts();

  const { preset, startDate, endDate } = req.query;
  const { start, end } = parseDateRange({ preset, startDate, endDate });

  const entryFilter = { isDeleted: false };
  if (start && end) entryFilter.date = { $gte: start, $lte: end };

  const entries = await JournalEntry.find(entryFilter).select("referenceType totalDebit totalCredit");

  const totals = {
    revenue: 0,
    salary: 0,
    expense: 0,
    loss: 0,
  };

  for (const e of entries) {
    const amount = Number(e.totalDebit || e.totalCredit || 0);
    if (e.referenceType === "revenue") totals.revenue += amount;
    else if (e.referenceType === "salary") totals.salary += amount;
    else if (e.referenceType === "expense") totals.expense += amount;
    else if (e.referenceType === "loss") totals.loss += amount;
  }

  const [cash, equity] = await Promise.all([
    Account.findOne({ code: "1000", isDeleted: false }),
    Account.findOne({ code: "3000", isDeleted: false }),
  ]);

  res.respond(200, "Dakhal summary fetched successfully", {
    totalCapital: Number(equity?.balance || 0),
    totalRevenue: totals.revenue,
    totalSalaries: totals.salary,
    totalExpenses: totals.expense,
    totalLosses: totals.loss,
    currentBalance: Number(cash?.balance || 0),
  });
});

export const getDakhalTransactions = asyncHandler(async (req, res) => {
  const {
    preset,
    startDate,
    endDate,
    type, // revenue|salary|expense|loss|all
    q,
    page = 1,
    limit = 20,
  } = req.query;

  const { start, end } = parseDateRange({ preset, startDate, endDate });

  const filter = { isDeleted: false };
  if (start && end) filter.date = { $gte: start, $lte: end };
  if (type && type !== "all") filter.referenceType = type;
  if (q?.trim()) filter.description = { $regex: q.trim(), $options: "i" };

  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(100, Math.max(5, Number(limit) || 20));

  const [rows, total] = await Promise.all([
    JournalEntry.find(filter)
      .populate("createdBy", "name email")
      .sort({ date: -1, createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l),
    JournalEntry.countDocuments(filter),
  ]);

  res.respond(200, "Dakhal transactions fetched successfully", {
    rows,
    page: p,
    limit: l,
    total,
    totalPages: Math.ceil(total / l),
  });
});

