import { Expense } from "../models/expenses.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

// Add the expenses
export const addExpense = asyncHandler(async(req, res)=>{
    const {title ,amount, note, catagory, expensesDate,   } = req.body;
    const newExpense = await Expense.create({ title, amount, note, catagoryId:catagory, expensesDate });
    res.respond(201, "Expense added successfully", newExpense);
});

// Get all expenses
export const getAllExpenses = asyncHandler(async(req, res)=>{
    const expenses = await Expense.find().populate('catagoryId');
    if(expenses.length === 0){ 
        return res.respond(404, "No expenses found");
    }
    res.respond(200, "Expenses retrieved successfully", expenses);
});

// Get single expense
export const getSingleExpense = asyncHandler(async(req, res)=>{
    const { id } = req.params;
    const expense = await Expense.findById(id).populate('catagoryId');
    if (!expense) {
        return res.respond(404, "Expense not found");
    }
    res.respond(200, "Expense retrieved successfully", expense);
});

// Update expense
export const updateExpense = asyncHandler(async(req, res)=>{
    const { id } = req.params;
    const { title, amount, note, catagory, expensesDate } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(id, { title, amount, note, catagory, expensesDate });
    if (!updatedExpense) {
        return res.respond(404, "Expense not found");
    }
    res.respond(200, "Expense updated successfully", updatedExpense);
});

// Delete expense
export const deleteExpense = asyncHandler(async(req, res)=>{
    const { id } = req.params;
    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) {
        return res.respond(404, "Expense not found");
    }
    res.respond(200, "Expense deleted successfully");
});

// Get expenses by date range
export const getExpensesByDateRange = asyncHandler(async(req, res)=>{
    const { startDate, endDate } = req.query;
    const expenses = await Expense.find({ expensesDate: { $gte: new Date(startDate), $lte: new Date(endDate) } }).populate('catagoryId');   
    if(expenses.length === 0){
        return res.respond(404, "No expenses found in the given date range");
    }
    res.respond(200, "Expenses retrieved successfully", expenses);
});

// Get expenses by catagory
export const getExpensesByCatagory = asyncHandler(async(req, res)=>{
    const { catagoryId } = req.params;
    const expenses = await Expense.find({ catagoryId }).populate('catagoryId');
    if(expenses.length === 0){
        return res.respond(404, "No expenses found for the given catagory");
    }
    res.respond(200, "Expenses retrieved successfully", expenses);
});
