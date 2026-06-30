// app.js
import express, { urlencoded } from "express";
import {} from "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import path from "path";

// dotenv.config();
// DB connection
import { connectDB } from "./src/configs/db.config.js";

// Middleware
import { ErrorMiddlware } from "./src/middlewares/error.middleware.js";
import { ResponseMiddleware } from "./src/middlewares/response.middleware.js";
import { apiLimiter } from "./src/middlewares/rateLimit.middleware.js";

// Routes
import userAuthRouter from "./src/routes/userAuth.routes.js";
import FoodRouter from "./src/routes/food.routes.js";
import tableRouter from "./src/routes/table.routes.js";
import MenueRouter from "./src/routes/menue.routes.js";
import OrderRouter from "./src/routes/order.routes.js";
import UserRouter from "./src/routes/user.routes.js";
import expenseCatagoryRouter from "./src/routes/expenseCatagory.routes.js";
import expensesRouter from "./src/routes/expenses.routes.js";
import revenueRouter from "./src/routes/revenue.routes.js";
import BillRouter from "./src/routes/bill.routes.js";
import Staffrouter from "./src/routes/staff.routes.js";
import analyticsRouter from "./src/routes/analytics.routes.js";
import stockRouter from "./src/routes/stock.routes.js";
import roleRouter from "./src/routes/role.routes.js";
import permissionRouter from "./src/routes/permission.routes.js";
import attendanceRouter from "./src/routes/attendance.routes.js";
import salaryRouter from "./src/routes/salary.routes.js";
import accountingRouter from "./src/routes/accounting.routes.js";
import dakhalRouter from "./src/routes/dakhal.routes.js";
import lossRouter from "./src/routes/loss.routes.js";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(apiLimiter);

// JSON and URL encoding
app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Response middleware
app.use(ResponseMiddleware);

// CORS setup for API and static files
const allowedOrigins = [
  "http://localhost:5173", // React dev server default
  "http://localhost:5174", // Alternative port
  "http://localhost:5175", // Another alternative port
  "http://localhost:3000"  // Common dev port
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Serve uploads folder with CORS
app.use("/uploads", cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}), express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/v1/user/", userAuthRouter);
app.use("/api/v1/foods/", FoodRouter);
app.use("/api/v1/tables/", tableRouter);
app.use("/api/v1/menues/", MenueRouter);
app.use("/api/v1/orders/", OrderRouter);
app.use("/api/v1/users/", UserRouter);
app.use("/api/v1/expenseCatagories/", expenseCatagoryRouter);
app.use("/api/v1/expenses/", expensesRouter);
app.use("/api/v1/revenue/", revenueRouter);
app.use("/api/v1/bill/", BillRouter);
app.use("/api/v1/staff/", Staffrouter);
app.use("/api/v1/analytics/", analyticsRouter);
app.use("/api/v1/stock", stockRouter);
app.use("/api/v1/role", roleRouter);
// Get all permissions 
app.use("/api/v1/permissions", permissionRouter);
app.use("/api/v1/attendance/", attendanceRouter);
app.use("/api/v1/salary/", salaryRouter);
app.use("/api/v1/accounting/", accountingRouter);
app.use("/api/v1/dakhal/", dakhalRouter);
app.use("/api/v1/losses/", lossRouter);
// Connect to DB
connectDB();

// 404 handler
app.use((req, res) => {
  res.respond(404, "Route not found");
});
// Error middleware
app.use(ErrorMiddlware);

export default app;