import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectWithRetry = (): Promise<void> => {
  return mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
