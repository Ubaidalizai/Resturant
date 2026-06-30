import { Attendance } from "../models/attendance.model.js";
import { Staff } from "../models/staff.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const startOfDay = (dateStr) => {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (dateStr) => {
  const d = new Date(dateStr);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const getAttendanceByDate = asyncHandler(async (req, res) => {
  const { date } = req.params;
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  const staffList = await Staff.find({ isDeleted: false, status: "active" }).sort({ fullName: 1 });
  const records = await Attendance.find({
    date: { $gte: dayStart, $lte: dayEnd },
    isDeleted: false,
  }).populate("staffId");

  const recordMap = {};
  records.forEach((r) => {
    if (r.staffId?._id) recordMap[r.staffId._id.toString()] = r;
  });

  const data = staffList.map((staff) => {
    const existing = recordMap[staff._id.toString()];
    return {
      _id: existing?._id || null,
      staffId: staff._id,
      fullName: staff.fullName,
      phone: staff.phone,
      employmentType: staff.employmentType || "",
      salary: staff.salary,
      status: existing?.status || null,
      notes: existing?.notes || "",
    };
  });

  res.respond(200, "Attendance fetched successfully", { date, records: data });
});

export const upsertAttendance = asyncHandler(async (req, res) => {
  const { staffId, date, status, notes } = req.body;

  const staff = await Staff.findOne({ _id: staffId, isDeleted: false });
  if (!staff) return res.respond(404, "Staff not found");

  const dayStart = startOfDay(date);

  const record = await Attendance.findOneAndUpdate(
    { staffId, date: dayStart, isDeleted: false },
    { status, notes: notes || "" },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).populate("staffId");

  res.respond(200, "Attendance updated successfully", record);
});

export const bulkUpdateAttendance = asyncHandler(async (req, res) => {
  const { date } = req.params;
  const { status } = req.body;

  if (!["present", "absent", "leave"].includes(status)) {
    return res.respond(400, "Invalid status. Use present, absent, or leave");
  }

  const dayStart = startOfDay(date);
  const staffList = await Staff.find({ isDeleted: false, status: "active" });

  const ops = staffList.map((staff) =>
    Attendance.findOneAndUpdate(
      { staffId: staff._id, date: dayStart, isDeleted: false },
      { status, notes: "" },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
  );

  await Promise.all(ops);

  res.respond(200, `All staff marked as ${status}`, { count: staffList.length });
});

export const getAttendanceReport = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const m = Number(month) || new Date().getMonth() + 1;
  const y = Number(year) || new Date().getFullYear();

  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0, 23, 59, 59, 999);

  const records = await Attendance.find({
    date: { $gte: start, $lte: end },
    isDeleted: false,
  }).populate("staffId");

  const summary = {};
  records.forEach((r) => {
    const id = r.staffId?._id?.toString();
    if (!id) return;
    if (!summary[id]) {
      summary[id] = {
        staffId: r.staffId._id,
        fullName: r.staffId.fullName,
        present: 0,
        absent: 0,
        leave: 0,
      };
    }
    if (r.status === "present") summary[id].present += 1;
    else if (r.status === "absent") summary[id].absent += 1;
    else if (r.status === "leave") summary[id].leave += 1;
  });

  res.respond(200, "Attendance report fetched", Object.values(summary));
});
