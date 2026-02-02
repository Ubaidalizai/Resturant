import express from 'express';
const FoodRouter = express.Router();
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { adminAuthMiddleware } from '../middlewares/adminAuth.middleware.js';
import {upload} from '../configs/multer.config.js';
import { foodValidation } from '../validators/food.validator.js';
import { addFood, deleteFood, getFoods } from '../controllers/food.controller.js';

FoodRouter.post('/add',upload.single('image'), foodValidation, validationMiddleware,  addFood);
FoodRouter.get('/all', getFoods);
FoodRouter.delete('/delete/:productId', deleteFood);
FoodRouter.put('/update/:productId', upload.single('image'), foodValidation, validationMiddleware, updateFood);
export default FoodRouter;            