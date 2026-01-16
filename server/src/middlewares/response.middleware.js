
export const ResponseMiddleware = (req, res, next)=>{
    res.respond = function(statusCode, message = "Success", resources){
        const body = {
            success: statusCode >=200 && statusCode<300,
            message
        };
        if(resources && typeof resources === "object"){
            Object.assign(body, resources);
        }
        next();
    }
}