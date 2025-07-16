import { Request, Response } from "express";

// Mock data for student profiles and progress
const studentProfiles = new Map([
  [
    3,
    {
      id: 3,
      userId: 3,
      nativeLanguage: "English",
      targetLanguages: ["Spanish", "French"],
      learningGoals: ["conversation", "vocabulary", "grammar"],
      proficiencyLevel: "intermediate",
      hoursPerWeek: 5,
      preferredTeachingStyle: "interactive",
      interests: ["travel", "business", "culture"],
      timezone: "UTC",
      bio: "Passionate language learner looking to improve conversation skills",
    },
  ],
]);

const learningProgress = new Map([
  [
    3,
    {
      totalHours: 45,
      completedLessons: 18,
      currentStreak: 7,
      longestStreak: 12,
      vocabularyWordsLearned: 234,
      lessonsThisMonth: 8,
      hoursThisMonth: 20,
      achievements: [
        {
          id: 1,
          name: "First Lesson",
          description: "Completed your first lesson",
          earnedAt: "2024-01-15",
        },
        {
          id: 2,
          name: "Week Streak",
          description: "Maintained a 7-day learning streak",
          earnedAt: "2024-01-22",
        },
        {
          id: 3,
          name: "Vocabulary Builder",
          description: "Learned 200+ new words",
          earnedAt: "2024-02-01",
        },
      ],
      weeklyProgress: [
        { week: "2024-W1", hours: 3, lessons: 2 },
        { week: "2024-W2", hours: 5, lessons: 3 },
        { week: "2024-W3", hours: 4, lessons: 2 },
        { week: "2024-W4", hours: 6, lessons: 4 },
      ],
    },
  ],
]);

const learningGoals = new Map([
  [
    3,
    {
      currentGoals: [
        {
          id: 1,
          category: "conversation",
          title: "Have a 30-minute conversation in Spanish",
          description:
            "Be able to maintain a natural conversation for 30 minutes",
          targetDate: "2024-06-01",
          progress: 65,
          milestones: [
            {
              id: 1,
              title: "5-minute conversation",
              completed: true,
              completedAt: "2024-01-20",
            },
            {
              id: 2,
              title: "15-minute conversation",
              completed: true,
              completedAt: "2024-02-10",
            },
            {
              id: 3,
              title: "30-minute conversation",
              completed: false,
              completedAt: null,
            },
          ],
        },
        {
          id: 2,
          category: "vocabulary",
          title: "Learn 500 new Spanish words",
          description: "Expand vocabulary to 500 commonly used words",
          targetDate: "2024-05-01",
          progress: 46,
          milestones: [
            {
              id: 1,
              title: "100 words",
              completed: true,
              completedAt: "2024-01-15",
            },
            {
              id: 2,
              title: "250 words",
              completed: true,
              completedAt: "2024-02-01",
            },
            { id: 3, title: "500 words", completed: false, completedAt: null },
          ],
        },
      ],
    },
  ],
]);

const favoriteTeachers = new Map([
  [
    3,
    [
      {
        id: 2,
        name: "Teacher User",
        rating: 4.8,
        specialties: ["Conversation", "Grammar"],
        hourlyRate: 25,
        profileImage: null,
        lastLessonDate: "2024-02-15",
      },
    ],
  ],
]);

const completedLessons = new Map([
  [
    3,
    [
      {
        id: 1,
        teacherId: 2,
        teacherName: "Teacher User",
        subject: "Spanish Conversation",
        date: "2024-02-15T14:00:00Z",
        duration: 60,
        rating: 5,
        notes: "Great lesson focusing on past tense conjugations",
        materials: ["Grammar exercises", "Conversation prompts"],
      },
      {
        id: 2,
        teacherId: 2,
        teacherName: "Teacher User",
        subject: "Spanish Vocabulary",
        date: "2024-02-10T15:00:00Z",
        duration: 45,
        rating: 4,
        notes: "Learned new vocabulary related to travel",
        materials: ["Vocabulary list", "Practice exercises"],
      },
    ],
  ],
]);

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const profile = studentProfiles.get(userId);

    if (!profile) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Get student profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const updates = req.body;

    let profile = studentProfiles.get(userId);

    if (!profile) {
      // Create new profile if it doesn't exist
      profile = {
        id: userId,
        userId,
        nativeLanguage: "English",
        targetLanguages: [],
        learningGoals: [],
        proficiencyLevel: "beginner",
        hoursPerWeek: 2,
        preferredTeachingStyle: "structured",
        interests: [],
        timezone: "UTC",
        bio: "",
      };
    }

    // Update profile with provided data
    const updatedProfile = { ...profile, ...updates };
    studentProfiles.set(userId, updatedProfile);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Update student profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyTeachers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const teachers = favoriteTeachers.get(userId) || [];

    return res.status(200).json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    console.error("Get student teachers error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProgress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const progress = learningProgress.get(userId);

    if (!progress) {
      return res.status(404).json({ message: "Learning progress not found" });
    }

    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error("Get learning progress error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getLearningGoals = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const goals = learningGoals.get(userId);

    if (!goals) {
      return res.status(404).json({ message: "Learning goals not found" });
    }

    return res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    console.error("Get learning goals error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateLearningGoals = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { currentGoals } = req.body;

    if (!currentGoals || !Array.isArray(currentGoals)) {
      return res.status(400).json({ message: "Invalid learning goals format" });
    }

    const updatedGoals = { currentGoals };
    learningGoals.set(userId, updatedGoals);

    return res.status(200).json({
      success: true,
      message: "Learning goals updated successfully",
      data: updatedGoals,
    });
  } catch (error) {
    console.error("Update learning goals error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompletedLessons = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const lessons = completedLessons.get(userId) || [];

    const { page = 1, limit = 10, teacherId } = req.query;
    let filteredLessons = lessons;

    // Filter by teacher if specified
    if (teacherId) {
      filteredLessons = lessons.filter(
        (lesson) => lesson.teacherId === parseInt(teacherId as string),
      );
    }

    // Pagination
    const startIndex =
      (parseInt(page as string) - 1) * parseInt(limit as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedLessons = filteredLessons.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      data: paginatedLessons,
      meta: {
        currentPage: parseInt(page as string),
        perPage: parseInt(limit as string),
        total: filteredLessons.length,
        lastPage: Math.ceil(filteredLessons.length / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error("Get completed lessons error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
