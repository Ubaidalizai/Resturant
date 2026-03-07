import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true
  },

  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission"
    }
  ],
  isDeleted: {
    type: Boolean,
    default: false
  }
});

export const Role = mongoose.model("Role", roleSchema);