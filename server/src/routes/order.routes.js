import express from 'express';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { orderValidation } from '../validators/order.validator.js';
import { addOrder, deleteOrder, getAllOrders, getOrders, todayOrderCounts, updateOrder } from '../controllers/order.controller.js';
import { userAuthMiddleware } from '../middlewares/userAuth.middleware.js';
import { Order } from '../models/order.model.js';
import { adminAuthMiddleware } from '../middlewares/adminAuth.middleware.js';
const OrderRouter = express.Router();

OrderRouter.get('/user', userAuthMiddleware, getOrders);
OrderRouter.post('/add', userAuthMiddleware,   orderValidation, validationMiddleware, addOrder);
OrderRouter.delete('/delete/:orderId', userAuthMiddleware, deleteOrder);
OrderRouter.put('/update/:orderId', userAuthMiddleware, updateOrder);
OrderRouter.get('/all', adminAuthMiddleware, getAllOrders);
OrderRouter.get('/today/count', todayOrderCounts);
export default OrderRouter;