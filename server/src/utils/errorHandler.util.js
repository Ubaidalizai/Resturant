
class ErrorHandler extends Error{
    constructor(statusCode, message = "Some thing went wrong"){
        super(message);
        this.succuss = false;
        this.statusCode = statusCode
    }
}
export default ErrorHandler;