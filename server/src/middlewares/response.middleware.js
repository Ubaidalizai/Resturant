import { getLangFromReq, translate, toMessageCode } from "../utils/localization.util.js";

export const ResponseMiddleware = (req, res, next) => {
  res.respond = function (statusCode, message = "Success", data = null) {
    const lang = getLangFromReq(req);

    // Use a machine-readable code for translation, but keep the original message as fallback.
    const code = toMessageCode(message);
    const localizedMessage = translate(code, lang) || message;

    const responseBody = {
      success: statusCode >= 200 && statusCode < 300,
      code,
      message: localizedMessage,
    };

    if (data && typeof data === "object") {
      // Add the data to object with name as provided in parameter
      Object.assign(responseBody, { data });
    }
    return res.status(statusCode).json(responseBody);
  };

  next();
};
