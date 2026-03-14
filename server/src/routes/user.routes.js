import express from 'express';
import { getAllUser, deleteUser, updateUser, getSingleUser, deleteAllUser } from '../controllers/user.controller.js';
import { userAuthMiddleware } from '../middlewares/userAuth.middleware.js';
import { authorize } from '../middlewares/authorizeRole.middleware.js';

const UserRouter = express.Router();
UserRouter.use(userAuthMiddleware); // Ensure user is authenticated for all user routes
UserRouter.use(authorize('admin_access', 'panel_access'));
// Get all users → view_users or admin
UserRouter.get(
  '/all',
  getAllUser
);

// Get single usser → view_users or admin
UserRouter.get(
  '/single/:userId',
  userAuthMiddleware,
  authorize('view_users', 'admin_access'),
  getSingleUser
);

// Update user → update_user or admin
UserRouter.put(
  '/update/:userId',
  updateUser
);

// Delete single user → delete_user or admin
UserRouter.delete(
  '/delete/:userId',
  deleteUser
);

// Delete all users → admin only
UserRouter.delete(
  '/delete/',
  deleteAllUser
);

export default UserRouter;