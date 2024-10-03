import express from "express";
import { getUserById } from "../controllers/userController";

const router = express.Router();

// GET endpoint to fetch user by userId
router.get("/:userId", getUserById);

export default router;
