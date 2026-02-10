import mongoose from "mongoose";

const expensesCatagroySchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    }, 
    description: {
        type: String, 
        required: true
    }
});

export const ExpensesCatagroy = mongoose.model('ExpensesCatagroy', expensesCatagroySchema);