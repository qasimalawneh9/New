import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret",
    ) as any;

    // Fetch fresh user data from database
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.status !== "active") {
      return res.status(401).json({ message: "Account is not active" });
    }

    // Add user to request object
    req.user = {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
};
