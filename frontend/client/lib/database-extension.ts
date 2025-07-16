import { db } from "./database";

// Extend the database with authentication methods
(db as any).authenticateUser = function (
  email: string,
  password: string,
): { user: any; type: "student" | "teacher" | "admin" } | null {
  // Check for admin login
  if (email === "admin@talkcon.com" && password === "admin123") {
    return {
      user: {
        id: "admin_user",
        name: "Admin User",
        email: "admin@talkcon.com",
        type: "admin",
        role: "admin",
        avatar: "/placeholder.svg",
        createdAt: new Date().toISOString(),
      },
      type: "admin",
    };
  }

  // Check students
  const student = (this as any).data.users.find(
    (u: any) => u.email === email && u.password === password,
  );
  if (student) {
    const { password: _, ...userWithoutPassword } = student;
    return {
      user: { ...userWithoutPassword, type: "student", role: "student" },
      type: "student",
    };
  }

  // Check teachers
  const teacher = (this as any).data.teachers.find(
    (t: any) => t.email === email && t.password === password,
  );
  if (teacher) {
    const { password: _, ...userWithoutPassword } = teacher;
    return {
      user: { ...userWithoutPassword, type: "teacher", role: "teacher" },
      type: "teacher",
    };
  }

  return null;
};

(db as any).getUserByEmail = function (email: string): any | null {
  // Check admin
  if (email === "admin@talkcon.com") {
    return {
      id: "admin_user",
      name: "Admin User",
      email: "admin@talkcon.com",
      type: "admin",
      role: "admin",
      avatar: "/placeholder.svg",
      createdAt: new Date().toISOString(),
    };
  }

  // Check students
  const student = (this as any).data.users.find((u: any) => u.email === email);
  if (student) {
    const { password: _, ...userWithoutPassword } = student;
    return { ...userWithoutPassword, type: "student", role: "student" };
  }

  // Check teachers
  const teacher = (this as any).data.teachers.find(
    (t: any) => t.email === email,
  );
  if (teacher) {
    const { password: _, ...userWithoutPassword } = teacher;
    return { ...userWithoutPassword, type: "teacher", role: "teacher" };
  }

  return null;
};

export { db };
