import { Request, Response } from "express";

export const uploadAvatar = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json({
      success: true,
      message: "Avatar uploaded",
      url: "/uploads/avatar.jpg",
    });
};

export const uploadDocuments = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Documents uploaded" });
};

export const uploadMaterials = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Materials uploaded" });
};

export const uploadIntroVideo = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Video uploaded" });
};

export const uploadCertificates = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ success: true, message: "Certificates uploaded" });
};

export const uploadAttachments = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ success: true, message: "Attachments uploaded" });
};
