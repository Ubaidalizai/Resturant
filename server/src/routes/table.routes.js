import express from 'express'

const tableRouter = express.Router();
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { adminAuthMiddleware } from '../middlewares/adminAuth.middleware.js';
import {tableValidation} from '../validators/table.validator.js';
import {addTable, deleteTable, getTables} from '../controllers/table.controller.js';

tableRouter.post('/add', tableValidation, validationMiddleware, addTable);
tableRouter.get('/all', getTables);
tableRouter.delete('/delete/:tableId', deleteTable);
export default tableRouter