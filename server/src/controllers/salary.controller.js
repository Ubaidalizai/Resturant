import { Salary } from "../models/salary.model.js";
import { Staff } from "../models/staff.model.js";
import { Attendance } from "../models/attendance.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import {
  recordSalaryPaymentEntry,
  reverseSalaryPaymentEntry,
  recordEmployeeDebtEntry,
} from "../services/accounting.service.js";
import { calcFinalSalary, generateSalaryForStaff } from "../services/salary.service.js";

export { generateSalaryForStaff };

export const generateMonthlySalaries = asyncHandler(async (req, res) => {
  const month = Number(req.body.month) || new Date().getMonth() + 1;
  const year = Number(req.body.year) || new Date().getFullYear();

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  const dueDate = new Date(year, month, 0);

  const staffList = await Staff.find({ isDeleted: false, status: "active" });
  const attendanceRecords = await Attendance.find({
    date: { $gte: start, $lte: end },
    isDeleted: false,
  });

  const attMap = {};
  attendanceRecords.forEach((r) => {
    const id = r.staffId.toString();
    if (!attMap[id]) attMap[id] = { present: 0, absent: 0, leave: 0 };
    if (r.status === "present") attMap[id].present += 1;
    else if (r.status === "absent") attMap[id].absent += 1;
    else if (r.status === "leave") attMap[id].leave += 1;
  });

  const results = [];

  for (const staff of staffList) {
    const att = attMap[staff._id.toString()] || { present: 0, absent: 0, leave: 0 };
    const { attendanceDeduction, grossSalary } = calcFinalSalary(
      staff.salary,
      att.absent,
      0,
      0
    );

    const record = await Salary.findOneAndUpdate(
      { staffId: staff._id, month, year, isDeleted: false },
      {
        baseSalary: staff.salary,
        presentDays: att.present,
        absentDays: att.absent,
        leaveDays: att.leave,
        attendanceDeduction,
        extraDeduction: 0,
        overtime: 0,
        debtDeduction: 0,
        grossSalary,
        finalSalary: grossSalary,
        netPaid: 0,
        dueDate,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("staffId");

    // Only set Pending for new records — never overwrite Paid status on regenerate
    if (record.status !== "Paid") {
      record.status = "Pending";
      await record.save();
    }

    results.push(record);
  }

  res.respond(201, "Monthly salary records generated", results);
});

export const getAllSalaries = asyncHandler(async (req, res) => {
  const month = Number(req.query.month);
  const year = Number(req.query.year);

  const filter = { isDeleted: false };
  if (month) filter.month = month;
  if (year) filter.year = year;

  const salaries = await Salary.find(filter)
    .populate("staffId")
    .sort({ createdAt: -1 });

  res.respond(200, "Salaries fetched successfully", salaries);
});

export const getSalarySummary = asyncHandler(async (req, res) => {
  const month = Number(req.query.month) || new Date().getMonth() + 1;
  const year = Number(req.query.year) || new Date().getFullYear();

  const salaries = await Salary.find({ month, year, isDeleted: false });

  const totalPaid = salaries.filter((s) => s.status === "Paid").reduce((sum, s) => sum + s.finalSalary, 0);
  const totalPending = salaries.filter((s) => s.status === "Pending").reduce((sum, s) => sum + s.finalSalary, 0);
  const paidCount = salaries.filter((s) => s.status === "Paid").length;
  const pendingCount = salaries.filter((s) => s.status === "Pending").length;

  res.respond(200, "Salary summary fetched", {
    month,
    year,
    totalPaid,
    totalPending,
    paidCount,
    pendingCount,
    totalRecords: salaries.length,
  });
});

export const paySalary = asyncHandler(async (req, res) => {
  const { salaryId } = req.params;
  const { paymentMethod, paymentDate, notes } = req.body;

  const existing = await Salary.findOne({ _id: salaryId, isDeleted: false }).populate("staffId");
  if (!existing) return res.respond(404, "Salary record not found");
  if (existing.status === "Paid") return res.respond(400, "Salary already paid");

  const staff = await Staff.findOne({ _id: existing.staffId?._id, isDeleted: false });
  const staffDebt = Number(staff?.debt || 0);
  const grossAmount = Number(existing.grossSalary ?? existing.finalSalary ?? 0);
  const attendanceDeduction = Number(existing.attendanceDeduction || 0);
  const extraDeduction = Number(existing.extraDeduction || 0);
  const debtDeduction = Math.max(0, Math.min(staffDebt, grossAmount));
  const totalDeductionForPayment = attendanceDeduction + extraDeduction + debtDeduction;
  const netCashPaid = Math.max(0, grossAmount - debtDeduction);

  const salary = await Salary.findOneAndUpdate(
    { _id: salaryId, isDeleted: false },
    {
      status: "Paid",
      paymentMethod: paymentMethod || "Cash",
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      notes: notes || "",
      debtDeduction,
      totalDeduction: totalDeductionForPayment,
      finalSalary: netCashPaid,
      netPaid: netCashPaid,
      $push: {
        statusHistory: {
          fromStatus: "Pending",
          toStatus: "Paid",
          changedAt: new Date(),
          changedBy: req.user?._id,
          reason: notes || "Salary payment recorded",
          paymentMethod: paymentMethod || "Cash",
          paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        },
      },
    },
    { new: true }
  ).populate("staffId");

  if (staff) {
    if (debtDeduction > 0) {
      staff.debt = Math.max(0, staffDebt - debtDeduction);
    }
    staff.totalDeduction = Number(staff.totalDeduction || 0) + totalDeductionForPayment;
    await staff.save();
  }

  const staffName = salary.staffId?.fullName || "Staff";
  await recordSalaryPaymentEntry({
    salaryId: salary._id,
    amount: { grossAmount, netCashPaid, debtDeduction },
    staffName,
    userId: req.user?.id,
  });

  res.respond(200, "Salary paid successfully", salary);
});

export const updateSalary = asyncHandler(async (req, res) => {
  const { salaryId } = req.params;
  const { overtime, extraDeduction, notes, debt } = req.body;

  const existing = await Salary.findOne({ _id: salaryId, isDeleted: false });
  if (!existing) return res.respond(404, "Salary record not found");

  const ot = overtime !== undefined ? Number(overtime) : existing.overtime;
  const ed = extraDeduction !== undefined ? Number(extraDeduction) : existing.extraDeduction;

  const { attendanceDeduction, grossSalary } = calcFinalSalary(
    existing.baseSalary,
    existing.absentDays,
    ot,
    ed
  );

  if (debt !== undefined) {
    const salaryWithStaff = await Salary.findOne({ _id: salaryId, isDeleted: false }).populate("staffId");
    const staffId = salaryWithStaff?.staffId?._id;
    if (staffId) {
      const newDebt = Math.max(0, Number(debt) || 0);
      const staff = await Staff.findOneAndUpdate(
        { _id: staffId, isDeleted: false },
        { debt: newDebt },
        { new: true }
      );

      // If debt increased, treat delta as issued cash and record in Dakhal.
      const prevDebt = Number(salaryWithStaff?.staffId?.debt || 0);
      const delta = newDebt - prevDebt;
      if (delta > 0) {
        await recordEmployeeDebtEntry({
          staffId,
          staffName: staff?.fullName,
          amount: delta,
          userId: req.user?.id,
        });
      }
    }
  }

  const salary = await Salary.findOneAndUpdate(
    { _id: salaryId, isDeleted: false },
    {
      overtime: ot,
      extraDeduction: ed,
      attendanceDeduction,
      grossSalary,
      finalSalary: grossSalary,
      debtDeduction: 0,
      netPaid: 0,
      notes: notes !== undefined ? notes : existing.notes,
    },
    { new: true }
  ).populate("staffId");

  res.respond(200, "Salary updated successfully", salary);
});

export const deleteSalary = asyncHandler(async (req, res) => {
  const { salaryId } = req.params;

  const salary = await Salary.findOneAndUpdate(
    { _id: salaryId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!salary) return res.respond(404, "Salary record not found");

  res.respond(200, "Salary record deleted", salary);
});

export const getEmployeeSalaryProfile = asyncHandler(async (req, res) => {
  const { staffId } = req.params;
  const { preset, month, year, startDate, endDate } = req.query;

  const staff = await Staff.findOne({ _id: staffId, isDeleted: false });
  if (!staff) return res.respond(404, "Staff not found");

  const now = new Date();
  const m = Number(month) || now.getMonth() + 1;
  const y = Number(year) || now.getFullYear();

  let start = null;
  let end = null;

  if (preset === "yearly") {
    start = new Date(y, 0, 1);
    end = new Date(y, 11, 31, 23, 59, 59, 999);
  } else if (preset === "custom" && (startDate || endDate)) {
    start = startDate ? new Date(startDate) : new Date("1970-01-01");
    end = endDate ? new Date(endDate) : new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else {
    // monthly (default)
    start = new Date(y, m - 1, 1);
    end = new Date(y, m, 0, 23, 59, 59, 999);
  }

  const [attendanceRecords, salaryRecords] = await Promise.all([
    Attendance.find({
      staffId,
      date: { $gte: start, $lte: end },
      isDeleted: false,
    }),
    Salary.find({ staffId, isDeleted: false })
      .sort({ year: -1, month: -1, createdAt: -1 })
      .limit(120),
  ]);

  const attendanceSummary = attendanceRecords.reduce(
    (acc, r) => {
      if (r.status === "present") acc.present += 1;
      else if (r.status === "absent") acc.absent += 1;
      else if (r.status === "leave") acc.leave += 1;
      return acc;
    },
    { present: 0, absent: 0, leave: 0, total: attendanceRecords.length }
  );

  res.respond(200, "Employee salary profile fetched", {
    staff,
    debt: Number(staff.debt || 0),
    totalDeduction: Number(staff.totalDeduction || 0),
    attendanceSummary,
    salaryHistory: salaryRecords.map((s) => ({
      ...s.toObject(),
      combinedDeduction:
        Number(s.attendanceDeduction || 0) +
        Number(s.extraDeduction || 0) +
        Number(s.debtDeduction || 0),
      loanAdvance: Number(s.debtDeduction || 0),
      combinedAmount:
        Number(s.grossSalary || s.finalSalary || 0) + Number(s.debtDeduction || 0),
    })),
  });
});

export const revertSalary = asyncHandler(async (req, res) => {
  const { salaryId } = req.params;
  const { reason } = req.body;

  if (!reason || !reason.trim()) {
    return res.respond(400, "A reason is required to revert a paid salary");
  }

  const existing = await Salary.findOne({ _id: salaryId, isDeleted: false }).populate("staffId");
  if (!existing) return res.respond(404, "Salary record not found");
  if (existing.status !== "Paid") {
    return res.respond(400, "Only paid salaries can be reverted to pending");
  }

  const staff = await Staff.findOne({ _id: existing.staffId?._id, isDeleted: false });
  if (staff) {
    const paidDeduction = Number(existing.totalDeduction || 0) ||
      Number(existing.attendanceDeduction || 0) +
      Number(existing.extraDeduction || 0) +
      Number(existing.debtDeduction || 0);
    staff.totalDeduction = Math.max(0, Number(staff.totalDeduction || 0) - paidDeduction);
    staff.debt = Number(staff.debt || 0) + Number(existing.debtDeduction || 0);
    await staff.save();
  }

  const staffName = existing.staffId?.fullName || "Staff";

  await reverseSalaryPaymentEntry({
    salaryId: existing._id,
    amount: existing.finalSalary,
    staffName,
    userId: req.user?._id,
    reason: reason.trim(),
  });

  const salary = await Salary.findOneAndUpdate(
    { _id: salaryId, isDeleted: false },
    {
      status: "Pending",
      paymentMethod: "",
      paymentDate: null,
      $push: {
        statusHistory: {
          fromStatus: "Paid",
          toStatus: "Pending",
          changedAt: new Date(),
          changedBy: req.user?._id,
          reason: reason.trim(),
        },
      },
    },
    { new: true }
  ).populate("staffId");

  res.respond(200, "Salary reverted to pending", salary);
});
