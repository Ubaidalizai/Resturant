import express from 'express';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { orderValidation } from '../validators/order.validator.js';
import { addOrder, deleteOrder, getOrders, updateOrder } from '../controllers/order.controller.js';
import { userAuthMiddleware } from '../middlewares/userAuth.middleware.js';
const OrderRouter = express.Router();

OrderRouter.get('/all', getOrders);
OrderRouter.post('/add',  orderValidation, validationMiddleware, addOrder);
OrderRouter.delete('/delete/:orderId',  deleteOrder)
OrderRouter.put('/update/:orderId',  updateOrder);

export default OrderRouter;