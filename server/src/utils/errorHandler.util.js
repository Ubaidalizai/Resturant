
class ErrorHandler extends Error {
    constructor(statusCode, message = "Some thing went wrong") {
        super(message);
        this.success = false;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
export default ErrorHandler;