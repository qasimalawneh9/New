import { RequestHandler } from "express";
import { Teacher, TeachersResponse, SearchFilters } from "@shared/api";

// Mock database of teachers
const mockTeachers: Teacher[] = [
  {
    id: "1",
    name: "Maria Rodriguez",
    avatar: "/placeholder.svg",
    languages: ["English", "French"],
    nativeLanguage: "Spanish",
    rating: 4.9,
    reviewCount: 328,
    price: 25,
    currency: "USD",
    availability: ["morning", "afternoon"],
    specialties: ["Business Spanish", "Conversation", "Grammar"],
    experience: 8,
    description:
      "Passionate Spanish teacher with 8 years of experience. I specialize in helping professionals improve their business Spanish and conversation skills. My lessons are interactive and tailored to your specific needs.",
    video: "",
    isOnline: true,
    responseTime: "1 hour",
    completedLessons: 1250,
    badges: ["Professional Teacher", "Top Rated"],
    country: "Spain",
    timezone: "CET",
  },
  {
    id: "2",
    name: "James Wilson",
    avatar: "/placeholder.svg",
    languages: ["Spanish", "Portuguese"],
    nativeLanguage: "English",
    rating: 4.8,
    reviewCount: 412,
    price: 30,
    currency: "USD",
    availability: ["evening", "night"],
    specialties: ["IELTS Prep", "Academic English", "Pronunciation"],
    experience: 12,
    description:
      "Certified English teacher from the UK with expertise in IELTS preparation and academic English. I've helped hundreds of students achieve their target scores and improve their fluency.",
    video: "",
    isOnline: false,
    responseTime: "2 hours",
    completedLessons: 2100,
    badges: ["IELTS Specialist", "University Partner"],
    country: "United Kingdom",
    timezone: "GMT",
  },
  {
    id: "3",
    name: "Li Wei",
    avatar: "/placeholder.svg",
    languages: ["English"],
    nativeLanguage: "Chinese",
    rating: 4.9,
    reviewCount: 256,
    price: 22,
    currency: "USD",
    availability: ["morning", "afternoon", "evening"],
    specialties: ["HSK Preparation", "Business Chinese", "Culture"],
    experience: 6,
    description:
      "Native Chinese speaker from Beijing. I make learning Mandarin fun and practical with real-life conversations and cultural insights. Perfect for beginners to advanced learners.",
    video: "",
    isOnline: true,
    responseTime: "30 minutes",
    completedLessons: 890,
    badges: ["HSK Expert", "Cultural Guide"],
    country: "China",
    timezone: "CST",
  },
  {
    id: "4",
    name: "Sophie Dubois",
    avatar: "/placeholder.svg",
    languages: ["English", "Italian"],
    nativeLanguage: "French",
    rating: 4.7,
    reviewCount: 189,
    price: 28,
    currency: "USD",
    availability: ["morning", "afternoon"],
    specialties: ["DELF/DALF Prep", "French Literature", "Pronunciation"],
    experience: 10,
    description:
      "Experienced French teacher from Paris. I help students master French pronunciation and prepare for official exams. My lessons include French culture and literature.",
    video: "",
    isOnline: true,
    responseTime: "3 hours",
    completedLessons: 1450,
    badges: ["DELF Certified", "Literature Expert"],
    country: "France",
    timezone: "CET",
  },
  {
    id: "5",
    name: "Hans Mueller",
    avatar: "/placeholder.svg",
    languages: ["English", "French"],
    nativeLanguage: "German",
    rating: 4.6,
    reviewCount: 234,
    price: 26,
    currency: "USD",
    availability: ["evening", "night"],
    specialties: ["Business German", "Grammar", "TestDaF Prep"],
    experience: 7,
    description:
      "German language expert with focus on business communication. I help professionals develop confidence in German for workplace success.",
    video: "",
    isOnline: false,
    responseTime: "4 hours",
    completedLessons: 980,
    badges: ["Business Expert", "TestDaF Certified"],
    country: "Germany",
    timezone: "CET",
  },
  {
    id: "6",
    name: "Akiko Tanaka",
    avatar: "/placeholder.svg",
    languages: ["English"],
    nativeLanguage: "Japanese",
    rating: 4.8,
    reviewCount: 345,
    price: 24,
    currency: "USD",
    availability: ["morning", "evening"],
    specialties: ["JLPT Prep", "Anime & Manga", "Business Japanese"],
    experience: 9,
    description:
      "Native Japanese teacher from Tokyo. I make learning Japanese enjoyable through pop culture while maintaining strong fundamentals in grammar and writing systems.",
    video: "",
    isOnline: true,
    responseTime: "2 hours",
    completedLessons: 1620,
    badges: ["JLPT Expert", "Culture Specialist"],
    country: "Japan",
    timezone: "JST",
  },
];

export const getTeachers: RequestHandler = (req, res) => {
  try {
    const {
      page = "1",
      limit = "12",
      language,
      priceMin,
      priceMax,
      rating,
      country,
      search,
      sortBy = "rating",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let filteredTeachers = [...mockTeachers];

    // Apply filters
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredTeachers = filteredTeachers.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchTerm) ||
          teacher.specialties.some((specialty) =>
            specialty.toLowerCase().includes(searchTerm),
          ) ||
          teacher.languages.some((lang) =>
            lang.toLowerCase().includes(searchTerm),
          ),
      );
    }

    if (language && language !== "all-languages") {
      filteredTeachers = filteredTeachers.filter((teacher) =>
        teacher.languages
          .map((l) => l.toLowerCase())
          .includes((language as string).toLowerCase()),
      );
    }

    if (priceMin) {
      filteredTeachers = filteredTeachers.filter(
        (teacher) => teacher.price >= parseInt(priceMin as string),
      );
    }

    if (priceMax) {
      filteredTeachers = filteredTeachers.filter(
        (teacher) => teacher.price <= parseInt(priceMax as string),
      );
    }

    if (rating) {
      filteredTeachers = filteredTeachers.filter(
        (teacher) => teacher.rating >= parseFloat(rating as string),
      );
    }

    if (country && country !== "all-countries") {
      filteredTeachers = filteredTeachers.filter(
        (teacher) =>
          teacher.country.toLowerCase() === (country as string).toLowerCase(),
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filteredTeachers.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredTeachers.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filteredTeachers.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        filteredTeachers.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "experience":
        filteredTeachers.sort((a, b) => b.experience - a.experience);
        break;
      default:
        filteredTeachers.sort((a, b) => b.rating - a.rating);
    }

    // Apply pagination
    const paginatedTeachers = filteredTeachers.slice(offset, offset + limitNum);

    const response: TeachersResponse = {
      teachers: paginatedTeachers,
      total: filteredTeachers.length,
      page: pageNum,
      limit: limitNum,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTeacherById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const teacher = mockTeachers.find((t) => t.id === id);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json(teacher);
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFeaturedTeachers: RequestHandler = (req, res) => {
  try {
    // Return top-rated teachers with highest review counts
    const featured = mockTeachers
      .filter((teacher) => teacher.rating >= 4.7)
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 3);

    res.json(featured);
  } catch (error) {
    console.error("Error fetching featured teachers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
