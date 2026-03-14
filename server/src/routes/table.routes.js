import express from 'express';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { tableValidation } from '../validators/table.validator.js';
import { addTable, deleteTable, getTables, updateTable } from '../controllers/table.controller.js';
import { userAuthMiddleware } from '../middlewares/userAuth.middleware.js';
import { authorize } from '../middlewares/authorizeRole.middleware.js';

const tableRouter = express.Router();
tableRouter.use(userAuthMiddleware);
tableRouter.use(authorize('panel_access', 'admin_access', 'garson_access'));
// Add table → admin only
tableRouter.post(
  '/add',
  tableValidation,
  validationMiddleware,
  addTable
);

// Get all tables → admin only
tableRouter.get(
  '/all',

  getTables
);

// Delete table → admin only
tableRouter.delete(
  '/delete/:tableId',

  deleteTable
);

// Update table → admin only
tableRouter.put(
  '/update/:tableId',

  tableValidation,
  validationMiddleware,
  updateTable
);

export default tableRouter;