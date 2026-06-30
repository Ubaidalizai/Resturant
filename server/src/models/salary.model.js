import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    baseSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    presentDays: {
      type: Number,
      default: 0,
    },
    absentDays: {
      type: Number,
      default: 0,
    },
    leaveDays: {
      type: Number,
      default: 0,
    },
    overtime: {
      type: Number,
      default: 0,
    },
    attendanceDeduction: {
      type: Number,
      default: 0,
    },
    debtDeduction: {
      type: Number,
      default: 0,
      min: 0,
    },
    extraDeduction: {
      type: Number,
      default: 0,
    },
    grossSalary: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalSalary: {
      type: Number,
      default: 0,
    },
    netPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      default: "",
    },
    paymentDate: {
      type: Date,
    },
    totalDeduction: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      default: "",
    },
    statusHistory: [
      {
        fromStatus: { type: String, enum: ["Pending", "Paid"] },
        toStatus: { type: String, enum: ["Pending", "Paid"] },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reason: { type: String, default: "" },
        paymentMethod: { type: String, default: "" },
        paymentDate: { type: Date },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

salarySchema.index({ staffId: 1, month: 1, year: 1 }, { unique: true });

export const Salary = mongoose.model("Salary", salarySchema);
