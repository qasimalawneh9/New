import { Request, Response } from "express";

export const getTickets = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: [] });
};

export const createTicket = async (req: Request, res: Response) => {
  return res.status(201).json({ success: true, message: "Ticket created" });
};

export const getTicket = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: {} });
};

export const updateTicket = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Ticket updated" });
};

export const closeTicket = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Ticket closed" });
};

export const addMessage = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ success: true, message: "Message added to ticket" });
};

export const uploadAttachment = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ success: true, message: "Attachment uploaded" });
};

export const getFAQ = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: [] });
};

export const getCategories = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: [] });
};
