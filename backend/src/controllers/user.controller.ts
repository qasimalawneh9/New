import { Request, Response } from "express";

export const getCurrentUser = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  return res.status(200).json({ user: req.user });
};
