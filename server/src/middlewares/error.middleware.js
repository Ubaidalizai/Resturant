
export const ErrorMiddlware = (err, req, res,next)=>{
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({
        success: false,
        message: message
    });
}