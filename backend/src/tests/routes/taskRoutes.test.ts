process.env.JWT_SECRET = "testsecret";
import request from "supertest";
import express, { NextFunction } from "express";
import taskRouter from "../../routes/tasks";
import * as taskController from "../../controllers/taskController";
import { authenticate } from "../../middleware";
import { AuthRequest } from "../../types";

jest.mock("../../controllers/taskController");
jest.mock("../../middleware", () => ({
  authenticate: (req: AuthRequest, res: Response, next: NextFunction) => next(),
}));

const app = express();
app.use(express.json());
app.use("/tasks", taskRouter);

describe("Task Routes", () => {
  describe("POST /tasks/create", () => {
    it("should call createTask controller and return 201", async () => {
      (taskController.createTask as jest.Mock).mockImplementation(
        (req, res) => {
          res.status(201).json({ message: "Task created successfully" });
        }
      );

      const response = await request(app)
        .post("/tasks/create")
        .send({ title: "New Task", description: "Task description" });

      expect(taskController.createTask).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: "Task created successfully" });
    });

    it("should return 400 if task creation fails", async () => {
      (taskController.createTask as jest.Mock).mockImplementation(
        (req, res) => {
          res.status(400).json({ message: "Task creation failed" });
        }
      );

      const response = await request(app)
        .post("/tasks/create")
        .send({ title: "", description: "Task description" });

      expect(taskController.createTask).toHaveBeenCalled();
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Task creation failed" });
    });
  });

  describe("GET /tasks/list", () => {
    it("should call getTasks controller and return 200", async () => {
      (taskController.getTasks as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json([{ id: 1, title: "Task 1" }]);
      });

      const response = await request(app).get("/tasks/list");

      expect(taskController.getTasks).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 1, title: "Task 1" }]);
    });
  });

  describe("GET /tasks/get/:id", () => {
    it("should call getTaskById controller and return 200", async () => {
      (taskController.getTaskById as jest.Mock).mockImplementation(
        (req, res) => {
          res.status(200).json({ id: 1, title: "Task 1" });
        }
      );

      const response = await request(app).get("/tasks/get/1");

      expect(taskController.getTaskById).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, title: "Task 1" });
    });

    it("should return 404 if task not found", async () => {
      (taskController.getTaskById as jest.Mock).mockImplementation(
        (req, res) => {
          res.status(404).json({ message: "Task not found" });
        }
      );

      const response = await request(app).get("/tasks/get/999");

      expect(taskController.getTaskById).toHaveBeenCalled();
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Task not found" });
    });
  });

  describe("PUT /tasks/update/:id", () => {
    it("should call updateTask controller and return 200", async () => {
      (taskController.updateTask as jest.Mock).mockImplementation(
        (req, res) => {
          res.status(200).json({ message: "Task updated successfully" });
        }
      );

      const response = await request(app)
        .put("/tasks/update/1")
        .send({ title: "Updated Task", description: "Updated description" });

      expect(taskController.updateTask).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Task updated successfully" });
    });

    it("should return 400 if task update fails", async () => {
      (taskController.updateTask as jest.Mock).mockImplementation(
        (req, res) => {
          res.status(400).json({ message: "Task update failed" });
        }
      );

      const response = await request(app)
        .put("/tasks/update/1")
        .send({ title: "", description: "Updated description" });

      expect(taskController.updateTask).toHaveBeenCalled();
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Task update failed" });
    });
  });

  describe("DELETE /tasks/delete/:id", () => {
    it("should call deleteTask controller and return 200", async () => {
      (taskController.deleteTask as jest.Mock).mockImplementation(
        (req, res) => {
          res.status(200).json({ message: "Task deleted successfully" });
        }
      );

      const response = await request(app).delete("/tasks/delete/1");

      expect(taskController.deleteTask).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Task deleted successfully" });
    });

    it("should return 404 if task deletion fails", async () => {
      (taskController.deleteTask as jest.Mock).mockImplementation(
        (req, res) => {
          res.status(404).json({ message: "Task not found" });
        }
      );

      const response = await request(app).delete("/tasks/delete/999");

      expect(taskController.deleteTask).toHaveBeenCalled();
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Task not found" });
    });
  });
});
