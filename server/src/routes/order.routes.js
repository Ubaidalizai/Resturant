import {express} from 'express';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { orderValidation } from '../validators/order.validator.js';
import { addOrder, deleteOrder, getOrders } from '../controllers/order.controller.js';
const OrderRouter = express.Router();

OrderRouter.ge('/all', getOrders);
OrderRouter.post('/add', orderValidation, validationMiddleware, addOrder);
OrderRouter.delete('/delete:orderId', deleteOrder)

export default OrderRouter;