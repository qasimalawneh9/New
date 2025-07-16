import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "../api/config";
import { db } from "../lib/database";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (newRole: "student" | "teacher" | "admin") => Promise<boolean>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from stored user
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("talkcon_user");
        const authToken = localStorage.getItem("auth_token");

        if (storedUser && authToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Failed to initialize auth:", err);
        // Clear invalid data
        localStorage.removeItem("talkcon_user");
        localStorage.removeItem("auth_token");
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Use local database for authentication (demo mode)
      const authResult = db.authenticateUser(email, password);

      if (authResult) {
        const { user: userData, type } = authResult;

        // Store user data
        setUser(userData);
        setIsAuthenticated(true);

        // Store in localStorage for persistence
        localStorage.setItem("talkcon_user", JSON.stringify(userData));
        localStorage.setItem("auth_token", `demo_token_${Date.now()}`);

        return true;
      } else {
        setError("Invalid email or password");
        return false;
      }
    } catch (err: any) {
      const errorMessage =
        err?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Create user in local database
      const success = db.createUser({
        ...userData,
        password: userData.password,
        status: "active",
        walletBalance: 0,
      });

      if (success) {
        // Auto-login after registration
        return await login(userData.email, userData.password);
      }

      return false;
    } catch (err: any) {
      const errorMessage =
        err?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);

    try {
      // Clear local auth state
      localStorage.removeItem("talkcon_user");
      localStorage.removeItem("auth_token");
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      console.warn("Logout cleanup failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = async (
    newRole: "student" | "teacher" | "admin",
  ): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    setError(null);

    try {
      // Update the local user state
      const updatedUser = { ...user, role: newRole, type: newRole };
      setUser(updatedUser);

      // Update localStorage
      localStorage.setItem("talkcon_user", JSON.stringify(updatedUser));

      return true;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to switch role";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      const storedUser = localStorage.getItem("talkcon_user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);

        // Refresh from database if available
        const dbUser = db.getUserByEmail(userData.email);
        if (dbUser) {
          setUser(dbUser);
          localStorage.setItem("talkcon_user", JSON.stringify(dbUser));
        }
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
      // If refresh fails, logout user
      await logout();
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        switchRole,
        refreshUser,
        isLoading,
        error,
        clearError,
        isAuthenticated,
      }}
    >
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
