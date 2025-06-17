// src/app.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authMiddleware from "./middlewares/authMiddleware.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Global middleware: JWT protector
app.use(authMiddleware); // Dipasang sebelum routing

// Prefix semua route dengan /api
app.use("/api", routes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "URL not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: "error", message: "Internal server error" });
});
export default app;
