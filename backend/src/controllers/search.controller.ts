import { Request, Response } from "express";

export const searchTeachers = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: [] });
};

export const searchStudents = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: [] });
};

export const searchLessons = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: [] });
};

export const globalSearch = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: [] });
};

export const getSearchSuggestions = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: [] });
};

export const getSearchFilters = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: [] });
};
