import express from 'express';
import { addMenue, deleteMenue, getMenues, updateMenue } from '../controllers/menue.controller.js';
import { menueValidations } from '../validators/menue.validator.js';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
const MenueRouter = express.Router();

MenueRouter.get('/all', getMenues);
MenueRouter.post('/add', menueValidations, validationMiddleware, addMenue); 
MenueRouter.delete('/delete/:menueId', deleteMenue);
MenueRouter.put('/update/:menueId', menueValidations, validationMiddleware, updateMenue);

export default MenueRouter;