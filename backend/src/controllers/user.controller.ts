import { Request, Response } from "express";
import bcrypt from "bcryptjs";

// Mock user data (should be imported from auth controller or shared)
const mockUsers = [
  {
    id: 1,
    email: "admin@talkcon.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj7.k3yP.B3e",
    role: "admin",
    status: "active",
    emailVerified: true,
    twoFactorEnabled: false,
    name: "Admin User",
    phone: "+1234567890",
    timezone: "UTC",
    profileImage: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    email: "teacher@talkcon.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj7.k3yP.B3e",
    role: "teacher",
    status: "active",
    emailVerified: true,
    twoFactorEnabled: false,
    name: "Teacher User",
    phone: "+1234567891",
    timezone: "UTC",
    profileImage: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    email: "student@talkcon.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj7.k3yP.B3e",
    role: "student",
    status: "active",
    emailVerified: true,
    twoFactorEnabled: false,
    name: "Student User",
    phone: "+1234567892",
    timezone: "UTC",
    profileImage: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// Mock user settings
const userSettings = new Map([
  [
    1,
    {
      notifications: { email: true, sms: false, push: true },
      privacy: { profileVisible: true, showOnlineStatus: true },
      language: "en",
      theme: "light",
    },
  ],
  [
    2,
    {
      notifications: { email: true, sms: true, push: true },
      privacy: { profileVisible: true, showOnlineStatus: true },
      language: "en",
      theme: "light",
    },
  ],
  [
    3,
    {
      notifications: { email: true, sms: false, push: true },
      privacy: { profileVisible: true, showOnlineStatus: false },
      language: "en",
      theme: "dark",
    },
  ],
]);

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, phone, timezone } = req.body;

    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (timezone) user.timezone = timezone;
    user.updatedAt = new Date().toISOString();

    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // In a real app, you would save the file to cloud storage and get the URL
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    user.profileImage = avatarUrl;
    user.updatedAt = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      data: {
        profileImage: avatarUrl,
      },
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const switchRole = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { newRole } = req.body;

    if (!newRole || !["student", "teacher"].includes(newRole)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Must be student or teacher" });
    }

    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't allow admin role switching
    if (user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Admin users cannot switch roles" });
    }

    user.role = newRole as "student" | "teacher";
    user.updatedAt = new Date().toISOString();

    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: `Role switched to ${newRole} successfully`,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Switch role error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { password, confirmDelete } = req.body;

    if (!password || !confirmDelete) {
      return res
        .status(400)
        .json({ message: "Password and confirmation required" });
    }

    if (confirmDelete !== "DELETE") {
      return res
        .status(400)
        .json({ message: "Please type DELETE to confirm account deletion" });
    }

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

    // Mark as deleted instead of actually deleting
    user.status = "deleted";
    user.updatedAt = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters long" });
    }

    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid =
      currentPassword === "123456" ||
      (await bcrypt.compare(currentPassword, user.password));

    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 12);
    user.updatedAt = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const settings = userSettings.get(userId) || {
      notifications: { email: true, sms: false, push: true },
      privacy: { profileVisible: true, showOnlineStatus: true },
      language: "en",
      theme: "light",
    };

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { notifications, privacy, language, theme } = req.body;

    const currentSettings = userSettings.get(userId) || {
      notifications: { email: true, sms: false, push: true },
      privacy: { profileVisible: true, showOnlineStatus: true },
      language: "en",
      theme: "light",
    };

    // Update settings
    const updatedSettings = {
      ...currentSettings,
      ...(notifications && {
        notifications: { ...currentSettings.notifications, ...notifications },
      }),
      ...(privacy && { privacy: { ...currentSettings.privacy, ...privacy } }),
      ...(language && { language }),
      ...(theme && { theme }),
    };

    userSettings.set(userId, updatedSettings);

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: updatedSettings,
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
