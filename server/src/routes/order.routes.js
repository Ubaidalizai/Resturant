import express from 'express';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { orderValidation } from '../validators/order.validator.js';
import { addOrder, deleteOrder, getAllOrders, getKitchenOrders, getOrdersByTable, getOrders, orderCounts, updateOrder, updateOrderStatus } from '../controllers/order.controller.js';
import { userAuthMiddleware } from '../middlewares/userAuth.middleware.js';
import { authorize } from '../middlewares/authorizeRole.middleware.js';

const OrderRouter = express.Router();
OrderRouter.use(userAuthMiddleware);
OrderRouter.use(authorize('admin_access', 'garson_access', 'order_history_access', 'overview_access', 'kitchen_access'));
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

// Get kitchen orders → kitchen staff, admin, or garson
OrderRouter.get(
  '/kitchen',
  getKitchenOrders
);

// Get active table orders → garson or admin
OrderRouter.get(
  '/table/:tableId',
  getOrdersByTable
);

// Update order status → kitchen or admin
OrderRouter.put(
  '/status/:orderId',
  updateOrderStatus
);

// Order counts → garson or admin
OrderRouter.get(
  '/count/:type',
  orderCounts
);

export default OrderRouter;