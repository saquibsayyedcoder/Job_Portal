
import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";
import adminRouter from "./routes/adminRouter.js"
import applicationRouter from "./routes/applicationRouter.js";
import resumeRouter from "./routes/resumeRouter.js";
import { newsLetterCron } from "./automation/newsLetterCron.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const app = express();

// Load environment variables
config({ path: "./.env" });

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:7777",
  "https://localhost:7777",
  "http://localhost:7778",
  "https://localhost:7778",
  "http://honorfreelance.aiztsinfotech.com",
  "http://honorfreelance.com:7778",
  "https://honorfreelance.com:7778",
  "http://www.honorfreelance.com:7778",
  "https://www.honorfreelance.com:7778",
  "http://honorfreelance.com:7777",
  "https://honorfreelance.com:7777",
  "http://www.honorfreelance.com:7777",
  "https://www.honorfreelance.com:7777",
  "http://honorfreelance.com",
  "https://honorfreelance.com",
  "http://www.honorfreelance.com",
  "https://www.honorfreelance.com"
];




app.use(
  cors({
    origin: allowedOrigins, // Allow the frontend to make requests
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies and headers to be sent/received
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));




// Serve /uploads as static files

const __dirname = path.resolve();
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));


// Routes

app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/admin",adminRouter);


app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/resume",resumeRouter);
// Newsletter cron job
newsLetterCron();

// Connect to MongoDB
connection();

// Error middleware
app.use(errorMiddleware);

export default app;
