import { validationResult } from "express-validator"
import ErrorHandler from '../utils/errorHandler.util.js'
// Handling the validation errors
export const validationMiddleware = (req, res, next)=>{
    const errors = validationResult(req);
    if(errors.isEmpty())return next();
    const firstError = errors.array()[0];
    return res.respond(400, firstError.msg) ;
}