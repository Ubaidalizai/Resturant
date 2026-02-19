import express from 'express';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { orderValidation } from '../validators/order.validator.js';
import { addOrder, deleteOrder, getAllOrders, getOrders, todayOrderCounts, updateOrder } from '../controllers/order.controller.js';
const OrderRouter = express.Router();

OrderRouter.get('/user', getOrders);
OrderRouter.post('/add',   orderValidation, validationMiddleware, addOrder);
OrderRouter.delete('/delete/:orderId', deleteOrder);
OrderRouter.put('/update/:orderId', updateOrder);
OrderRouter.get('/all',  getAllOrders);
OrderRouter.get('/today/count', todayOrderCounts);
export default OrderRouter;