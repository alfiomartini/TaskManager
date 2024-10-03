import express from "express";
import authRoutes from "./auth";
import taskRoutes from "./tasks";
import userRoutes from "./user";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);
router.use("/users", userRoutes); // Add user routes

export default router;
