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
    const catagories = await ExpensesCatagroy.find({isDeleted: false}, {isDeleted:0});
    res.respond(200, "Expenses catagories retrieved successfully", catagories);
});

// Get single expenses catagory
export const getSingleExpensesCatagory = asyncHandler(async(req, res)=>{
    const { id } = req.params;
    const catagory = await ExpensesCatagroy.findOne({_id: id, isDeleted: false}, {isDeleted: 0});
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
    const updatedCatagory = await ExpensesCatagroy.findByIdAndUpdate(id, { name, description }).select(['name', 'description']);
    if (!updatedCatagory) {
        return res.respond(404, "Expenses catagory not found");
    }
    res.respond(200, "Expenses catagory updated successfully", updatedCatagory);
});

// Delete expenses category (Soft Delete)
export const deleteExpensesCatagory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const categoryFound = await ExpensesCatagroy.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!categoryFound) {
    return res.respond(404, "Category not found or already deleted");
  }
  const deletedCategory = await ExpensesCatagroy.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  res.respond(200, "Expenses category deleted successfully", deletedCategory);
});