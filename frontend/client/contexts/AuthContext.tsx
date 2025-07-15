import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  authService,
  LoginCredentials,
  RegisterData,
} from "../api/services/auth.service";
import { User } from "../api/config";
import { setAuthToken, removeAuthToken, getAuthToken } from "../api/config";
import { LoginForm, RegisterForm } from "../types/platform";

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginForm) => Promise<boolean>;
  register: (userData: RegisterForm) => Promise<boolean>;
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

  // Initialize auth state from stored token
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          setIsLoading(true);
          await refreshUser();
        } catch (err) {
          // Token is invalid, remove it
          removeAuthToken();
          setUser(null);
          setIsAuthenticated(false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginForm): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const loginData: LoginCredentials = {
        email: credentials.email,
        password: credentials.password,
      };

      const response = await authService.login(loginData);

      if (response.token && response.user) {
        // Store the token
        setAuthToken(response.token, credentials.rememberMe);

        // Set user data
        setUser(response.user);
        setIsAuthenticated(true);

        return true;
      }

      return false;
    } catch (err: any) {
      const errorMessage =
        err?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterForm): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const registerData: RegisterData = {
        email: userData.email,
        password: userData.password,
        role: userData.role,
      };

      const response = await authService.register(registerData);

      if (response.user) {
        // For successful registration, auto-login the user
        const loginSuccess = await login({
          email: userData.email,
          password: userData.password,
          rememberMe: false,
        });

        return loginSuccess;
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
      // Call backend logout endpoint
      await authService.logout();
    } catch (err) {
      // Even if logout fails on backend, clear local state
      console.warn("Logout request failed:", err);
    } finally {
      // Clear local auth state
      removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
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
      // For now, just update the local user state
      // In a real implementation, this would call a backend endpoint
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
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
    if (!getAuthToken()) return;

    try {
      const response = await authService.getProfile();
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      // If profile fetch fails, user is likely not authenticated
      removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
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
