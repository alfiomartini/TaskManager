process.env.JWT_SECRET = "testsecret";
import request from "supertest";
import express, { NextFunction } from "express";
import router from "../../routes";
import authController from "../../controllers/authController";
import * as taskController from "../../controllers/taskController";
import { authenticate } from "../../middleware";
import { AuthRequest } from "../../types";

jest.mock("../../controllers/authController");
jest.mock("../../controllers/taskController");
jest.mock("../../middleware", () => ({
  authenticate: (req: AuthRequest, res: Response, next: NextFunction) => next(),
}));

describe("router", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api", router);
  });

  test("should use authRoutes for /api/auth/signin path", async () => {
    (authController.signin as jest.Mock).mockImplementation((req, res) => {
      res.status(200).json({ message: "Auth route works" });
    });

    const response = await request(app).post("/api/auth/signin");
    console.log(response.status, response.body); // Debugging log
    expect(response.status).not.toBe(404); // Assuming authRoutes handles the route
    expect(response.body).toEqual({ message: "Auth route works" });
  });

  test("should use taskRoutes for /api/tasks/list path", async () => {
    (taskController.getTasks as jest.Mock).mockImplementation((req, res) => {
      res.status(200).json({ message: "Task route works" });
    });

    const response = await request(app).get("/api/tasks/list");
    console.log(response.status, response.body); // Debugging log
    expect(response.status).not.toBe(404); // Assuming taskRoutes handles the route
    expect(response.body).toEqual({ message: "Task route works" });
  });
});
