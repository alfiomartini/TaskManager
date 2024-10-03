import express from "express";
import { getUserById } from "../controllers/userController";
import { authenticate } from "../middleware";

const router = express.Router();

// GET endpoint to fetch user by userId
router.get("/:userId", authenticate, getUserById);

export default router;
