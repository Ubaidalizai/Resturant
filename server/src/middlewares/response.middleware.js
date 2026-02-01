export const ResponseMiddleware = (req, res, next) => {
  res.respond = function (statusCode, message = "Success", data = null) {

    const responseBody = {
      success: statusCode >= 200 && statusCode < 300,
      message,
    };

    if (data && typeof data === "object") {
      // Add the data to object with name as provided in parameter
      Object.assign(responseBody, {data} );
    }
    return res.status(statusCode).json(responseBody);
  };

  next();
};
