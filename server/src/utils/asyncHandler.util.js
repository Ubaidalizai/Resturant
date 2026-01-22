import ErrorHandler from "./errorHandler.util";

export const asyncHandler = (fn)=> async (req, res, next)=>{
    try {
        await fn(req, res, next);
    } catch (error) {
        return next(new ErrorHandler(error.status || 500, error.message));
    }
}