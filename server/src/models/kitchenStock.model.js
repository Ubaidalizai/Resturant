// models/kitchenStock.model.js
import mongoose from "mongoose";

const kitchenStockSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: "pcs" }, // kg, ltr, pcs
    minRequired: { type: Number, default: 5 },

    status: {
      type: String,
      enum: ["available", "needed"],
      default: "available",
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const KitchenStock = mongoose.model(
  "KitchenStock",
  kitchenStockSchema
);