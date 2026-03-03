import mongoose from "mongoose";

const expensesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  catagoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExpensesCatagroy",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  expensesDate: {
    type: Date,
    required: true,
  },
  note: {
    type: String,
  },
  isDeleted: {
    type: Boolean, 
    default: false
  }
});


export const Expense = mongoose.model("Expense", expensesSchema);