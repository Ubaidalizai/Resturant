import mongoose from "mongoose";
import { Account } from "../models/account.model.js";
import { JournalEntry } from "../models/journalEntry.model.js";
import ErrorHandler from "../utils/errorHandler.util.js";

const DEFAULT_ACCOUNTS = [
  { code: "1000", name: "Cash", type: "asset", isSystem: true },
  { code: "1100", name: "Employee Receivable", type: "asset", isSystem: true },
  { code: "4000", name: "Sales Revenue", type: "revenue", isSystem: true },
  { code: "5000", name: "Operating Expenses", type: "expense", isSystem: true },
  { code: "5100", name: "Salary Expense", type: "expense", isSystem: true },
  { code: "5200", name: "Losses & Damages", type: "expense", isSystem: true },
  { code: "2000", name: "Accounts Payable", type: "liability", isSystem: true },
  { code: "3000", name: "Owner Equity", type: "equity", isSystem: true },
];

export const ensureDefaultAccounts = async () => {
  for (const acc of DEFAULT_ACCOUNTS) {
    await Account.findOneAndUpdate(
      { code: acc.code },
      { $setOnInsert: acc },
      { upsert: true, new: true }
    );
  }
};

export const getAccountByCode = async (code) => {
  await ensureDefaultAccounts();
  const account = await Account.findOne({ code, isDeleted: false });
  if (!account) throw new ErrorHandler(500, `Account ${code} not found`);
  return account;
};

const validateLines = (lines) => {
  if (!Array.isArray(lines) || lines.length < 2) {
    throw new ErrorHandler(400, "Journal entry requires at least two lines");
  }

  let totalDebit = 0;
  let totalCredit = 0;

  for (const line of lines) {
    const debit = Number(line.debit) || 0;
    const credit = Number(line.credit) || 0;

    if (debit < 0 || credit < 0) {
      throw new ErrorHandler(400, "Debit and credit amounts must be non-negative");
    }
    if (debit > 0 && credit > 0) {
      throw new ErrorHandler(400, "A line cannot have both debit and credit");
    }
    if (debit === 0 && credit === 0) {
      throw new ErrorHandler(400, "Each line must have a debit or credit amount");
    }
    if (!line.accountId || !mongoose.Types.ObjectId.isValid(line.accountId)) {
      throw new ErrorHandler(400, "Invalid account on journal line");
    }

    totalDebit += debit;
    totalCredit += credit;
  }

  if (Math.abs(totalDebit - totalCredit) > 0.001) {
    throw new ErrorHandler(
      400,
      `Journal entry is not balanced: debits (${totalDebit}) ≠ credits (${totalCredit})`
    );
  }

  return { totalDebit, totalCredit };
};

export const createJournalEntry = async ({
  description,
  referenceType,
  referenceId,
  lines,
  date,
  userId,
}) => {
  const { totalDebit, totalCredit } = validateLines(lines);

  const accountIds = lines.map((l) => l.accountId);
  const accounts = await Account.find({ _id: { $in: accountIds }, isDeleted: false });
  if (accounts.length !== new Set(accountIds.map(String)).size) {
    throw new ErrorHandler(400, "One or more accounts not found");
  }

  const entry = await JournalEntry.create({
    description,
    referenceType,
    referenceId,
    date: date || new Date(),
    lines: lines.map((l) => ({
      accountId: l.accountId,
      debit: Number(l.debit) || 0,
      credit: Number(l.credit) || 0,
    })),
    totalDebit,
    totalCredit,
    createdBy: userId,
  });

  for (const line of entry.lines) {
    const account = accounts.find((a) => a._id.toString() === line.accountId.toString());
    if (!account) continue;

    const isDebitNormal = ["asset", "expense"].includes(account.type);
    const change = isDebitNormal
      ? line.debit - line.credit
      : line.credit - line.debit;

    await Account.findByIdAndUpdate(account._id, { $inc: { balance: change } });
  }

  return entry;
};

export const recordExpenseEntry = async ({ expenseId, amount, title, userId }) => {
  const expenseAccount = await getAccountByCode("5000");
  const cashAccount = await getAccountByCode("1000");

  return createJournalEntry({
    description: `Expense: ${title}`,
    referenceType: "expense",
    referenceId: expenseId,
    userId,
    lines: [
      { accountId: expenseAccount._id, debit: amount, credit: 0 },
      { accountId: cashAccount._id, debit: 0, credit: amount },
    ],
  });
};

export const recordSalaryPaymentEntry = async ({ salaryId, amount, staffName, userId }) => {
  const salaryAccount = await getAccountByCode("5100");
  const cashAccount = await getAccountByCode("1000");
  const receivableAccount = await getAccountByCode("1100");

  const netCashPaid = Number(amount?.netCashPaid ?? amount) || 0;
  const debtDeduction = Number(amount?.debtDeduction ?? 0) || 0;
  const grossAmount = Number(amount?.grossAmount ?? netCashPaid + debtDeduction) || 0;

  return createJournalEntry({
    description: `Salary payment: ${staffName}`,
    referenceType: "salary",
    referenceId: salaryId,
    userId,
    lines: [
      { accountId: salaryAccount._id, debit: grossAmount, credit: 0 },
      ...(debtDeduction > 0
        ? [{ accountId: receivableAccount._id, debit: 0, credit: debtDeduction }]
        : []),
      { accountId: cashAccount._id, debit: 0, credit: netCashPaid },
    ],
  });
};

export const reverseSalaryPaymentEntry = async ({
  salaryId,
  amount,
  staffName,
  userId,
  reason,
}) => {
  const salaryAccount = await getAccountByCode("5100");
  const cashAccount = await getAccountByCode("1000");

  return createJournalEntry({
    description: `Salary payment reversal: ${staffName} — ${reason}`,
    referenceType: "salary",
    referenceId: salaryId,
    userId,
    lines: [
      { accountId: salaryAccount._id, debit: 0, credit: amount },
      { accountId: cashAccount._id, debit: amount, credit: 0 },
    ],
  });
};

export const recordRevenueEntry = async ({ billId, amount, userId }) => {
  const cashAccount = await getAccountByCode("1000");
  const revenueAccount = await getAccountByCode("4000");

  return createJournalEntry({
    description: `Sales revenue from bill`,
    referenceType: "revenue",
    referenceId: billId,
    userId,
    lines: [
      { accountId: cashAccount._id, debit: amount, credit: 0 },
      { accountId: revenueAccount._id, debit: 0, credit: amount },
    ],
  });
};

export const recordLossEntry = async ({ lossId, amount, title, userId }) => {
  const lossAccount = await getAccountByCode("5200");
  const cashAccount = await getAccountByCode("1000");

  return createJournalEntry({
    description: `Loss/Damage: ${title}`,
    referenceType: "loss",
    referenceId: lossId,
    userId,
    lines: [
      { accountId: lossAccount._id, debit: amount, credit: 0 },
      { accountId: cashAccount._id, debit: 0, credit: amount },
    ],
  });
};

export const recordEmployeeDebtEntry = async ({ staffId, staffName, amount, userId }) => {
  const receivableAccount = await getAccountByCode("1100");
  const cashAccount = await getAccountByCode("1000");

  return createJournalEntry({
    description: `Employee debt issued: ${staffName || "Staff"}`,
    referenceType: "manual",
    referenceId: staffId,
    userId,
    lines: [
      { accountId: receivableAccount._id, debit: amount, credit: 0 },
      { accountId: cashAccount._id, debit: 0, credit: amount },
    ],
  });
};
