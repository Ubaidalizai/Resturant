import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
    },
    customer:{
      type: String
    },
    items: [
      {
        foodId: { type: mongoose.Types.ObjectId, ref: "Food" },
        quantity: { type: Number, default: 1 },
      },
    ],
    amount: { type: Number, required: true },
    tableId: {
      type: mongoose.Types.ObjectId,
      ref: "Table",
    },
    totalAmount: {
      type: Number, 
      default: 0
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
