import { validationResult } from "express-validator"
import ErrorHandler from '../utils/errorHandler.util.js'
// Handling the validation errors
export const validationMiddleware = (req, res, next)=>{
    const errors = validationResult(req);
    if(errors.isEmpty())return next();
    const firstError = errors.array()[0];
    return next(new ErrorHandler(400, firstError.msg));
}