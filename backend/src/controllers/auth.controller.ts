import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Mock user data for development
const mockUsers = [
  {
    id: 1,
    email: "admin@talkcon.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj7.k3yP.B3e", // password: 123456
    role: "admin",
    status: "active",
  },
  {
    id: 2,
    email: "teacher@talkcon.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj7.k3yP.B3e", // password: 123456
    role: "teacher",
    status: "active",
  },
  {
    id: 3,
    email: "student@talkcon.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj7.k3yP.B3e", // password: 123456
    role: "student",
    status: "active",
  },
];

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user in mock data
    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // For development, also allow plain text "123456"
    const isPasswordValid =
      password === "123456" || (await bcrypt.compare(password, user.password));

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id.toString(),
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role = "student" } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user already exists in mock data
    const existingUser = mockUsers.find((u) => u.email === email);

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create mock user
    const newUser = {
      id: mockUsers.length + 1,
      email,
      password: await bcrypt.hash(password, 12),
      role: role as "student" | "teacher" | "admin",
      status: "active",
    };

    mockUsers.push(newUser);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id.toString(),
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "Logged out successfully" });
};
