import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async (): Promise<void> => {
  const connectWithRetry = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI!);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      console.log("Retrying connection in 5 seconds...");
      setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    }
  };

  connectWithRetry();
};

export default connectDB;
