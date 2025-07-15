import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { db } from "../lib/database";

interface User {
  id: string;
  name: string;
  email: string;
  type: "student" | "teacher" | "admin";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean | string>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials
const ADMIN_EMAIL = "admin@talkcon.com";
const ADMIN_PASSWORD = "admin123";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Auto-login demo user for testing purposes
    const demoUser: User = {
      id: "demo-student",
      name: "Demo Student",
      email: "demo@student.com",
      type: "student",
      avatar: "/placeholder.svg",
    };
    setUser(demoUser);
    localStorage.setItem("talkcon_user", JSON.stringify(demoUser));
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check admin credentials
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser: User = {
          id: "admin",
          name: "Administrator",
          email: ADMIN_EMAIL,
          type: "admin",
          avatar: "/placeholder.svg",
        };
        setUser(adminUser);
        localStorage.setItem("talkcon_user", JSON.stringify(adminUser));
        return true;
      }

      // Check regular users
      const authenticatedUser = db.authenticateUser(email, password);
      if (authenticatedUser) {
        const user: User = {
          id: authenticatedUser.id,
          name: authenticatedUser.name,
          email: authenticatedUser.email,
          type: authenticatedUser.type,
          avatar: authenticatedUser.avatar,
        };
        setUser(user);
        localStorage.setItem("talkcon_user", JSON.stringify(user));
        return true;
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any): Promise<boolean | string> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (userData.userType === "teacher") {
        // Create basic teacher account first (pending status)
        const teacherUser = {
          name: `${userData.firstName} ${userData.lastName}`,
          avatar: "/placeholder.svg",
          email: userData.email,
          password: userData.password,
          type: "teacher" as const,
        };

        const newUser = db.createBasicTeacher(teacherUser);

        const user: User = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          type: "teacher",
          avatar: newUser.avatar,
        };

        setUser(user);
        localStorage.setItem("talkcon_user", JSON.stringify(user));
        return true;
      } else {
        // Create student
        const newUser = db.createUser({
          name: `${userData.firstName} ${userData.lastName}`,
          avatar: "/placeholder.svg",
          email: userData.email,
          learningLanguages: userData.learningLanguages || ["English"],
          nativeLanguage: userData.nativeLanguage || "English",
          level: {},
          joinedDate: new Date().toISOString(),
          password: userData.password,
        });

        const user: User = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          type: "student",
          avatar: newUser.avatar,
        };
        setUser(user);
        localStorage.setItem("talkcon_user", JSON.stringify(user));
        return true;
      }
    } catch (error: any) {
      return error.message || "Failed to create account";
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("talkcon_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
