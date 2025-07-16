import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Mock user data for development
const mockUsers = [
  {
    id: 1,
    email: "admin@talkcon.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj7.k3yP.B3e", // password: 123456
    role: "admin",
    status: "active",
    emailVerified: true,
    twoFactorEnabled: false,
    name: "Admin User",
  },
  {
    id: 2,
    email: "teacher@talkcon.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj7.k3yP.B3e", // password: 123456
    role: "teacher",
    status: "active",
    emailVerified: true,
    twoFactorEnabled: false,
    name: "Teacher User",
  },
  {
    id: 3,
    email: "student@talkcon.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj7.k3yP.B3e", // password: 123456
    role: "student",
    status: "active",
    emailVerified: true,
    twoFactorEnabled: false,
    name: "Student User",
  },
];

// Mock storage for password reset tokens and email verification
const passwordResetTokens = new Map();
const emailVerificationTokens = new Map();
const twoFactorSecrets = new Map();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, twoFactorCode } = req.body;

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

    // Check if account is locked or suspended
    if (user.status !== "active") {
      return res.status(401).json({ message: "Account is not active" });
    }

    // For development, also allow plain text "123456"
    const isPasswordValid =
      password === "123456" || (await bcrypt.compare(password, user.password));

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check 2FA if enabled
    if (user.twoFactorEnabled && !twoFactorCode) {
      return res.status(200).json({
        requiresTwoFactor: true,
        message: "Two-factor authentication required",
      });
    }

    if (user.twoFactorEnabled && twoFactorCode) {
      // Mock 2FA verification - in real app, use TOTP library
      if (twoFactorCode !== "123456") {
        return res.status(401).json({ message: "Invalid two-factor code" });
      }
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
        name: user.name,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role = "student" } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email, password, and name are required" });
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
      name,
      password: await bcrypt.hash(password, 12),
      role: role as "student" | "teacher" | "admin",
      status: "pending_verification",
      emailVerified: false,
      twoFactorEnabled: false,
    };

    mockUsers.push(newUser);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    emailVerificationTokens.set(verificationToken, {
      userId: newUser.id,
      email: newUser.email,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    return res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
      user: {
        id: newUser.id.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status,
        emailVerified: newUser.emailVerified,
      },
      verificationToken, // In real app, this would be sent via email
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "Logged out successfully" });
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET || "secret",
    ) as any;
    const user = mockUsers.find((u) => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const newToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" },
    );

    return res.status(200).json({ token: newToken });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      // Don't reveal if email exists or not
      return res.status(200).json({
        message: "If the email exists, a password reset link has been sent",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    passwordResetTokens.set(resetToken, {
      userId: user.id,
      email: user.email,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    return res.status(200).json({
      message: "Password reset link has been sent to your email",
      resetToken, // In real app, this would be sent via email
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    const resetData = passwordResetTokens.get(token);

    if (!resetData || new Date() > resetData.expiresAt) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const user = mockUsers.find((u) => u.id === resetData.userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 12);
    passwordResetTokens.delete(token);

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is required" });
    }

    const verificationData = emailVerificationTokens.get(token);

    if (!verificationData || new Date() > verificationData.expiresAt) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    const user = mockUsers.find((u) => u.id === verificationData.userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update user as verified
    user.emailVerified = true;
    user.status = "active";
    emailVerificationTokens.delete(token);

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    emailVerificationTokens.set(verificationToken, {
      userId: user.id,
      email: user.email,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    return res.status(200).json({
      message: "Verification email sent",
      verificationToken, // In real app, this would be sent via email
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const enable2FA = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate mock secret (in real app, use speakeasy or similar)
    const secret = crypto.randomBytes(16).toString("hex");
    twoFactorSecrets.set(userId, secret);

    return res.status(200).json({
      message: "Two-factor authentication setup initiated",
      secret,
      qrCode: `otpauth://totp/TalkCon:${user.email}?secret=${secret}&issuer=TalkCon`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const disable2FA = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { password } = req.body;

    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isPasswordValid =
      password === "123456" || (await bcrypt.compare(password, user.password));

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    user.twoFactorEnabled = false;
    twoFactorSecrets.delete(userId);

    return res
      .status(200)
      .json({ message: "Two-factor authentication disabled" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verify2FA = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Mock verification - in real app, verify TOTP code
    if (code === "123456") {
      user.twoFactorEnabled = true;
      return res
        .status(200)
        .json({ message: "Two-factor authentication enabled successfully" });
    } else {
      return res.status(400).json({ message: "Invalid verification code" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
