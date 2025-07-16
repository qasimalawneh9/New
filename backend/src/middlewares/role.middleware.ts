import { Request, Response, NextFunction } from "express";

export const requireRole = (requiredRole: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role(s): ${roles.join(", ")}. Your role: ${user.role}`,
      });
    }

    next();
  };
};

export const requireTeacherOrAdmin = requireRole(["teacher", "admin"]);
export const requireStudentOrAdmin = requireRole(["student", "admin"]);
export const requireAdmin = requireRole("admin");
export const requireTeacher = requireRole("teacher");
export const requireStudent = requireRole("student");
