import express from 'express';
const FoodRouter = express.Router();
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import {upload} from '../configs/multer.config.js';
import { foodValidation } from '../validators/food.validator.js';
import { addFood, deleteFood, getFoodBySales, getFoods, getMenueFoods, updateFood } from '../controllers/food.controller.js';
import { userAuthMiddleware } from '../middlewares/userAuth.middleware.js';

FoodRouter.post('/add',upload.single('image'), foodValidation, validationMiddleware,  addFood);
FoodRouter.get('/all', getFoods);
FoodRouter.get('/menu/:menuId', getMenueFoods);
FoodRouter.delete('/delete/:productId', userAuthMiddleware,  deleteFood);
FoodRouter.put('/update/:productId', upload.single('image'), foodValidation, validationMiddleware, updateFood);
FoodRouter.get("/sales", getFoodBySales);

export default FoodRouter;            