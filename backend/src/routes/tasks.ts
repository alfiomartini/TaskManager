import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController";
import { authenticate } from "../middleware";

const router = Router();

router.post("/tasks", authenticate, createTask);
router.get("/tasks", getTasks);
router.get("/tasks/:id", authenticate, getTaskById);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

export default router;
