import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String
    },
    nationalId: {
      type: String
    },
    salary: {
      type: Number,
      required: true,
      min: 0
    },
    debt: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalDeduction: {
      type: Number,
      default: 0,
      min: 0,
    },
    role: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String // store image path or cloud URL
    },
    hireDate: {
      type: Date,
      default: Date.now
    },
    employmentType: {
      type: String,
      default: "full-time",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "terminated"],
      default: "active"
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Staff = mongoose.model("Staff", staffSchema);