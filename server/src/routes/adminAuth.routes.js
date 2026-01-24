import express from 'express'
import { handleAdminLogin, handleAdminLogout } from '../controllers/adminAuth.controller.js';
import { loginValidations } from '../validators/userAuth.validator.js';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
const adminRouter = express.Router();
adminRouter.post('/login', loginValidations, validationMiddleware, handleAdminLogin)
adminRouter.get('/logout', handleAdminLogout);
export default  adminRouter