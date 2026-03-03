import { ExpensesCatagroy } from "../models/expense.catagroy.model.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import ErrorHandler from "../utils/errorHandler.util.js";

// Create expenses catagory 
export const createExpensesCatagory = asyncHandler(async(req, res)=>{
    const { name, description } = req.body;
    const newCatagory = await ExpensesCatagroy.create({ name, description });
    res.respond(201, "Expenses catagory created successfully", newCatagory);
});

// Get all expenses catagories
export const getAllExpensesCatagories = asyncHandler(async(req, res)=>{
    const catagories = await ExpensesCatagroy.find();
    res.respond(200, "Expenses catagories retrieved successfully", catagories);
});

// Get single expenses catagory
export const getSingleExpensesCatagory = asyncHandler(async(req, res)=>{
    const { id } = req.params;
    const catagory = await ExpensesCatagroy.findById(id);
    if (!catagory) {
        return res.respond(404, "Expenses catagory not found");
    }
    res.respond(200, "Expenses catagory retrieved successfully", catagory);
});

// Update expenses catagory
export const updateExpensesCatagory = asyncHandler(async(req, res)=>{
    const { id } = req.params;
    const { name, description } = req.body;
    const catagory = await ExpensesCatagroy.findById(id);
    if(!catagory)return next(new ErrorHandler(400, "Expenses catagory not found"));
    const updatedCatagory = await ExpensesCatagroy.findByIdAndUpdate(id, { name, description });
    if (!updatedCatagory) {
        return res.respond(404, "Expenses catagory not found");
    }
    res.respond(200, "Expenses catagory updated successfully", updatedCatagory);
});

// Delete expenses catagory
export const deleteExpensesCatagory = asyncHandler(async(req, res)=>{
    const { id } = req.params;
    const deletedCatagory = await ExpensesCatagroy.findByIdAndDelete(id);
    if (!deletedCatagory) {
        return res.respond(404, "Expenses catagory not found");
    }
    res.respond(200, "Expenses catagory deleted successfully");
});
