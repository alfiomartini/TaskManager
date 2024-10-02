process.env.JWT_SECRET = "testsecret";
import request from "supertest";
import express from "express";
import authRouter from "../../routes/auth";
import authController from "../../controllers/authController";

jest.mock("../../controllers/authController");

const app = express();
app.use(express.json());
app.use("/auth", authRouter);

describe("Auth Routes", () => {
  describe("POST /auth/signin", () => {
    it("should call signin controller and return 200", async () => {
      (authController.signin as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({ message: "Signed in successfully" });
      });

      const response = await request(app)
        .post("/auth/signin")
        .send({ username: "testuser", password: "password123" });

      expect(authController.signin).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Signed in successfully" });
    });

    it("should return 400 if signin fails", async () => {
      (authController.signin as jest.Mock).mockImplementation((req, res) => {
        res.status(400).json({ message: "Invalid credentials" });
      });

      const response = await request(app)
        .post("/auth/signin")
        .send({ username: "testuser", password: "wrongpassword" });

      expect(authController.signin).toHaveBeenCalled();
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Invalid credentials" });
    });
  });

  describe("POST /auth/signup", () => {
    it("should call signup controller and return 201", async () => {
      (authController.signup as jest.Mock).mockImplementation((req, res) => {
        res.status(201).json({ message: "User created successfully" });
      });

      const response = await request(app).post("/auth/signup").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(authController.signup).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: "User created successfully" });
    });

    it("should return 400 if signup fails", async () => {
      (authController.signup as jest.Mock).mockImplementation((req, res) => {
        res.status(400).json({ message: "Username or email already exists" });
      });

      const response = await request(app).post("/auth/signup").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(authController.signup).toHaveBeenCalled();
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Username or email already exists",
      });
    });
  });

  describe("POST /auth/logout", () => {
    it("should call logout controller and return 200", async () => {
      (authController.logout as jest.Mock).mockImplementation((req, res) => {
        res
          .status(200)
          .json({ message: "Implement logout in the React Client" });
      });

      const response = await request(app).post("/auth/logout");

      expect(authController.logout).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Implement logout in the React Client",
      });
    });
  });
});
