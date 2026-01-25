import express, { urlencoded } from "express";
import {} from "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./src/configs/db.config.js";
import { ErrorMiddlware } from "./src/middlewares/error.middleware.js";
import { ResponseMiddleware } from "./src/middlewares/response.middleware.js";

// Route Import
import userAuthRouter from "./src/routes/userAuth.routes.js";
import adminRouter from "./src/routes/adminAuth.routes.js";
import ProductRouter from "./src/routes/product.routes.js";

const app = express();

// Middleware configuration
app.use(express.json({ limit: "16kb" }));
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(ResponseMiddleware);

// Routes
app.use("/api/v1/user-auth/", userAuthRouter);
app.use('/api/v1/admin/', adminRouter);
app.use('/api/v1/products/', ProductRouter);

// DB Connection
connectDB();
// Error Middleware
app.use(ErrorMiddlware);

// Server listen
app.listen(process.env.PORT, () =>
  console.log(
    `Server listening at port ${process.env.PORT}`,
  ),
);
