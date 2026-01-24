import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true },
);

// Bcrypt the password
userSchema.pre("save", async function () {
  const user = this;
  if (!user.isModified("password")) return;
  const hashPassword = await bcrypt.hash(user.password, 10);
  user.password = hashPassword;
});

// Compare password Method
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
export const User = mongoose.model("User", userSchema);
