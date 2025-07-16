import { Request, Response } from "express";

export const getAllReviews = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: [] });
};

export const createReview = async (req: Request, res: Response) => {
  return res.status(201).json({ success: true, message: "Review created" });
};

export const getReview = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: {} });
};

export const updateReview = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Review updated" });
};

export const deleteReview = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Review deleted" });
};

export const getTeacherReviews = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: [] });
};

export const getMyReviews = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, data: [] });
};

export const replyToReview = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Reply added" });
};

export const likeReview = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Review liked" });
};

export const reportReview = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Review reported" });
};

export const getReviewStats = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ success: true, data: { average: 4.8, total: 123 } });
};
