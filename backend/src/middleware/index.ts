import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";
import { Response, NextFunction } from "express";

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Token has expired", expiredAt: error.expiredAt });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: "Invalid token", error: error.message });
    } else if (error instanceof jwt.NotBeforeError) {
      return res
        .status(401)
        .json({ message: "Token is not valid yet", error: error.message });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
