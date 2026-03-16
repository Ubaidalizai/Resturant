import { ErrorLog } from "../models/ErrorLog.model.js";
import { getLangFromReq, translate, toMessageCode } from "../utils/localization.util.js";

export const ErrorMiddlware = async (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const lang = getLangFromReq(req);
  const errorCode = err.errorCode || toMessageCode(err.message);
  const message = translate(errorCode, lang) || err.message || "Internal server error";

  // Save the error log to the database if the environment is production
  if (process.env.NODE_ENV === "production") {
    try {
      await ErrorLog.create({
        message: err.message,
        stack: err.stack,
        route: req.route ? req.route.path : "Unknown",
        method: req.method,
        StatusCode: statusCode,
        user: req.user ? req.user._id : null,
        severity: statusCode >= 500 ? "high" : "medium",
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Failed to save error log:", error);
    }
    return res.status(statusCode).json({
      success: false,
      code: errorCode,
      message: translate("SOMETHING_WENT_WRONG", lang) || "Something went wrong",
    });
  }

  res.status(statusCode).json({
    success: false,
    code: errorCode,
    message,
  });
};
