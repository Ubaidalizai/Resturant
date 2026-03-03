import express from 'express';

import { getAllUser, deleteUser, updateUser, getSingleUser, deleteAllUser } from '../controllers/user.controller.js';
import { adminAuthMiddleware } from '../middlewares/adminAuth.middleware.js';

const UserRouter = express.Router();
UserRouter.get('/all', getAllUser);
UserRouter.get('/single/:userId', getSingleUser);
UserRouter.delete('/delete/:userId', deleteUser);
UserRouter.put('/update/:userId', updateUser);
UserRouter.delete('/delete/', deleteAllUser)
export default UserRouter;