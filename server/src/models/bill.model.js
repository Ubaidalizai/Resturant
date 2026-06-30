import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  totalAmount: Number,
  grandTotal: Number,
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  },
  paidAt: {
    type: Date, 
    default: Date.now
  }
}, { timestamps: true });

export const Bill = mongoose.model('Bill', billSchema);