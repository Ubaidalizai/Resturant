import express from 'express';
import { addRole, deleteRole, getRoles, updateRole } from '../controllers/role.controller.js';
import { roleValidator } from '../validators/role.validator.js';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { userAuthMiddleware } from '../middlewares/userAuth.middleware.js';
import { authorize } from '../middlewares/authorizeRole.middleware.js';

const roleRouter = express.Router();
roleRouter.use(userAuthMiddleware); // Ensure user is authenticated for all role routes
roleRouter.use(authorize('admin_access', 'panel_access'));
// Add role → 'add_role' or admin
roleRouter.post(
  '/add', 
  roleValidator, 
  validationMiddleware, 
  addRole
);

// Update role → 'update_role' or admin
roleRouter.put(
  '/update', 

  roleValidator, 
  validationMiddleware, 
  updateRole
);

// Delete role → 'delete_role' or admin
roleRouter.delete(
  '/delete/:id', 

  deleteRole
);

// Get all roles → 'view_roles' or admin
roleRouter.get(
  '/get', 
  getRoles
);

export default roleRouter;