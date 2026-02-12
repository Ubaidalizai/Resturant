import express from 'express'
import { stockValidation } from '../validators/kitchenStockValidator.js';
import { addStock, deleteItem, getAllItems, updateItem } from '../controllers/kitchen.controller.js';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
const kitchenRouter = express.Router();

kitchenRouter.post('/add', stockValidation, validationMiddleware, addStock)
kitchenRouter.get('/all', getAllItems);
kitchenRouter.delete('/delete/:id', deleteItem);
kitchenRouter.put('/update/:id', updateItem);
export default kitchenRouter
