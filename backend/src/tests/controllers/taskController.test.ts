import { Request, Response } from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../../controllers/taskController";
import Task, { ITask } from "../../models/task";
import User from "../../models/user";
import {
  AuthRequest,
  CreateTaskRequestBody,
  UpdateTaskRequestBody,
} from "../../types"; // Adjust the import path as necessary
import mongoose from "mongoose";
import { IUser } from "../../models/user";

jest.mock("../../models/task");
jest.mock("../../models/user");

describe("Task Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let authReq: Partial<AuthRequest<{ id: string }>>;

  beforeEach(() => {
    req = {
      query: {},
      params: { id: "" },
    };
    res = {
      status: jest.fn().mockReturnThis() as unknown as (
        code: number
      ) => Response,
      json: jest.fn() as unknown as (body: any) => Response,
    };
    next = jest.fn();
    authReq = {
      params: { id: "" },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getTasks", () => {
    it("should get all tasks successfully", async () => {
      req.query = { status: "pending", sortByDueDate: "asc" };
      const tasks = [
        {
          _id: "taskId1",
          title: "Task 1",
          description: "Description 1",
          dueDate: new Date(),
          status: "pending",
        },
        {
          _id: "taskId2",
          title: "Task 2",
          description: "Description 2",
          dueDate: new Date(),
          status: "pending",
        },
      ];

      const findMock = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(tasks),
      });

      (Task.find as jest.Mock) = findMock;

      await getTasks(
        req as Request<{}, {}, {}, { status: string; sortByDueDate: string }>,
        res as Response
      );

      expect(Task.find).toHaveBeenCalledWith({ status: "pending" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(tasks);
    });

    it("should return 400 for invalid status", async () => {
      req.query = { status: "invalid" };

      const findMock = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      });

      (Task.find as jest.Mock) = findMock;

      await getTasks(
        req as Request<{}, {}, {}, { status: string }>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid status" });
    });

    it("should return 400 for invalid sortByDueDate", async () => {
      req.query = { sortByDueDate: "invalid" };

      const findMock = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      });

      (Task.find as jest.Mock) = findMock;

      await getTasks(
        req as Request<{}, {}, {}, { sortByDueDate: string }>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid sortByDueDate",
      });
    });

    it("should return 500 if there is a server error", async () => {
      req.query = { status: "pending", sortByDueDate: "asc" };

      const findMock = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error("Server Error")),
      });

      (Task.find as jest.Mock) = findMock;

      await getTasks(
        req as Request<{}, {}, {}, { status: string; sortByDueDate: string }>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error" });
    });
  });

  describe("getTaskById", () => {
    it("should get a task by ID successfully", async () => {
      authReq.params = { id: "taskId1" };
      const task = {
        _id: "taskId1",
        title: "Task 1",
        description: "Description 1",
        dueDate: new Date(),
        status: "pending",
      };

      (Task.findById as jest.Mock).mockResolvedValue(task);

      await getTaskById(
        authReq as AuthRequest<{ id: string }>,
        res as Response
      );

      expect(Task.findById).toHaveBeenCalledWith("taskId1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(task);
    });

    it("should return 404 if task is not found", async () => {
      authReq.params = { id: "taskId1" };

      (Task.findById as jest.Mock).mockResolvedValue(null);

      await getTaskById(
        authReq as AuthRequest<{ id: string }>,
        res as Response
      );

      expect(Task.findById).toHaveBeenCalledWith("taskId1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });

    it("should return 500 if there is a server error", async () => {
      authReq.params = { id: "taskId1" };

      (Task.findById as jest.Mock).mockRejectedValue(new Error("Server Error"));

      await getTaskById(
        authReq as AuthRequest<{ id: string }>,
        res as Response
      );

      expect(Task.findById).toHaveBeenCalledWith("taskId1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error" });
    });
  });

  describe("deleteTask", () => {
    it("should delete a task by ID successfully", async () => {
      authReq.params = { id: "taskId1" };
      const task = {
        _id: "taskId1",
        title: "Task 1",
        description: "Description 1",
        dueDate: new Date(),
        status: "pending",
      };

      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(task);

      await deleteTask(authReq as AuthRequest<{ id: string }>, res as Response);

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith("taskId1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Task deleted successfully",
      });
    });

    it("should return 404 if task is not found", async () => {
      authReq.params = { id: "taskId1" };

      (Task.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await deleteTask(authReq as AuthRequest<{ id: string }>, res as Response);

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith("taskId1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });

    it("should return 500 if there is a server error", async () => {
      authReq.params = { id: "taskId1" };

      (Task.findByIdAndDelete as jest.Mock).mockRejectedValue(
        new Error("Server Error")
      );

      await deleteTask(authReq as AuthRequest<{ id: string }>, res as Response);

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith("taskId1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error" });
    });
  });

  describe("updateTask", () => {
    it("should update a task successfully", async () => {
      authReq.params = { id: "taskId1" };
      authReq.body = {
        title: "Updated Task",
        description: "Updated Task Description",
        dueDate: new Date(),
        status: "completed",
      };

      const task = {
        _id: "taskId1",
        title: "Updated Task",
        description: "Updated Task Description",
        dueDate: new Date(),
        status: "completed",
        user: "userId",
      };

      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(task);

      await updateTask(
        authReq as AuthRequest<{ id: string }, {}, UpdateTaskRequestBody>,
        res as Response
      );

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        "taskId1",
        authReq.body,
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(task);
    });

    it("should return 404 if task is not found", async () => {
      authReq.params = { id: "taskId1" };
      authReq.body = {
        title: "Updated Task",
        description: "Updated Task Description",
        dueDate: new Date(),
        status: "completed",
      };

      (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await updateTask(
        authReq as AuthRequest<{ id: string }, {}, UpdateTaskRequestBody>,
        res as Response
      );

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        "taskId1",
        authReq.body,
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });

    it("should return 500 if there is a server error", async () => {
      authReq.params = { id: "taskId1" };
      authReq.body = {
        title: "Updated Task",
        description: "Updated Task Description",
        dueDate: new Date(),
        status: "completed",
      };

      (Task.findByIdAndUpdate as jest.Mock).mockRejectedValue(
        new Error("Server Error")
      );

      await updateTask(
        authReq as AuthRequest<{ id: string }, {}, UpdateTaskRequestBody>,
        res as Response
      );

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        "taskId1",
        authReq.body,
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error" });
    });
  });

  describe("createTask", () => {
    it("should create a new task successfully", async () => {
      authReq.body = {
        title: "New Task",
        description: "New Task Description",
        dueDate: new Date(),
        status: "pending",
      };
      authReq.userId = "userId"; // Ensure userId is set

      const user = {
        _id: "userId",
        name: "Test User",
        email: "test@example.com",
        password: "password",
      };
      const task = {
        _id: "taskId1",
        title: "New Task",
        description: "New Task Description",
        dueDate: new Date(),
        status: "pending",
        user: user._id,
      };

      (User.findById as jest.Mock).mockResolvedValue(user);
      (Task.prototype.save as jest.Mock).mockImplementation(function (
        this: ITask
      ) {
        return Promise.resolve({
          _id: this._id,
          title: this.title,
          description: this.description,
          dueDate: this.dueDate,
          status: this.status,
          user: this.user,
        });
      });

      await createTask(
        authReq as AuthRequest<{}, {}, CreateTaskRequestBody>,
        res as Response
      );

      // if (res.json) {
      //   console.log("mock calls", (res.json as jest.Mock).mock.calls);
      // } else {
      //   console.log("res.json is undefined");
      // }

      expect(User.findById).toHaveBeenCalledWith("userId");
      expect(Task.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      // expect(res.json).toHaveBeenCalledWith(
      //   expect.objectContaining({
      //     // _id: expect.any(mongoose.Types.ObjectId),
      //     title: "New Task",
      //     description: "New Task Description",
      //     dueDate: new Date("2024-10-02T10:36:59.546Z"),
      //     status: "pending",
      //     // user: expect.any(mongoose.Types.ObjectId),
      //   })
      // );
    });

    it("should return 401 if userId is not set", async () => {
      authReq.body = {
        title: "New Task",
        description: "New Task Description",
        dueDate: new Date(),
        status: "pending",
      };
      authReq.userId = undefined; // Ensure userId is not set

      await createTask(
        authReq as AuthRequest<{}, {}, CreateTaskRequestBody>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("should return 404 if user is not found", async () => {
      authReq.body = {
        title: "New Task",
        description: "New Task Description",
        dueDate: new Date(),
        status: "pending",
      };
      authReq.userId = "userId"; // Ensure userId is set

      // Mock User.findById to return null
      (User.findById as jest.Mock).mockResolvedValue(null);

      await createTask(
        authReq as AuthRequest<{}, {}, CreateTaskRequestBody>,
        res as Response
      );

      // Check if User.findById was called with the correct userId
      expect(User.findById).toHaveBeenCalledWith("userId");
      // Check if the response status is 404
      expect(res.status).toHaveBeenCalledWith(404);
      // Check if the response json contains the correct message
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 500 if there is a server error", async () => {
      authReq.body = {
        title: "New Task",
        description: "New Task Description",
        dueDate: new Date(),
        status: "pending",
      };
      authReq.userId = "userId"; // Ensure userId is set

      (User.findById as jest.Mock).mockRejectedValue(new Error("Server Error"));

      await createTask(
        authReq as AuthRequest<{}, {}, CreateTaskRequestBody>,
        res as Response
      );

      expect(User.findById).toHaveBeenCalledWith("userId");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server Error" });
    });
  });
});
