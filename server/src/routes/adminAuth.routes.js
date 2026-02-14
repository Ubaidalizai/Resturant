import express from 'express'
import { handleAdminLogin, handleAdminLogout, requestAdminPasswordReset, resetAdminPassword, verifyAdmin } from '../controllers/adminAuth.controller.js';
import { loginValidations } from '../validators/userAuth.validator.js';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { adminAuthMiddleware } from '../middlewares/adminAuth.middleware.js';
import { forggotPasswordValidation, resetPasswordValidation } from '../validators/admin.validator.js';
const adminRouter = express.Router();
adminRouter.post('/login', loginValidations, validationMiddleware,  handleAdminLogin);
adminRouter.get('/logout', adminAuthMiddleware, handleAdminLogout);
adminRouter.get('/verify', adminAuthMiddleware, verifyAdmin);
adminRouter.post('/request-reset', forggotPasswordValidation, validationMiddleware, requestAdminPasswordReset);
adminRouter.post('/reset-password/:token', resetPasswordValidation, validationMiddleware, resetAdminPassword);
export default  adminRouter