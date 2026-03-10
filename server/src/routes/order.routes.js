import express from 'express';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { orderValidation } from '../validators/order.validator.js';
import { addOrder, deleteOrder, getAllOrders, getOrders, orderCounts, updateOrder } from '../controllers/order.controller.js';
import { userAuthMiddleware } from '../middlewares/userAuth.middleware.js';
import { authorize } from '../middlewares/authorizeRole.middleware.js';

const OrderRouter = express.Router();

// User orders → garson or admin
OrderRouter.get(
  '/user', 
  userAuthMiddleware,
  authorize('garson_access', 'admin_access'),
  getOrders
);

// Add order → order_food or garson or admin
OrderRouter.post(
  '/add',
  userAuthMiddleware,
  authorize('order_food', 'garson_access', 'admin_access'),
  orderValidation,
  validationMiddleware,
  addOrder
);

// Delete order → garson or admin
OrderRouter.delete(
  '/delete/:orderId', 
  userAuthMiddleware,
  authorize('garson_access', 'admin_access'),
  deleteOrder
);

// Update order → garson or admin
OrderRouter.put(
  '/update/:orderId',
  userAuthMiddleware,
  authorize('garson_access', 'admin_access'),
  updateOrder
);

// Get all orders → garson or admin
OrderRouter.get(
  '/all',  
  userAuthMiddleware,
  authorize('garson_access', 'admin_access'),
  getAllOrders
);

// Order counts → garson or admin
OrderRouter.get(
  '/count/:type',
  userAuthMiddleware,
  authorize('garson_access', 'admin_access'),
  orderCounts
);

export default OrderRouter;