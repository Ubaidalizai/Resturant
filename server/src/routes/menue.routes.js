import express from 'express';
import { addMenue, deleteMenue, getMenues, updateMenue } from '../controllers/menue.controller.js';
import { menueValidations } from '../validators/menue.validator.js';
import { validationMiddleware } from '../middlewares/validationsHandler.utils.js';
import { userAuthMiddleware } from '../middlewares/userAuth.middleware.js';
import { authorize } from '../middlewares/authorizeRole.middleware.js';

const MenueRouter = express.Router();

MenueRouter.get(
  '/all',
  userAuthMiddleware,
  authorize('view_menu', 'admin_access'),
  getMenues
);

MenueRouter.post(
  '/add',
  userAuthMiddleware,
  authorize('add_menu', 'admin_access'),
  menueValidations,
  validationMiddleware,
  addMenue
);

MenueRouter.delete(
  '/delete/:menueId',
  userAuthMiddleware,
  authorize('admin_access'),
  deleteMenue
);

MenueRouter.put(
  '/update/:menueId',
  userAuthMiddleware,
  authorize('admin_access'),
  menueValidations,
  validationMiddleware,
  updateMenue
);

export default MenueRouter;