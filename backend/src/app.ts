import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectWithRetry as connectDB } from "./config/db";
import router from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", router);

// Connect to database and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Error connecting to database:", err));
