import { Salary } from "../models/salary.model.js";
import { Staff } from "../models/staff.model.js";
import { Attendance } from "../models/attendance.model.js";

const WORKING_DAYS = 30;

export const calcFinalSalary = (baseSalary, absentDays, overtime, extraDeduction) => {
  const dailyRate = baseSalary / WORKING_DAYS;
  const attendanceDeduction = Math.round(absentDays * dailyRate);
  const grossSalary = Math.max(
    0,
    baseSalary - attendanceDeduction - (extraDeduction || 0) + (overtime || 0)
  );
  return { attendanceDeduction, grossSalary };
};

export const generateSalaryForStaff = async (staffId, month, year) => {
  const staff = await Staff.findOne({ _id: staffId, isDeleted: false, status: "active" });
  if (!staff) return null;

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  const dueDate = new Date(year, month, 0);

  const attendanceRecords = await Attendance.find({
    staffId,
    date: { $gte: start, $lte: end },
    isDeleted: false,
  });

  const att = { present: 0, absent: 0, leave: 0 };
  attendanceRecords.forEach((r) => {
    if (r.status === "present") att.present += 1;
    else if (r.status === "absent") att.absent += 1;
    else if (r.status === "leave") att.leave += 1;
  });

  const { attendanceDeduction, grossSalary } = calcFinalSalary(
    staff.salary,
    att.absent,
    0,
    0
  );

  const record = await Salary.findOneAndUpdate(
    { staffId, month, year, isDeleted: false },
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

  if (record.status !== "Paid") {
    record.status = "Pending";
    await record.save();
  }

  return record;
};
