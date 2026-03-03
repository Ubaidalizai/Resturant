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
    image: {
      type: String // store image path or cloud URL
    },
    hireDate: {
      type: Date,
      default: Date.now
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