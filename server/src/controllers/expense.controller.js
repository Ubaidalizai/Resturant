import { Expense } from "../models/expenses.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
// Add the expenses
export const addExpense = asyncHandler(async(req, res)=>{
    const {title ,amount, note, catagory, date} = req.body;
    const newExpense = await Expense.create({ title, amount, note, catagoryId:catagory, expensesDate:date });
    res.respond(201, "Expense added successfully", newExpense);
});

// Get all expenses
export const getAllExpenses = asyncHandler(async(req, res)=>{
    const expenses = await Expense.find({isDeleted: false}).populate('catagoryId');
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
    const { title, amount, note, catagory, date } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(id, { title, amount, note, catagory, expensesDate:date }).populate('catagoryId');
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
export const getExpensesByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  // Validate dates
  if (!startDate || !endDate) {
    return res.respond(400, "Start date and end date are required");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start) || isNaN(end)) {
    return res.respond(400, "Invalid date format");
  }

  const expenses = await Expense.find({
    date: { $gte: start, $lte: end }
  }).populate("categoryId");

  if (!expenses.length) {
    return res.respond(404, "No expenses date provided");
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

export const getTodayExpenses = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const expenses = await Expense.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const totalExpenses = expenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    res.status(200).json({
      success: true,
      totalExpenses,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch today expenses",
    });
  }
};

