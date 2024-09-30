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

router.post("/create", authenticate, createTask);
router.get("/list", authenticate, getTasks);
router.get("/get/:id", authenticate, getTaskById);
router.put("/update/:id", authenticate, updateTask);
router.delete("/delete/:id", authenticate, deleteTask);

export default router;
