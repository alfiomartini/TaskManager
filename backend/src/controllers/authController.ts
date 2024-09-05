import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const jwtSecret = process.env.JWT_SECRET;

class AuthController {
  async signup(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create the user
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async signin(req: Request, res: Response) {
    console.log("Accessing signin route");
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create and sign JWT (replace 'your-secret-key' with your actual secret)
      const token = jwt.sign({ userId: user._id }, jwtSecret, {
        expiresIn: "1h",
      });

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // Logout (will depend on your JWT invalidation strategy)
  async logout(req: Request, res: Response) {
    // ... (Implementation for JWT logout)
    res.status(200).json({ message: "Implement logout in the React Client" });
  }
}

export default new AuthController();
