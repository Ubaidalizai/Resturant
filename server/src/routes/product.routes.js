import express from 'express';
const ProductRouter = express.Router();
import { addProduct, getProducts } from '../controllers/product.controller.js';
import { productValidations } from '../validators/product.validator.js';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { adminAuthMiddleware } from '../middlewares/adminAuth.middleware.js';
import {upload} from '../configs/multer.config.js';
import { deleteProduct } from '../controllers/product.controller.js';

ProductRouter.post('/add',   productValidations, validationMiddleware, upload.single('image'), addProduct);
ProductRouter.get('/all', getProducts);
ProductRouter.delete('/delete/:productId', adminAuthMiddleware, deleteProduct);

export default ProductRouter;