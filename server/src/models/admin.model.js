// models/admin.model.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "Admin",
    },
    refreshToken: {
      type: String,
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before saving
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const hashPassword = await bcrypt.hash(this.password, 10);
  this.password = hashPassword;
});

// Compare password method
adminSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Admin = mongoose.model("Admin", adminSchema);
