import express from 'express';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { tableValidation } from '../validators/table.validator.js';
import { addTable, deleteTable, getTables, updateTable } from '../controllers/table.controller.js';
import { userAuthMiddleware } from '../middlewares/userAuth.middleware.js';
import { authorize } from '../middlewares/authorizeRole.middleware.js';

const tableRouter = express.Router();

// Add table → admin only
tableRouter.post(
  '/add',
  userAuthMiddleware,
  authorize('admin_access'),
  tableValidation,
  validationMiddleware,
  addTable
);

// Get all tables → admin only
tableRouter.get(
  '/all',
  userAuthMiddleware,
  authorize('admin_access', 'garson_access'),
  getTables
);

// Delete table → admin only
tableRouter.delete(
  '/delete/:tableId',
  userAuthMiddleware,
  authorize('admin_access'),
  deleteTable
);

// Update table → admin only
tableRouter.put(
  '/update/:tableId',
  userAuthMiddleware,
  authorize('admin_access'),
  tableValidation,
  validationMiddleware,
  updateTable
);

export default tableRouter;