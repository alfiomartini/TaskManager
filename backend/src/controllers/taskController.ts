import { Request, Response } from "express";
import Task, { ITask } from "../models/task";
import User, { IUser } from "../models/user";
import {
  CreateTaskRequestBody,
  UpdateTaskRequestBody,
  TaskRequestParams,
  TaskFilter,
  isValidStatus,
  isValidSortOrder,
  SortOrder,
} from "../types";

// Create a new task
export const createTask = async (
  req: Request<{}, {}, CreateTaskRequestBody>,
  res: Response
) => {
  try {
    const { title, description, dueDate, status, userId } = req.body;
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const task = new Task({
      title,
      description,
      dueDate,
      status,
      user: userId,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get all tasks
export const getTasks = async (
  req: Request<{}, {}, {}, { status?: string; sortByDueDate?: string }>,
  res: Response
) => {
  try {
    const { status, sortByDueDate } = req.query;
    const filter: TaskFilter = {};
    if (status) {
      if (isValidStatus(status)) {
        filter.status = status;
      } else {
        return res.status(400).json({ message: "Invalid status" });
      }
    }
    const sort: { [key: string]: SortOrder } = {};
    if (sortByDueDate) {
      if (isValidSortOrder(sortByDueDate)) {
        sort.dueDate = sortByDueDate;
      } else {
        return res.status(400).json({ message: "Invalid sortByDueDate" });
      }
    }
    const tasks: ITask[] = await Task.find(filter).sort(sort);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get a single task by ID
export const getTaskById = async (
  req: Request<TaskRequestParams>,
  res: Response
) => {
  try {
    const task: ITask | null = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Update a task
export const updateTask = async (
  req: Request<TaskRequestParams, {}, UpdateTaskRequestBody>,
  res: Response
) => {
  try {
    const task: ITask | null = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Delete a task
export const deleteTask = async (
  req: Request<TaskRequestParams>,
  res: Response
) => {
  try {
    const task: ITask | null = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
