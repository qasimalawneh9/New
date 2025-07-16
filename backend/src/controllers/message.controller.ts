import { Request, Response } from "express";

export const getConversations = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: [] });
};

export const getConversation = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: { messages: [] } });
};

export const sendMessage = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Message sent" });
};

export const markAsRead = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ success: true, message: "Message marked as read" });
};

export const deleteMessage = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Message deleted" });
};

export const searchMessages = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: [] });
};

export const blockUser = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "User blocked" });
};

export const unblockUser = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "User unblocked" });
};

export const reportMessage = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Message reported" });
};
