process.env.JWT_SECRET = "testsecret";

import { Request, Response } from "express";
import AuthController from "../../controllers/authController";
import User from "../../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SignInRequestBody, SignUpRequestBody } from "../../types";
import dotenv from "dotenv";

dotenv.config();

jest.mock("../../models/user");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis() as unknown as (
        code: number
      ) => Response,
      json: jest.fn() as unknown as (body: any) => Response,
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("should create a new user successfully", async () => {
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (User.prototype.save as jest.Mock).mockResolvedValue({});

      await AuthController.signup(
        req as Request<{}, {}, SignUpRequestBody, {}>,
        res as Response
      );

      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ username: "testuser" }, { email: "test@example.com" }],
      });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", "salt");
      expect(User.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User created successfully",
      });
    });

    it("should return 400 if user already exists", async () => {
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockResolvedValue({});

      await AuthController.signup(
        req as Request<{}, {}, SignUpRequestBody, {}>,
        res as Response
      );

      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ username: "testuser" }, { email: "test@example.com" }],
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username or email already exists",
      });
    });

    it("should return 500 if there is a server error", async () => {
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockRejectedValue(new Error("Server error"));

      await AuthController.signup(
        req as Request<{}, {}, SignUpRequestBody, {}>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("signin", () => {
    it("should sign in successfully", async () => {
      req.body = { username: "testuser", password: "password123" };

      const user = {
        _id: "userId",
        username: "testuser",
        password: "hashedPassword",
      };
      (User.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token");

      await AuthController.signin(
        req as Request<{}, {}, SignInRequestBody, {}>,
        res as Response
      );

      expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedPassword"
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: "userId" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      expect(res.json).toHaveBeenCalledWith({ token: "token" });
    });

    it("should return 400 if user is not found", async () => {
      req.body = { username: "testuser", password: "password123" };

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await AuthController.signin(
        req as Request<{}, {}, SignInRequestBody, {}>,
        res as Response
      );

      expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it("should return 400 if password does not match", async () => {
      req.body = { username: "testuser", password: "password123" };

      const user = {
        _id: "userId",
        username: "testuser",
        password: "hashedPassword",
      };
      (User.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await AuthController.signin(
        req as Request<{}, {}, SignInRequestBody, {}>,
        res as Response
      );

      expect(User.findOne).toHaveBeenCalledWith({ username: "testuser" });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedPassword"
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it("should return 500 if there is a server error", async () => {
      req.body = { username: "testuser", password: "password123" };

      (User.findOne as jest.Mock).mockRejectedValue(new Error("Server error"));

      await AuthController.signin(
        req as Request<{}, {}, SignInRequestBody, {}>,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("logout", () => {
    it("should return 200 with a message", async () => {
      await AuthController.logout(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Implement logout in the React Client",
      });
    });
  });
});
