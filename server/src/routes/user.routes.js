import express from 'express';
import { getAllUser, deleteUser, updateUser, getSingleUser, deleteAllUser } from '../controllers/user.controller.js';
import { userAuthMiddleware } from '../middlewares/userAuth.middleware.js';
import { authorize } from '../middlewares/authorizeRole.middleware.js';

const UserRouter = express.Router();

// Get all users → view_users or admin
UserRouter.get(
  '/all',
  userAuthMiddleware,
  authorize('admin_access', 'view_users'),
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
  userAuthMiddleware,
  authorize('update_user', 'admin_access'),
  updateUser
);

// Delete single user → delete_user or admin
UserRouter.delete(
  '/delete/:userId',
  userAuthMiddleware,
  authorize('delete_user', 'admin_access'),
  deleteUser
);

// Delete all users → admin only
UserRouter.delete(
  '/delete/',
  userAuthMiddleware,
  authorize('admin_access'),
  deleteAllUser
);

export default UserRouter;