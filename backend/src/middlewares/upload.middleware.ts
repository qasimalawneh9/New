import multer from "multer";
import path from "path";
import { Request } from "express";

// Configure storage
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    let uploadPath = "uploads/";

    // Determine upload path based on fieldname
    switch (file.fieldname) {
      case "avatar":
        uploadPath += "avatars/";
        break;
      case "video":
        uploadPath += "videos/";
        break;
      case "materials":
        uploadPath += "materials/";
        break;
      case "documents":
        uploadPath += "documents/";
        break;
      case "certificates":
        uploadPath += "certificates/";
        break;
      case "attachments":
        uploadPath += "attachments/";
        break;
      default:
        uploadPath += "misc/";
    }

    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, extension);

    cb(null, `${nameWithoutExt}-${uniqueSuffix}${extension}`);
  },
});

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  const allowedMimes: { [key: string]: string[] } = {
    avatar: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    video: ["video/mp4", "video/webm", "video/quicktime"],
    materials: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    documents: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    certificates: ["application/pdf", "image/jpeg", "image/png"],
    attachments: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ],
  };

  const allowed = allowedMimes[file.fieldname] || allowedMimes.attachments;

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type for ${file.fieldname}. Allowed types: ${allowed.join(", ")}`,
      ),
    );
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5, // Maximum 5 files per upload
  },
});

// Error handling middleware for multer errors
export const handleUploadError = (
  error: any,
  req: Request,
  res: any,
  next: any,
) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Maximum size is 10MB." });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res
        .status(400)
        .json({ message: "Too many files. Maximum is 5 files per upload." });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res
        .status(400)
        .json({ message: "Unexpected field name for file upload." });
    }
  }

  if (error.message.includes("Invalid file type")) {
    return res.status(400).json({ message: error.message });
  }

  next(error);
};
