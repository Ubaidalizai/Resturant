import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        food: String,
        foodId: { type: mongoose.Types.ObjectId, ref: "Food" },
      },
    ],
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    tableId: {
      type: mongoose.Types.ObjectId,
      ref: "Table",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
