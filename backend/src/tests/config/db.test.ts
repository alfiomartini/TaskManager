import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../../config/db";

dotenv.config();

jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

describe("connectDB", () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let setTimeoutSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    setTimeoutSpy = jest.spyOn(global, "setTimeout");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should connect to MongoDB successfully", async () => {
    (mongoose.connect as jest.Mock).mockResolvedValueOnce(null);

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);
    expect(consoleLogSpy).toHaveBeenCalledWith("Connected to MongoDB");
  });

  it("should retry connection if it fails", async () => {
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(
      new Error("Connection failed")
    );

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error connecting to MongoDB:",
      expect.any(Error)
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Retrying connection in 5 seconds..."
    );
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
  });
});
