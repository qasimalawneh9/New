import { Request, Response } from "express";

export const joinLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    return res.status(200).json({
      success: true,
      data: {
        lessonId: id,
        meetingUrl: `https://zoom.us/j/123456789`,
        meetingId: "123456789",
        password: "lesson123",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const startLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    return res.status(200).json({
      success: true,
      message: "Lesson started successfully",
      data: { lessonId: id, status: "in_progress" },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const endLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    return res.status(200).json({
      success: true,
      message: "Lesson ended successfully",
      data: { lessonId: id, status: "completed" },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMeetingInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    return res.status(200).json({
      success: true,
      data: {
        lessonId: id,
        meetingUrl: `https://zoom.us/j/123456789`,
        meetingId: "123456789",
        platform: "zoom",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMeetingInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    return res.status(200).json({
      success: true,
      message: "Meeting info updated successfully",
      data: { lessonId: id, ...updates },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadMaterials = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const files = req.files;

    return res.status(200).json({
      success: true,
      message: "Materials uploaded successfully",
      data: {
        lessonId: id,
        filesUploaded: Array.isArray(files) ? files.length : 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMaterials = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    return res.status(200).json({
      success: true,
      data: {
        lessonId: id,
        materials: [
          { id: 1, name: "Lesson Notes.pdf", url: "/materials/lesson1.pdf" },
          {
            id: 2,
            name: "Exercise Sheet.docx",
            url: "/materials/exercise1.docx",
          },
        ],
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addNotes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    return res.status(200).json({
      success: true,
      message: "Notes added successfully",
      data: { lessonId: id, notes },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRecording = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    return res.status(200).json({
      success: true,
      data: {
        lessonId: id,
        recordingUrl: `https://recordings.talkcon.com/lesson-${id}.mp4`,
        available: true,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
