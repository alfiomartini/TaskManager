import express from "express";
import authRoutes from "./auth";

const router = express.Router();

router.use("/auth", authRoutes);
// ... other routes in the future

export default router;
