import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // Instead of process.exit(), consider these options:
    // 1. Throw the error to be caught at a higher level
    throw error;

    // 2. Log the error and try to reconnect (if appropriate)
    // console.error("Retrying connection...");
    // setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

export default connectDB;
