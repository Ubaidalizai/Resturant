import express from 'express';
import { addRole, deleteRole, getRoles, updateRole } from '../controllers/role.controller.js';
import { roleValidator } from '../validators/role.validator.js';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';

const roleRouter = express.Router();
roleRouter.post('/add', roleValidator, validationMiddleware, addRole);
roleRouter.put('/update', roleValidator, validationMiddleware, updateRole);
roleRouter.delete('/delete/:id', roleValidator, validationMiddleware, deleteRole);
roleRouter.get('/get', getRoles);
export default roleRouter;