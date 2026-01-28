import express from 'express';
import { addMenue, deleteMenue, getMenues } from '../controllers/menue.controller.js';
import { menueValidations } from '../validators/menue.validator.js';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
const MenueRouter = express.Router();

MenueRouter.get('/all', getMenues);
MenueRouter.post('/add', menueValidations, validationMiddleware, addMenue); 
MenueRouter.delete('/delete/:menueId', deleteMenue);

export default MenueRouter;