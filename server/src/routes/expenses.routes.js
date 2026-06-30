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
expensesRouter.use(userAuthMiddleware);
expensesRouter.use(authorize('admin_access', 'expenses_access'));
expensesRouter.post(
  '/add', 
  
  expensesValidations, 
  validationMiddleware,  
  addExpense
);

expensesRouter.get(
  '/all', 
  
  getAllExpenses
);

expensesRouter.put(
  '/update/:id', 

  expensesValidations, 
  validationMiddleware, 
  updateExpense
);

expensesRouter.delete(
  '/delete/:id', 
  deleteExpense
);

expensesRouter.get(
  '/report', 

  getExpensesByDateRange
);

expensesRouter.get(
  '/category/:id', 

  getExpensesByCatagory
);

expensesRouter.get(
  '/today/expense', 

  getTodayExpenses
);

export default expensesRouter;