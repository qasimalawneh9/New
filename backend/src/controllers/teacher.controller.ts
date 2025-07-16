import { Request, Response } from "express";

// Mock teacher data
const mockTeachers = [
  {
    id: 2,
    userId: 2,
    name: "Teacher User",
    email: "teacher@talkcon.com",
    specialties: ["Spanish", "French"],
    experience: 5,
    hourlyRate: 25,
    rating: 4.8,
    totalReviews: 67,
    totalLessons: 156,
    profileImage: null,
    introVideo: null,
    bio: "Experienced language teacher with 5 years of teaching experience",
    languages: ["English", "Spanish", "French"],
    certifications: ["TEFL", "DELE"],
    availability: {
      monday: [{ start: "09:00", end: "17:00" }],
      tuesday: [{ start: "09:00", end: "17:00" }],
      wednesday: [{ start: "09:00", end: "17:00" }],
      thursday: [{ start: "09:00", end: "17:00" }],
      friday: [{ start: "09:00", end: "17:00" }],
      saturday: [],
      sunday: [],
    },
    status: "active",
    joinDate: "2024-01-05",
    lastLogin: "2024-02-15T14:20:00Z",
  },
];

const teacherEarnings = new Map([
  [
    2,
    {
      thisMonth: 1250,
      lastMonth: 980,
      total: 15600,
      pending: 125,
      available: 1125,
      breakdown: [
        { date: "2024-02-15", amount: 50, lessonId: 1 },
        { date: "2024-02-14", amount: 75, lessonId: 2 },
      ],
    },
  ],
]);

const teacherStudents = new Map([
  [
    2,
    [
      {
        id: 3,
        name: "Student User",
        totalLessons: 23,
        rating: 4.9,
        lastLesson: "2024-02-15T14:00:00Z",
        status: "active",
      },
    ],
  ],
]);

export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      language,
      specialty,
      minRating,
      maxRate,
    } = req.query;

    let filteredTeachers = [...mockTeachers];

    // Filter by language
    if (language) {
      filteredTeachers = filteredTeachers.filter((teacher) =>
        teacher.languages.includes(language as string),
      );
    }

    // Filter by specialty
    if (specialty) {
      filteredTeachers = filteredTeachers.filter((teacher) =>
        teacher.specialties.includes(specialty as string),
      );
    }

    // Filter by minimum rating
    if (minRating) {
      filteredTeachers = filteredTeachers.filter(
        (teacher) => teacher.rating >= parseFloat(minRating as string),
      );
    }

    // Filter by maximum hourly rate
    if (maxRate) {
      filteredTeachers = filteredTeachers.filter(
        (teacher) => teacher.hourlyRate <= parseFloat(maxRate as string),
      );
    }

    // Pagination
    const startIndex =
      (parseInt(page as string) - 1) * parseInt(limit as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedTeachers = filteredTeachers.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      data: paginatedTeachers,
      meta: {
        currentPage: parseInt(page as string),
        perPage: parseInt(limit as string),
        total: filteredTeachers.length,
        lastPage: Math.ceil(
          filteredTeachers.length / parseInt(limit as string),
        ),
      },
    });
  } catch (error) {
    console.error("Get all teachers error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacher = mockTeachers.find((t) => t.id === parseInt(id));

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    return res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    console.error("Get teacher error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const searchTeachers = async (req: Request, res: Response) => {
  try {
    const { q, language, specialty, availability, rating } = req.query;

    let results = [...mockTeachers];

    // Text search
    if (q) {
      const searchTerm = (q as string).toLowerCase();
      results = results.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchTerm) ||
          teacher.bio.toLowerCase().includes(searchTerm) ||
          teacher.specialties.some((s) => s.toLowerCase().includes(searchTerm)),
      );
    }

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Search teachers error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacher = mockTeachers.find((t) => t.id === parseInt(id));

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    return res.status(200).json({
      success: true,
      data: teacher.availability,
    });
  } catch (error) {
    console.error("Get teacher availability error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { availability } = req.body;

    const teacher = mockTeachers.find((t) => t.userId === userId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher profile not found" });
    }

    teacher.availability = availability;

    return res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: teacher.availability,
    });
  } catch (error) {
    console.error("Update availability error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const teacher = mockTeachers.find((t) => t.userId === userId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher profile not found" });
    }

    return res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    console.error("Get teacher profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const updates = req.body;

    const teacher = mockTeachers.find((t) => t.userId === userId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher profile not found" });
    }

    // Update teacher profile
    Object.assign(teacher, updates);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Update teacher profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadIntroVideo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const teacher = mockTeachers.find((t) => t.userId === userId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher profile not found" });
    }

    const videoUrl = `/uploads/videos/${file.filename}`;
    teacher.introVideo = videoUrl;

    return res.status(200).json({
      success: true,
      message: "Intro video uploaded successfully",
      data: { introVideo: videoUrl },
    });
  } catch (error) {
    console.error("Upload intro video error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getEarnings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const teacher = mockTeachers.find((t) => t.userId === userId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher profile not found" });
    }

    const earnings = teacherEarnings.get(teacher.id);

    if (!earnings) {
      return res.status(404).json({ message: "Earnings data not found" });
    }

    return res.status(200).json({
      success: true,
      data: earnings,
    });
  } catch (error) {
    console.error("Get teacher earnings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Mock reviews for teacher
    const reviews = [
      {
        id: 1,
        studentName: "Student User",
        rating: 5,
        comment: "Excellent teacher!",
        createdAt: "2024-02-15T14:00:00Z",
      },
    ];

    return res.status(200).json({
      success: true,
      data: reviews,
      meta: {
        currentPage: parseInt(page as string),
        perPage: parseInt(limit as string),
        total: reviews.length,
        lastPage: Math.ceil(reviews.length / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error("Get teacher reviews error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyStudents = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const teacher = mockTeachers.find((t) => t.userId === userId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher profile not found" });
    }

    const students = teacherStudents.get(teacher.id) || [];

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Get teacher students error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCalendar = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { date } = req.query;

    // Mock calendar data
    const calendar = [
      {
        id: 1,
        studentName: "Student User",
        subject: "Spanish Conversation",
        startTime: "2024-02-20T14:00:00Z",
        endTime: "2024-02-20T15:00:00Z",
        status: "confirmed",
      },
    ];

    return res.status(200).json({
      success: true,
      data: calendar,
    });
  } catch (error) {
    console.error("Get teacher calendar error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const teacher = mockTeachers.find((t) => t.userId === userId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher profile not found" });
    }

    const stats = {
      totalLessons: teacher.totalLessons,
      totalStudents: 18,
      averageRating: teacher.rating,
      totalEarnings: 15600,
      thisMonthLessons: 45,
      thisMonthEarnings: 1250,
      completionRate: 93.8,
      responseRate: 95,
      onTimeRate: 98,
    };

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get teacher stats error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
