import express from 'express';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { orderValidation } from '../validators/order.validator.js';
import { addOrder, deleteOrder, getAllOrders, getOrders, orderCounts, updateOrder } from '../controllers/order.controller.js';
import { userAuthMiddleware } from '../middlewares/userAuth.middleware.js';
import { authorize } from '../middlewares/authorizeRole.middleware.js';

const OrderRouter = express.Router();
OrderRouter.use(userAuthMiddleware);
OrderRouter.use(authorize('admin_access', 'garson_access', 'order_history_access', 'overview_access'));
// User orders → garson or admin
OrderRouter.get(
  '/user', 
  getOrders
);

// Add order → order_food or garson or admin
OrderRouter.post(
  '/add',
  orderValidation,
  validationMiddleware,
  addOrder
);

// Delete order → garson or admin
OrderRouter.delete(
  '/delete/:orderId', 
  deleteOrder
);

// Update order → garson or admin
OrderRouter.put(
  '/update/:orderId',
  updateOrder
);

// Get all orders → garson or admin
OrderRouter.get(
  '/all',  
  getAllOrders
);

// Order counts → garson or admin
OrderRouter.get(
  '/count/:type',
  orderCounts
);

export default OrderRouter;