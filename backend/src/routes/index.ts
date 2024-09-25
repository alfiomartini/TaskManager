import express from "express";
import authRoutes from "./auth";
import taskRoutes from "./tasks";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);
// ... other routes in the future

export default router;
