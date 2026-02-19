import express, { urlencoded } from "express";
import {} from "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./src/configs/db.config.js";
import { ErrorMiddlware } from "./src/middlewares/error.middleware.js";
import { ResponseMiddleware } from "./src/middlewares/response.middleware.js";
// Route Import
import userAuthRouter from "./src/routes/userAuth.routes.js";
import FoodRouter from "./src/routes/food.routes.js";
import tableRouter from "./src/routes/table.routes.js";
import MenueRouter from "./src/routes/menue.routes.js";
import OrderRouter from "./src/routes/order.routes.js";
import UserRouter from "./src/routes/user.routes.js";
import expenseCatagoryRouter from "./src/routes/expenseCatagory.routes.js";
import expensesRouter from "./src/routes/expenses.routes.js";
import revenueRouter from "./src/routes/revenue.routes.js";
import path from 'path';
import BillRouter from "./src/routes/bill.routes.js";
const app = express();
app.use("/uploads", express.static(path.join("uploads")));

// Middleware configuration
app.use(express.json({ limit: "16kb" }));
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(ResponseMiddleware);
app.get('/api/test', (req, res)=>{
  res.send("API is working");
})
// Routes
app.use("/api/v1/user/", userAuthRouter);
app.use('/api/v1/foods/', FoodRouter);
app.use('/api/v1/tables/', tableRouter);
app.use('/api/v1/menues/', MenueRouter);
app.use('/api/v1/orders/', OrderRouter);
app.use('/api/v1/users/', UserRouter);
app.use('/api/v1/expenseCatagories/', expenseCatagoryRouter);
app.use('/api/v1/expenses/', expensesRouter);
app.use('/api/v1/revenue/', revenueRouter);
app.use('/api/v1/bill/', BillRouter)
// DB Connection
connectDB();
// Error Middleware
app.use(ErrorMiddlware);

// 404 Handling 
app.use((req, res) => {
  res.respond(404, 'Route not found');
});

// Server listen
app.listen(process.env.PORT, () =>
  console.log(
    `Server listening at port ${process.env.PORT}`,
  ),
);
