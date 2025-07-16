// Authentication methods for demo login
  authenticateUser(email: string, password: string): { user: any; type: 'student' | 'teacher' | 'admin' } | null {
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
        type: "admin"
      };
    }

    // Check students
    const student = this.data.users.find(u => u.email === email && u.password === password);
    if (student) {
      const { password: _, ...userWithoutPassword } = student;
      return {
        user: { ...userWithoutPassword, type: "student", role: "student" },
        type: "student"
      };
    }

    // Check teachers  
    const teacher = this.data.teachers.find(t => t.email === email && t.password === password);
    if (teacher) {
      const { password: _, ...userWithoutPassword } = teacher;
      return {
        user: { ...userWithoutPassword, type: "teacher", role: "teacher" },
        type: "teacher"
      };
    }

    return null;
  }

  getUserByEmail(email: string): any | null {
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
    const student = this.data.users.find(u => u.email === email);
    if (student) {
      const { password: _, ...userWithoutPassword } = student;
      return { ...userWithoutPassword, type: "student", role: "student" };
    }

    // Check teachers
    const teacher = this.data.teachers.find(t => t.email === email);
    if (teacher) {
      const { password: _, ...userWithoutPassword } = teacher;
      return { ...userWithoutPassword, type: "teacher", role: "teacher" };
    }

    return null;
  }