import { body } from "express-validator";

export const attendanceValidation = [
  body("staffId").notEmpty().withMessage("Staff ID is required"),
  body("date").notEmpty().withMessage("Date is required"),
  body("status")
    .isIn(["present", "absent", "leave"])
    .withMessage("Status must be present, absent, or leave"),
  body("notes").optional().isString(),
];

export const bulkAttendanceValidation = [
  body("status")
    .isIn(["present", "absent", "leave"])
    .withMessage("Status must be present, absent, or leave"),
];

export const salaryPayValidation = [
  body("paymentMethod").optional().isString(),
  body("paymentDate").optional().isISO8601(),
  body("notes").optional().isString(),
];

export const salaryRevertValidation = [
  body("reason")
    .notEmpty()
    .withMessage("Reason is required to revert a paid salary")
    .isString()
    .isLength({ min: 5 })
    .withMessage("Reason must be at least 5 characters"),
];

export const salaryUpdateValidation = [
  body("overtime").optional().isFloat({ min: 0 }),
  body("extraDeduction").optional().isFloat({ min: 0 }),
  body("notes").optional().isString(),
];

export const salaryGenerateValidation = [
  body("month").optional().isInt({ min: 1, max: 12 }),
  body("year").optional().isInt({ min: 2020 }),
];
