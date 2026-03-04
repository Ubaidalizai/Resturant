import express from 'express';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { orderValidation } from '../validators/order.validator.js';
import { addOrder, deleteOrder, getAllOrders, getOrders, orderCounts, updateOrder } from '../controllers/order.controller.js';
import { userAuthMiddleware } from '../middlewares/userAuth.middleware.js';
import { authorizeRole } from '../middlewares/authorizeRole.middleware.js';
const OrderRouter = express.Router();

OrderRouter.get('/user', userAuthMiddleware, authorizeRole('user'), getOrders);
OrderRouter.post('/add', userAuthMiddleware,  orderValidation, validationMiddleware, addOrder);
OrderRouter.delete('/delete/:orderId', userAuthMiddleware, authorizeRole('user'), deleteOrder);
OrderRouter.put('/update/:orderId', updateOrder);
OrderRouter.get('/all',  getAllOrders);
OrderRouter.get('/count/:type', orderCounts);
export default OrderRouter;