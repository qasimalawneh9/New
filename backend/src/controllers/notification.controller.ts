import { Request, Response } from "express";

export const getNotifications = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: [] });
};

export const markAsRead = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ success: true, message: "Notification marked as read" });
};

export const markAllAsRead = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ success: true, message: "All notifications marked as read" });
};

export const deleteNotification = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ success: true, message: "Notification deleted" });
};

export const getNotificationSettings = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ success: true, data: { email: true, sms: false, push: true } });
};

export const updateNotificationSettings = async (
  req: Request,
  res: Response,
) => {
  return res
    .status(200)
    .json({ success: true, message: "Notification settings updated" });
};

export const sendTestNotification = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ success: true, message: "Test notification sent" });
};
