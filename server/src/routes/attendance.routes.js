import express from "express";
import {
  getAttendanceByDate,
  upsertAttendance,
  bulkUpdateAttendance,
  getAttendanceReport,
} from "../controllers/attendance.controller.js";
import {
  attendanceValidation,
  bulkAttendanceValidation,
} from "../validators/attendance.validator.js";
import { validationMiddleware } from "../middlewares/validationsHandler.utils.js";
import { userAuthMiddleware } from "../middlewares/userAuth.middleware.js";
import { authorize } from "../middlewares/authorizeRole.middleware.js";

const attendanceRouter = express.Router();

attendanceRouter.use(userAuthMiddleware);
attendanceRouter.use(authorize("admin_access", "panel_access", "salary_access"));

attendanceRouter.get("/date/:date", getAttendanceByDate);
attendanceRouter.get("/report", getAttendanceReport);
attendanceRouter.post("/update", attendanceValidation, validationMiddleware, upsertAttendance);
attendanceRouter.put("/bulk/:date", bulkAttendanceValidation, validationMiddleware, bulkUpdateAttendance);

export default attendanceRouter;
