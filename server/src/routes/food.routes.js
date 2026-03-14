import express from 'express';
import {
  addFood,
  getFoods,
  deleteFood,
  updateFood,
  getFoodBySales,
  getMenueFoods
} from '../controllers/food.controller.js';
import { foodValidation } from '../validators/food.validator.js';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { userAuthMiddleware } from '../middlewares/userAuth.middleware.js';
import { authorize } from '../middlewares/authorizeRole.middleware.js';
import { upload } from '../configs/multer.config.js';

const foodsRouter = express.Router();
foodsRouter.use(userAuthMiddleware);
foodsRouter.use(authorize('admin_access', 'garson_access', 'kitchen_access'));
foodsRouter.post(
  '/add',
 
  upload.single('image'),
  foodValidation,
  validationMiddleware,
  addFood
);

foodsRouter.get(
  '/all',

  getFoods
);

foodsRouter.put(
  '/update/:id',
  upload.single('image'),
  foodValidation,
  validationMiddleware,
  updateFood
);

foodsRouter.delete(
  '/delete/:id',
  deleteFood
);

// additional food routes
foodsRouter.get('/sales', userAuthMiddleware, authorize('view_foods','admin_access'), getFoodBySales);
foodsRouter.get('/menu/:menuId', userAuthMiddleware, authorize('view_foods','admin_access'), getMenueFoods);

export default foodsRouter;