import express from 'express';
import { 
  addExpense, 
  deleteExpense, 
  getAllExpenses, 
  getExpensesByCatagory, 
  getExpensesByDateRange, 
  getTodayExpenses, 
  updateExpense 
} from '../controllers/expense.controller.js';
import { expensesValidations } from '../validators/expenses.validator.js';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { userAuthMiddleware } from '../middlewares/userAuth.middleware.js';
import { authorize } from '../middlewares/authorizeRole.middleware.js';

const expensesRouter = express.Router();

expensesRouter.post(
  '/add', 
  userAuthMiddleware, 
  authorize('add_expenses', 'admin_access'), 
  expensesValidations, 
  validationMiddleware,  
  addExpense
);

expensesRouter.get(
  '/all', 
  userAuthMiddleware, 
  authorize('view_expenses', 'admin_access'), 
  getAllExpenses
);

expensesRouter.put(
  '/update/:id', 
  userAuthMiddleware,
  authorize('admin_access'),
  expensesValidations, 
  validationMiddleware, 
  updateExpense
);

expensesRouter.delete(
  '/delete/:id', 
  userAuthMiddleware,
  authorize('admin_access'),
  deleteExpense
);

expensesRouter.get(
  '/report', 
  userAuthMiddleware, 
  authorize('view_expenses', 'admin_access'), 
  getExpensesByDateRange
);

expensesRouter.get(
  '/category/:id', 
  userAuthMiddleware, 
  authorize('view_expenses', 'admin_access'), 
  getExpensesByCatagory
);

expensesRouter.get(
  '/today/expense', 
  userAuthMiddleware, 
  authorize('view_expenses', 'admin_access'), 
  getTodayExpenses
);

export default expensesRouter;