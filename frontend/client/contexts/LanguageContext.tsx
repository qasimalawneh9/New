import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export type Language = "en" | "es" | "fr" | "de" | "zh" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const languages = [
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "es" as Language, name: "Español", flag: "🇪🇸" },
  { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
  { code: "de" as Language, name: "Deutsch", flag: "🇩🇪" },
  { code: "zh" as Language, name: "中文", flag: "🇨🇳" },
  { code: "ar" as Language, name: "العربية", flag: "🇸🇦" },
];

// Translation data - comprehensive translations for key UI elements
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.findTeachers": "Find Teachers",
    "nav.howItWorks": "How it Works",
    "nav.becomeTeacher": "Become a Teacher",
    "nav.login": "Log in",
    "nav.signup": "Sign up",
    "nav.dashboard": "Dashboard",
    "nav.settings": "Settings",
    "nav.messages": "Messages",
    "nav.lessons": "Lessons",

    // Common buttons
    "button.getStarted": "Get Started",
    "button.learnMore": "Learn More",
    "button.bookTrial": "Book Trial Lesson",
    "button.viewProfile": "View Profile",
    "button.bookLesson": "Book Lesson",
    "button.contactTeacher": "Contact Teacher",

    // Homepage
    "hero.title": "Learn Languages with Native Speakers",
    "hero.subtitle":
      "Connect with qualified teachers for personalized 1-on-1 lessons. Start speaking confidently today.",
    "hero.cta": "Find Your Teacher",
    "feature.whyChoose": "Why choose Talkcon?",
    "feature.title1": "Expert Native Teachers",
    "feature.desc1": "Learn from certified teachers and native speakers",
    "feature.title2": "Flexible Scheduling",
    "feature.desc2": "Book lessons that fit your schedule, anytime",
    "feature.title3": "Affordable Prices",
    "feature.desc3": "Quality language learning at competitive rates",

    // Footer
    "footer.copyright":
      "© 2024 Talkcon. All rights reserved. | Made with ❤️ for language learners worldwide.",

    // Auth
    "auth.login.title": "Welcome back",
    "auth.login.subtitle": "Sign in to your account to continue learning",
    "auth.signup.title": "Create your account",
    "auth.signup.subtitle": "Join thousands of language learners",
    "auth.signup.userType": "How do you want to use Talkcon?",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Name",
    "auth.forgotPassword": "Forgot password?",

    // Language selector
    "language.select": "Language",
    "language.change": "Change Language",

    // Teacher Pages
    "teacher.findTeachers": "Find Your Perfect Teacher",
    "teacher.allTeachers": "All Teachers",
    "teacher.rating": "Rating",
    "teacher.experience": "Experience",
    "teacher.hourlyRate": "Hourly Rate",
    "teacher.languages": "Languages",
    "teacher.specialties": "Specialties",
    "teacher.about": "About",

    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.stats": "Your Stats",
    "dashboard.upcomingLessons": "Upcoming Lessons",
    "dashboard.recentActivity": "Recent Activity",

    // Lesson Booking
    "booking.selectDate": "Select Date",
    "booking.selectTime": "Select Time",
    "booking.bookNow": "Book Now",
    "booking.trialLesson": "Trial Lesson",
    "booking.packageDeals": "Package Deals",

    // Common Terms
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.confirm": "Confirm",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.close": "Close",
    "common.submit": "Submit",
    "common.reset": "Reset",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.selectAll": "Select All",
    "common.clearAll": "Clear All",

    // Page Titles
    "page.home": "Home",
    "page.teachers": "Teachers",
    "page.dashboard": "Dashboard",
    "page.contact": "Contact",
    "page.about": "About",
    "page.pricing": "Pricing",
    "page.help": "Help",
    "page.login": "Login",
    "page.signup": "Sign Up",
    "page.profile": "Profile",
    "page.messages": "Messages",
    "page.lessons": "Lessons",
    "page.settings": "Settings",

    // Status Messages
    "status.online": "Online",
    "status.offline": "Offline",
    "status.away": "Away",
    "status.busy": "Busy",
  },
  es: {
    // Basic translations for testing - keeping it shorter to focus on the fix
    "nav.findTeachers": "Encontrar Profesores",
    "nav.howItWorks": "Cómo Funciona",
    "nav.becomeTeacher": "Ser Profesor",
    "nav.login": "Iniciar Sesión",
    "nav.signup": "Registrarse",
    "auth.login.title": "Bienvenido de vuelta",
    "auth.login.subtitle":
      "Inicia sesión en tu cuenta para continuar aprendiendo",
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
  },
  fr: {
    "nav.findTeachers": "Trouver des Professeurs",
    "nav.howItWorks": "Comment ça Marche",
    "nav.becomeTeacher": "Devenir Professeur",
    "nav.login": "Se Connecter",
    "nav.signup": "S'inscrire",
    "auth.login.title": "Bon retour",
    "auth.login.subtitle":
      "Connectez-vous à votre compte pour continuer à apprendre",
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.success": "Succès",
  },
  de: {
    "nav.findTeachers": "Lehrer Finden",
    "nav.howItWorks": "Wie es Funktioniert",
    "nav.becomeTeacher": "Lehrer Werden",
    "nav.login": "Anmelden",
    "nav.signup": "Registrieren",
    "auth.login.title": "Willkommen zurück",
    "auth.login.subtitle":
      "Melden Sie sich in Ihrem Konto an, um weiter zu lernen",
    "common.loading": "Laden...",
    "common.error": "Fehler",
    "common.success": "Erfolg",
  },
  zh: {
    "nav.findTeachers": "寻找老师",
    "nav.howItWorks": "工作原理",
    "nav.becomeTeacher": "成为老师",
    "nav.login": "登录",
    "nav.signup": "注册",
    "auth.login.title": "欢迎回来",
    "auth.login.subtitle": "登录您的账户继续学习",
    "common.loading": "加载中...",
    "common.error": "错误",
    "common.success": "成功",
  },
  ar: {
    "nav.findTeachers": "العثور على المعلمين",
    "nav.howItWorks": "كيف يعمل",
    "nav.becomeTeacher": "كن معلماً",
    "nav.login": "تسجيل الدخول",
    "nav.signup": "إنشاء حساب",
    "auth.login.title": "أهلاً بعودتك",
    "auth.login.subtitle": "سجل دخولك إلى حسابك لمواصلة التعلم",
    "common.loading": "جارٍ التحميل...",
    "common.error": "خطأ",
    "common.success": "نجح",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("talkcon_language") as Language;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("talkcon_language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
