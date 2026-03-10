import express from 'express';
import { addRole, deleteRole, getRoles, updateRole } from '../controllers/role.controller.js';
import { roleValidator } from '../validators/role.validator.js';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { userAuthMiddleware } from '../middlewares/userAuth.middleware.js';
import { authorize } from '../middlewares/authorizeRole.middleware.js';

const roleRouter = express.Router();

// Add role → 'add_role' or admin
roleRouter.post(
  '/add', 
  userAuthMiddleware,
  authorize('add_role', 'admin_access'),
  roleValidator, 
  validationMiddleware, 
  addRole
);

// Update role → 'update_role' or admin
roleRouter.put(
  '/update', 
  userAuthMiddleware,
  authorize('update_role', 'admin_access'),
  roleValidator, 
  validationMiddleware, 
  updateRole
);

// Delete role → 'delete_role' or admin
roleRouter.delete(
  '/delete/:id', 
  userAuthMiddleware,
  authorize('delete_role', 'admin_access'),
  deleteRole
);

// Get all roles → 'view_roles' or admin
roleRouter.get(
  '/get', 
  // userAuthMiddleware,
  // authorize('view_roles', 'admin_access'),
  getRoles
);

export default roleRouter;