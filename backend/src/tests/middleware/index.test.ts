// backend/src/middleware/index.test.ts
import { authenticate } from "../../middleware";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../../types";
import { Response, NextFunction } from "express";

jest.mock("jsonwebtoken");

describe("authenticate middleware", () => {
  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("should return 401 if no token is provided", () => {
    (req.header as jest.Mock).mockReturnValue(null);

    authenticate(req as AuthRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication required",
    });
  });

  test("should return 401 if token is expired", () => {
    const expiredError = new jwt.TokenExpiredError("jwt expired", new Date());
    (req.header as jest.Mock).mockReturnValue("Bearer token");
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw expiredError;
    });

    authenticate(req as AuthRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Token has expired",
      expiredAt: expiredError.expiredAt,
    });
  });

  test("should return 401 if token is invalid", () => {
    const invalidError = new jwt.JsonWebTokenError("invalid token");
    (req.header as jest.Mock).mockReturnValue("Bearer token");
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw invalidError;
    });

    authenticate(req as AuthRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid token",
      error: invalidError.message,
    });
  });

  test("should return 401 if token is not valid yet", () => {
    const notBeforeError = new jwt.NotBeforeError("jwt not active", new Date());
    (req.header as jest.Mock).mockReturnValue("Bearer token");
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw notBeforeError;
    });

    authenticate(req as AuthRequest, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Token is not valid yet",
      error: notBeforeError.message,
    });
  });

  test("should call next if token is valid", () => {
    const decodedToken = { userId: "123" };
    (req.header as jest.Mock).mockReturnValue("Bearer token");
    (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

    authenticate(req as AuthRequest, res as Response, next);

    expect(req.userId).toBe(decodedToken.userId);
    expect(next).toHaveBeenCalled();
  });
});
