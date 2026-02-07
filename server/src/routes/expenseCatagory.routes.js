import express from 'express';
import { createExpensesCatagory, deleteExpensesCatagory, getAllExpensesCatagories, updateExpensesCatagory } from '../controllers/expenseCatagory.controller.js';
import { expensesCatagoryValidation } from '../validators/expenses.validator.js';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';

const expenseCatagoryRouter = express.Router();
expenseCatagoryRouter.post('/add', expensesCatagoryValidation, validationMiddleware, createExpensesCatagory);
expenseCatagoryRouter.get('/all', getAllExpensesCatagories);
expenseCatagoryRouter.put('/update/:id', updateExpensesCatagory);
expenseCatagoryRouter.delete('/delete/:id', deleteExpensesCatagory);
export default expenseCatagoryRouter;
