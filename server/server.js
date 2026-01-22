import express, { urlencoded } from "express";
import {} from "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

// Middleware configuration
app.use(express.json({ limit: "16kb" }));
app.use(
  cors({
    origin: ["http:localhost:5173"],
    credentials: true,
  }),
);
app.use(urlencoded({ extended: true }));
app.use(cookieParser());


// Routes

// DB Connection

// Error Middleware

// Server listen
app.listen(process.env.PORT, () =>
  console.log(`Server listening at port ${process.env.PORT}`),
);
