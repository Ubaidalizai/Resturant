import express from "express";
import {
  generateMonthlySalaries,
  getAllSalaries,
  getSalarySummary,
  getEmployeeSalaryProfile,
  paySalary,
  revertSalary,
  updateSalary,
  deleteSalary,
} from "../controllers/salary.controller.js";
import {
  salaryPayValidation,
  salaryRevertValidation,
  salaryUpdateValidation,
  salaryGenerateValidation,
} from "../validators/attendance.validator.js";
import { validationMiddleware } from "../middlewares/validationsHandler.utils.js";
import { userAuthMiddleware } from "../middlewares/userAuth.middleware.js";
import { authorize } from "../middlewares/authorizeRole.middleware.js";

const salaryRouter = express.Router();

salaryRouter.use(userAuthMiddleware);
salaryRouter.use(authorize("admin_access", "salary_access"));

salaryRouter.post("/generate", salaryGenerateValidation, validationMiddleware, generateMonthlySalaries);
salaryRouter.get("/all", getAllSalaries);
salaryRouter.get("/summary", getSalarySummary);
salaryRouter.get("/profile/:staffId", getEmployeeSalaryProfile);
salaryRouter.put("/pay/:salaryId", salaryPayValidation, validationMiddleware, paySalary);
salaryRouter.put("/revert/:salaryId", salaryRevertValidation, validationMiddleware, revertSalary);
salaryRouter.put("/update/:salaryId", salaryUpdateValidation, validationMiddleware, updateSalary);
salaryRouter.delete("/delete/:salaryId", deleteSalary);

export default salaryRouter;
