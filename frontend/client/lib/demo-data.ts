import { db } from "./database";

export function populateDemoData() {
  // Clear existing data first
  db.clearAllData();

  // Create demo students
  const students = [
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@gmail.com",
      password: "password123",
      avatar: "/placeholder.svg",
      learningLanguages: ["Spanish", "French"],
      nativeLanguage: "English",
      level: { Spanish: "Intermediate", French: "Beginner" },
      joinedDate: new Date(2024, 0, 20).toISOString(),
    },
    {
      name: "Michael Chen",
      email: "michael.chen@gmail.com",
      password: "password123",
      avatar: "/placeholder.svg",
      learningLanguages: ["English", "Japanese"],
      nativeLanguage: "Chinese",
      level: { English: "Advanced", Japanese: "Beginner" },
      joinedDate: new Date(2024, 1, 15).toISOString(),
    },
    {
      name: "Emma Rodriguez",
      email: "emma.rodriguez@gmail.com",
      password: "password123",
      avatar: "/placeholder.svg",
      learningLanguages: ["English", "German"],
      nativeLanguage: "Spanish",
      level: { English: "Intermediate", German: "Beginner" },
      joinedDate: new Date(2024, 2, 10).toISOString(),
    },
    {
      name: "David Kim",
      email: "david.kim@gmail.com",
      password: "password123",
      avatar: "/placeholder.svg",
      learningLanguages: ["Korean", "Chinese"],
      nativeLanguage: "English",
      level: { Korean: "Beginner", Chinese: "Intermediate" },
      joinedDate: new Date(2024, 1, 28).toISOString(),
    },
    {
      name: "Lisa Thompson",
      email: "lisa.thompson@gmail.com",
      password: "password123",
      avatar: "/placeholder.svg",
      learningLanguages: ["Italian", "Portuguese"],
      nativeLanguage: "English",
      level: { Italian: "Advanced", Portuguese: "Beginner" },
      joinedDate: new Date(2024, 0, 5).toISOString(),
    },
  ];

  students.forEach((student) => {
    db.createUser(student);
  });

  // Create demo teacher applications
  const teacherApplications = [
    {
      firstName: "María",
      lastName: "García",
      email: "maria.garcia@linguaconnect.com",
      password: "teacher123",
      languages: ["Spanish", "English"],
      nativeLanguage: "Spanish",
      hourlyRate: 25,
      experience: 5,
      country: "Spain",
      timezone: "Europe/Madrid",
      specialties: ["Grammar", "Conversation", "Business Spanish"],
      teachingMethodology:
        "I focus on conversational practice with structured grammar lessons. My approach emphasizes real-world communication while building solid language foundations.",
      introVideo: "https://www.youtube.com/embed/VXa9tXcMhXQ",
    },
    {
      firstName: "Jean",
      lastName: "Dubois",
      email: "jean.dubois@linguaconnect.com",
      password: "teacher123",
      languages: ["French", "English"],
      nativeLanguage: "French",
      hourlyRate: 30,
      experience: 8,
      country: "France",
      timezone: "Europe/Paris",
      specialties: ["Literature", "Culture", "Pronunciation"],
      teachingMethodology:
        "I believe in immersive learning through cultural context and authentic materials. Students learn French through stories, films, and real French culture.",
      introVideo: "https://www.youtube.com/embed/HDntl7yzzVI",
    },
    {
      firstName: "Hiroshi",
      lastName: "Tanaka",
      email: "hiroshi.tanaka@linguaconnect.com",
      password: "teacher123",
      languages: ["Japanese", "English"],
      nativeLanguage: "Japanese",
      hourlyRate: 28,
      experience: 6,
      country: "Japan",
      timezone: "Asia/Tokyo",
      specialties: ["Hiragana/Katakana", "Kanji", "Business Japanese"],
      teachingMethodology:
        "I start with solid foundation in writing systems, then progress to practical conversation. I use visual aids and mnemonics to make kanji learning enjoyable.",
      introVideo: "https://www.youtube.com/embed/bEQtkLNTmRs",
    },
    {
      firstName: "Anna",
      lastName: "Müller",
      email: "anna.muller@linguaconnect.com",
      password: "teacher123",
      languages: ["German", "English"],
      nativeLanguage: "German",
      hourlyRate: 26,
      experience: 4,
      country: "Germany",
      timezone: "Europe/Berlin",
      specialties: ["Grammar", "Test Preparation", "Academic German"],
      teachingMethodology:
        "I use a systematic approach to German grammar with plenty of practice exercises. My lessons are structured but interactive, focusing on practical usage.",
      introVideo: "https://www.youtube.com/embed/YnSKLqzuvbU",
    },
    {
      firstName: "Paolo",
      lastName: "Rossi",
      email: "paolo.rossi@linguaconnect.com",
      password: "teacher123",
      languages: ["Italian", "English"],
      nativeLanguage: "Italian",
      hourlyRate: 24,
      experience: 3,
      country: "Italy",
      timezone: "Europe/Rome",
      specialties: ["Conversation", "Culture", "Travel Italian"],
      teachingMethodology:
        "I make Italian learning fun through music, food, and travel scenarios. Students learn practical Italian they can use in real situations.",
      introVideo: "https://www.youtube.com/embed/9cMJmjxXHqA",
    },
  ];

  teacherApplications.forEach((application) => {
    db.createTeacherApplication(application);
  });

  // Create a demo teacher account for easy testing
  const demoTeacherApp = {
    firstName: "Demo",
    lastName: "Teacher",
    email: "teacher@demo.com",
    password: "teacher123",
    languages: ["English", "Spanish"],
    nativeLanguage: "English",
    hourlyRate: 25,
    experience: 3,
    country: "United States",
    timezone: "America/New_York",
    specialties: ["Conversation", "Grammar", "Business English"],
    teachingMethodology:
      "I focus on practical conversation skills and real-world applications. My lessons are interactive and tailored to each student's goals and interests.",
    introVideo: "https://www.youtube.com/embed/B7MuXSd0aYE",
  };

  const demoTeacherId = db.createTeacherApplication(demoTeacherApp);
  db.approveTeacher(demoTeacherId);

  // Approve some other teachers
  const allApplications = db.getTeacherApplications();
  allApplications.slice(0, 3).forEach((app) => {
    if (app.id !== demoTeacherId) {
      db.approveTeacher(app.id);
    }
  });

  // Create some lessons
  const approvedTeachers = db.getTeachers();
  const allUsers = db.getUsers();

  if (approvedTeachers.length > 0 && allUsers.length > 0) {
    // Create completed lessons
    for (let i = 0; i < 15; i++) {
      const teacher = approvedTeachers[i % approvedTeachers.length];
      const student = allUsers[i % allUsers.length];
      const lessonDate = new Date();
      lessonDate.setDate(lessonDate.getDate() - Math.floor(Math.random() * 30));

      db.createLesson({
        teacherId: teacher.id,
        studentId: student.id,
        language: teacher.languages[0],
        date: lessonDate.toISOString(),
        duration: 60,
        price: teacher.price,
        status: "completed",
        type: "regular",
        rating: 4 + Math.random(),
        review: "Great lesson! Very helpful teacher.",
      });
    }

    // Create upcoming lessons
    for (let i = 0; i < 8; i++) {
      const teacher = approvedTeachers[i % approvedTeachers.length];
      const student = allUsers[i % allUsers.length];
      const lessonDate = new Date();
      lessonDate.setDate(
        lessonDate.getDate() + Math.floor(Math.random() * 7) + 1,
      );

      db.createLesson({
        teacherId: teacher.id,
        studentId: student.id,
        language: teacher.languages[0],
        date: lessonDate.toISOString(),
        duration: 60,
        price: teacher.price,
        status: "scheduled",
        type: "regular",
      });
    }
  }

  console.log("Demo data populated successfully!");
  return {
    studentsCreated: students.length,
    teacherApplicationsCreated: teacherApplications.length,
    lessonsCreated: 23,
  };
}

// Function to reset and repopulate data
export function resetDemoData() {
  const result = populateDemoData();
  return result;
}
