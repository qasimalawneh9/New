import {
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
    // Navigation
    "nav.findTeachers": "Encontrar Profesores",
    "nav.howItWorks": "Cómo Funciona",
    "nav.becomeTeacher": "Ser Profesor",
    "nav.login": "Iniciar Sesión",
    "nav.signup": "Registrarse",
    "nav.dashboard": "Panel",
    "nav.settings": "Configuración",
    "nav.messages": "Mensajes",
    "nav.lessons": "Lecciones",

    // Common buttons
    "button.getStarted": "Comenzar",
    "button.learnMore": "Saber Más",
    "button.bookTrial": "Reservar Lección de Prueba",
    "button.viewProfile": "Ver Perfil",
    "button.bookLesson": "Reservar Lección",
    "button.contactTeacher": "Contactar Profesor",

    // Homepage
    "hero.title": "Aprende Idiomas con Hablantes Nativos",
    "hero.subtitle":
      "Conéctate con profesores calificados para lecciones personalizadas 1-a-1. Comienza a hablar con confianza hoy.",
    "hero.cta": "Encuentra tu Profesor",
    "feature.whyChoose": "¿Por qué elegir Talkcon?",
    "feature.title1": "Profesores Nativos Expertos",
    "feature.desc1": "Aprende de profesores certificados y hablantes nativos",
    "feature.title2": "Horarios Flexibles",
    "feature.desc2":
      "Reserva lecciones que se adapten a tu horario, en cualquier momento",
    "feature.title3": "Precios Accesibles",
    "feature.desc3": "Aprendizaje de idiomas de calidad a precios competitivos",

    // Footer
    "footer.copyright":
      "© 2024 Talkcon. Todos los derechos reservados. | Hecho con ❤️ para estudiantes de idiomas en todo el mundo.",

    // Auth
    "auth.login.title": "Bienvenido de vuelta",
    "auth.login.subtitle":
      "Inicia sesión en tu cuenta para continuar aprendiendo",
    "auth.signup.title": "Crea tu cuenta",
    "auth.signup.subtitle": "Únete a miles de estudiantes de idiomas",
    "auth.signup.userType": "¿Cómo quieres usar Talkcon?",
    "auth.email": "Correo electrónico",
    "auth.password": "Contraseña",
    "auth.name": "Nombre",
    "auth.forgotPassword": "¿Olvidaste tu contraseña?",

    // Language selector
    "language.select": "Idioma",
    "language.change": "Cambiar Idioma",

    // Teacher Pages
    "teacher.findTeachers": "Encuentra tu Profesor Perfecto",
    "teacher.allTeachers": "Todos los Profesores",
    "teacher.rating": "Calificación",
    "teacher.experience": "Experiencia",
    "teacher.hourlyRate": "Tarifa por Hora",
    "teacher.languages": "Idiomas",
    "teacher.specialties": "Especialidades",
    "teacher.about": "Acerca de",

    // Dashboard
    "dashboard.welcome": "Bienvenido de vuelta",
    "dashboard.stats": "Tus Estadísticas",
    "dashboard.upcomingLessons": "Próximas Lecciones",
    "dashboard.recentActivity": "Actividad Reciente",

    // Lesson Booking
    "booking.selectDate": "Seleccionar Fecha",
    "booking.selectTime": "Seleccionar Hora",
    "booking.bookNow": "Reservar Ahora",
    "booking.trialLesson": "Lección de Prueba",
    "booking.packageDeals": "Ofertas de Paquetes",

    // Common Terms
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.sort": "Ordenar",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.edit": "Editar",
    "common.delete": "Eliminar",
    "common.confirm": "Confirmar",
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.close": "Cerrar",
    "common.submit": "Enviar",
    "common.reset": "Restablecer",
    "common.back": "Atrás",
    "common.next": "Siguiente",
    "common.previous": "Anterior",
    "common.selectAll": "Seleccionar Todo",
    "common.clearAll": "Limpiar Todo",

    // Page Titles
    "page.home": "Inicio",
    "page.teachers": "Profesores",
    "page.dashboard": "Panel",
    "page.contact": "Contacto",
    "page.about": "Acerca de",
    "page.pricing": "Precios",
    "page.help": "Ayuda",
    "page.login": "Iniciar Sesión",
    "page.signup": "Registrarse",
    "page.profile": "Perfil",
    "page.messages": "Mensajes",
    "page.lessons": "Lecciones",
    "page.settings": "Configuración",

    // Status Messages
    "status.online": "En línea",
    "status.offline": "Desconectado",
    "status.away": "Ausente",
    "status.busy": "Ocupado",
  },
  fr: {
    // Navigation
    "nav.findTeachers": "Trouver des Professeurs",
    "nav.howItWorks": "Comment ça Marche",
    "nav.becomeTeacher": "Devenir Professeur",
    "nav.login": "Se Connecter",
    "nav.signup": "S'inscrire",
    "nav.dashboard": "Tableau de Bord",
    "nav.settings": "Paramètres",
    "nav.messages": "Messages",
    "nav.lessons": "Leçons",

    // Common buttons
    "button.getStarted": "Commencer",
    "button.learnMore": "En Savoir Plus",
    "button.bookTrial": "Réserver une Leçon d'Essai",
    "button.viewProfile": "Voir le Profil",
    "button.bookLesson": "Réserver une Leçon",
    "button.contactTeacher": "Contacter le Professeur",

    // Homepage
    "hero.title": "Apprenez les Langues avec des Locuteurs Natifs",
    "hero.subtitle":
      "Connectez-vous avec des professeurs qualifiés pour des leçons personnalisées en tête-à-tête. Commencez à parler avec confiance aujourd'hui.",
    "hero.cta": "Trouvez votre Professeur",
    "feature.whyChoose": "Pourquoi choisir Talkcon ?",
    "feature.title1": "Professeurs Natifs Experts",
    "feature.desc1":
      "Apprenez avec des professeurs certifiés et des locuteurs natifs",
    "feature.title2": "Horaires Flexibles",
    "feature.desc2":
      "Réservez des leçons qui correspondent à votre emploi du temps, à tout moment",
    "feature.title3": "Prix Abordables",
    "feature.desc3":
      "Apprentissage des langues de qualité à des tarifs compétitifs",

    // Footer
    "footer.copyright":
      "© 2024 Talkcon. Tous droits réservés. | Fait avec ❤️ pour les apprenants de langues du monde entier.",

    // Auth
    "auth.login.title": "Bon retour",
    "auth.login.subtitle":
      "Connectez-vous à votre compte pour continuer à apprendre",
    "auth.signup.title": "Créez votre compte",
    "auth.signup.subtitle": "Rejoignez des milliers d'apprenants de langues",
    "auth.signup.userType": "Comment voulez-vous utiliser Talkcon ?",
    "auth.email": "E-mail",
    "auth.password": "Mot de passe",
    "auth.name": "Nom",
    "auth.forgotPassword": "Mot de passe oublié ?",

    // Language selector
    "language.select": "Langue",
    "language.change": "Changer de Langue",

    // Teacher Pages
    "teacher.findTeachers": "Trouvez votre Professeur Parfait",
    "teacher.allTeachers": "Tous les Professeurs",
    "teacher.rating": "Note",
    "teacher.experience": "Expérience",
    "teacher.hourlyRate": "Tarif Horaire",
    "teacher.languages": "Langues",
    "teacher.specialties": "Spécialités",
    "teacher.about": "À propos",

    // Dashboard
    "dashboard.welcome": "Bon retour",
    "dashboard.stats": "Vos Statistiques",
    "dashboard.upcomingLessons": "Prochaines Leçons",
    "dashboard.recentActivity": "Activité Récente",

    // Lesson Booking
    "booking.selectDate": "Sélectionner la Date",
    "booking.selectTime": "Sélectionner l'Heure",
    "booking.bookNow": "Réserver Maintenant",
    "booking.trialLesson": "Leçon d'Essai",
    "booking.packageDeals": "Offres de Forfaits",

    // Common Terms
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.sort": "Trier",
    "common.save": "Sauvegarder",
    "common.cancel": "Annuler",
    "common.edit": "Modifier",
    "common.delete": "Supprimer",
    "common.confirm": "Confirmer",
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.success": "Succès",
    "common.close": "Fermer",
    "common.submit": "Soumettre",
    "common.reset": "Réinitialiser",
    "common.back": "Retour",
    "common.next": "Suivant",
    "common.previous": "Précédent",
    "common.selectAll": "Tout Sélectionner",
    "common.clearAll": "Tout Effacer",

    // Page Titles
    "page.home": "Accueil",
    "page.teachers": "Professeurs",
    "page.dashboard": "Tableau de Bord",
    "page.contact": "Contact",
    "page.about": "À Propos",
    "page.pricing": "Tarifs",
    "page.help": "Aide",
    "page.login": "Connexion",
    "page.signup": "S'inscrire",
    "page.profile": "Profil",
    "page.messages": "Messages",
    "page.lessons": "Leçons",
    "page.settings": "Paramètres",

    // Status Messages
    "status.online": "En ligne",
    "status.offline": "Hors ligne",
    "status.away": "Absent",
    "status.busy": "Occupé",
  },
  de: {
    // Navigation
    "nav.findTeachers": "Lehrer Finden",
    "nav.howItWorks": "Wie es Funktioniert",
    "nav.becomeTeacher": "Lehrer Werden",
    "nav.login": "Anmelden",
    "nav.signup": "Registrieren",
    "nav.dashboard": "Dashboard",
    "nav.settings": "Einstellungen",
    "nav.messages": "Nachrichten",
    "nav.lessons": "Lektionen",

    // Common buttons
    "button.getStarted": "Loslegen",
    "button.learnMore": "Mehr Erfahren",
    "button.bookTrial": "Probestunde Buchen",
    "button.viewProfile": "Profil Ansehen",
    "button.bookLesson": "Lektion Buchen",
    "button.contactTeacher": "Lehrer Kontaktieren",

    // Homepage
    "hero.title": "Sprachen mit Muttersprachlern Lernen",
    "hero.subtitle":
      "Verbinden Sie sich mit qualifizierten Lehrern für personalisierte Einzelstunden. Beginnen Sie heute selbstbewusst zu sprechen.",
    "hero.cta": "Ihren Lehrer Finden",
    "feature.whyChoose": "Warum Talkcon wählen?",
    "feature.title1": "Experten-Muttersprachler",
    "feature.desc1":
      "Lernen Sie von zertifizierten Lehrern und Muttersprachlern",
    "feature.title2": "Flexible Terminplanung",
    "feature.desc2":
      "Buchen Sie Lektionen, die in Ihren Zeitplan passen, jederzeit",
    "feature.title3": "Erschwingliche Preise",
    "feature.desc3": "Qualitäts-Sprachlernen zu wettbewerbsfähigen Preisen",

    // Footer
    "footer.copyright":
      "© 2024 Talkcon. Alle Rechte vorbehalten. | Mit ❤️ für Sprachlerner weltweit gemacht.",

    // Auth
    "auth.login.title": "Willkommen zurück",
    "auth.login.subtitle":
      "Melden Sie sich in Ihrem Konto an, um weiter zu lernen",
    "auth.signup.title": "Erstellen Sie Ihr Konto",
    "auth.signup.subtitle": "Schließen Sie sich Tausenden von Sprachlernern an",
    "auth.signup.userType": "Wie möchten Sie Talkcon nutzen?",
    "auth.email": "E-Mail",
    "auth.password": "Passwort",
    "auth.name": "Name",
    "auth.forgotPassword": "Passwort vergessen?",

    // Language selector
    "language.select": "Sprache",
    "language.change": "Sprache Ändern",

    // Teacher Pages
    "teacher.findTeachers": "Finden Sie Ihren Perfekten Lehrer",
    "teacher.allTeachers": "Alle Lehrer",
    "teacher.rating": "Bewertung",
    "teacher.experience": "Erfahrung",
    "teacher.hourlyRate": "Stundensatz",
    "teacher.languages": "Sprachen",
    "teacher.specialties": "Spezialitäten",
    "teacher.about": "Über",

    // Dashboard
    "dashboard.welcome": "Willkommen zurück",
    "dashboard.stats": "Ihre Statistiken",
    "dashboard.upcomingLessons": "Kommende Lektionen",
    "dashboard.recentActivity": "Neueste Aktivität",

    // Lesson Booking
    "booking.selectDate": "Datum Auswählen",
    "booking.selectTime": "Zeit Auswählen",
    "booking.bookNow": "Jetzt Buchen",
    "booking.trialLesson": "Probestunde",
    "booking.packageDeals": "Paketangebote",

    // Common Terms
    "common.search": "Suchen",
    "common.filter": "Filtern",
    "common.sort": "Sortieren",
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.edit": "Bearbeiten",
    "common.delete": "Löschen",
    "common.confirm": "Bestätigen",
    "common.loading": "Laden...",
    "common.error": "Fehler",
    "common.success": "Erfolg",
    "common.close": "Schließen",
    "common.submit": "Absenden",
    "common.reset": "Zurücksetzen",
    "common.back": "Zurück",
    "common.next": "Weiter",
    "common.previous": "Vorherige",
    "common.selectAll": "Alle Auswählen",
    "common.clearAll": "Alle Löschen",

    // Page Titles
    "page.home": "Startseite",
    "page.teachers": "Lehrer",
    "page.dashboard": "Dashboard",
    "page.contact": "Kontakt",
    "page.about": "Über",
    "page.pricing": "Preise",
    "page.help": "Hilfe",
    "page.login": "Anmelden",
    "page.signup": "Registrieren",
    "page.profile": "Profil",
    "page.messages": "Nachrichten",
    "page.lessons": "Lektionen",
    "page.settings": "Einstellungen",

    // Status Messages
    "status.online": "Online",
    "status.offline": "Offline",
    "status.away": "Abwesend",
    "status.busy": "Beschäftigt",
  },
  zh: {
    // Navigation
    "nav.findTeachers": "寻找老师",
    "nav.howItWorks": "工作原理",
    "nav.becomeTeacher": "成为老师",
    "nav.login": "登录",
    "nav.signup": "注册",
    "nav.dashboard": "仪表板",
    "nav.settings": "设置",
    "nav.messages": "消息",
    "nav.lessons": "课程",

    // Common buttons
    "button.getStarted": "开始",
    "button.learnMore": "了解更多",
    "button.bookTrial": "预约试听课",
    "button.viewProfile": "查看个人资料",
    "button.bookLesson": "预约课程",
    "button.contactTeacher": "联系老师",

    // Homepage
    "hero.title": "与母语人士学习语言",
    "hero.subtitle":
      "与合格的老师联系，进行个性化的一对一课程。今天就开始自信地说话。",
    "hero.cta": "找到您的老师",
    "feature.whyChoose": "为什么选择 Talkcon？",
    "feature.title1": "专业母语老师",
    "feature.desc1": "向认证老师和母语人士学习",
    "feature.title2": "灵活安排",
    "feature.desc2": "预约适合您时间安排的课程，随时随地",
    "feature.title3": "实惠价格",
    "feature.desc3": "以有竞争力的价格享受优质语言学习",

    // Footer
    "footer.copyright":
      "© 2024 Talkcon。保留所有���利。| 为全世界的语言学习者用❤️制作。",

    // Auth
    "auth.login.title": "欢迎回来",
    "auth.login.subtitle": "登录您的账户继续学习",
    "auth.signup.title": "创建您的账户",
    "auth.signup.subtitle": "加入数千名语言学习者",
    "auth.signup.userType": "您想如何使用 Talkcon？",
    "auth.email": "邮箱",
    "auth.password": "密码",
    "auth.name": "姓名",
    "auth.forgotPassword": "忘记密码？",

    // Language selector
    "language.select": "语言",
    "language.change": "更改语言",

    // Teacher Pages
    "teacher.findTeachers": "找到您的完美老师",
    "teacher.allTeachers": "所有老师",
    "teacher.rating": "评分",
    "teacher.experience": "经验",
    "teacher.hourlyRate": "每小时费用",
    "teacher.languages": "语言",
    "teacher.specialties": "专业",
    "teacher.about": "关于",

    // Dashboard
    "dashboard.welcome": "欢迎回来",
    "dashboard.stats": "您的统计",
    "dashboard.upcomingLessons": "即将到来的课程",
    "dashboard.recentActivity": "最近活动",

    // Lesson Booking
    "booking.selectDate": "选择日期",
    "booking.selectTime": "选择时间",
    "booking.bookNow": "立即预约",
    "booking.trialLesson": "试听课",
    "booking.packageDeals": "套餐优惠",

    // Common Terms
    "common.search": "搜索",
    "common.filter": "筛选",
    "common.sort": "排序",
    "common.save": "保存",
    "common.cancel": "取消",
    "common.edit": "编辑",
    "common.delete": "删除",
    "common.confirm": "确认",
    "common.loading": "加载中...",
    "common.error": "错误",
    "common.success": "成功",
    "common.close": "关闭",
    "common.submit": "提交",
    "common.reset": "重置",
    "common.back": "返回",
    "common.next": "下一步",
    "common.previous": "上一步",
    "common.selectAll": "全选",
    "common.clearAll": "清除全部",

    // Page Titles
    "page.home": "首页",
    "page.teachers": "老师",
    "page.dashboard": "仪表板",
    "page.contact": "联系",
    "page.about": "关于",
    "page.pricing": "价格",
    "page.help": "帮助",
    "page.login": "登录",
    "page.signup": "注册",
    "page.profile": "个人资料",
    "page.messages": "消息",
    "page.lessons": "课程",
    "page.settings": "设置",

    // Status Messages
    "status.online": "在线",
    "status.offline": "离线",
    "status.away": "离开",
    "status.busy": "忙碌",
  },
  ar: {
    // Navigation
    "nav.findTeachers": "العثور على المعلمين",
    "nav.howItWorks": "كيف يعمل",
    "nav.becomeTeacher": "كن معلماً",
    "nav.login": "تسجيل الدخول",
    "nav.signup": "إنشاء حساب",
    "nav.dashboard": "لوحة التحكم",
    "nav.settings": "الإعدادات",
    "nav.messages": "الرسائل",
    "nav.lessons": "الدروس",

    // Common buttons
    "button.getStarted": "ابدأ الآن",
    "button.learnMore": "اعرف المزيد",
    "button.bookTrial": "احجز درس تجريبي",
    "button.viewProfile": "عرض الملف الشخصي",
    "button.bookLesson": "احجز درس",
    "button.contactTeacher": "تواصل مع المعلم",

    // Homepage
    "hero.title": "تعلم اللغات مع المتحدثين الأصليين",
    "hero.subtitle":
      "تواصل مع معلمين مؤهلين للحصول على دروس شخصية فردية. ابدأ بالتحدث بثقة اليوم.",
    "hero.cta": "اعثر على مع��مك",
    "feature.whyChoose": "لماذا تختار Talkcon؟",
    "feature.title1": "معلمون خبراء من المتحدثين الأصليين",
    "feature.desc1": "تعلم من معلمين معتمدين ومتحدثين أصليين",
    "feature.title2": "جدولة مرنة",
    "feature.desc2": "احجز دروساً تناسب جدولك الزمني، في أي وقت",
    "feature.title3": "أسعار معقولة",
    "feature.desc3": "تعلم لغات عالي الجودة بأسعار تنافسية",

    // Footer
    "footer.copyright":
      "© 2024 Talkcon. جميع الحقوق محفوظة. | صُنع بـ ❤️ لمتعلمي اللغات حول العالم.",

    // Auth
    "auth.login.title": "أهلاً بعودتك",
    "auth.login.subtitle": "سجل دخولك إلى حسابك لمواصلة التعلم",
    "auth.signup.title": "أنشئ حسابك",
    "auth.signup.subtitle": "انضم إلى آلاف متعلمي اللغات",
    "auth.signup.userType": "كيف تريد استخدام Talkcon؟",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.name": "الاسم",
    "auth.forgotPassword": "نسيت كلمة ال��رور؟",

    // Language selector
    "language.select": "اللغة",
    "language.change": "تغيير اللغة",

    // Teacher Pages
    "teacher.findTeachers": "اعثر على معلمك المثالي",
    "teacher.allTeachers": "جميع المعلمين",
    "teacher.rating": "التقييم",
    "teacher.experience": "الخبرة",
    "teacher.hourlyRate": "السعر بالساعة",
    "teacher.languages": "اللغات",
    "teacher.specialties": "التخصصات",
    "teacher.about": "نبذة عن",

    // Dashboard
    "dashboard.welcome": "أهلاً بعودتك",
    "dashboard.stats": "إحصائياتك",
    "dashboard.upcomingLessons": "الدروس القادمة",
    "dashboard.recentActivity": "النشاط الأخير",

    // Lesson Booking
    "booking.selectDate": "اختر التاريخ",
    "booking.selectTime": "اختر الوقت",
    "booking.bookNow": "احجز الآن",
    "booking.trialLesson": "درس تجريبي",
    "booking.packageDeals": "عروض الحزم",

    // Common Terms
    "common.search": "بحث",
    "common.filter": "تصفية",
    "common.sort": "ترتيب",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.edit": "تعديل",
    "common.delete": "حذف",
    "common.confirm": "تأكيد",
    "common.loading": "جارٍ التحميل...",
    "common.error": "خطأ",
    "common.success": "نجح",
    "common.close": "إغلاق",
    "common.submit": "إرسال",
    "common.reset": "إعادة تعيين",
    "common.back": "رجوع",
    "common.next": "التالي",
    "common.previous": "السابق",
    "common.selectAll": "تحديد الكل",
    "common.clearAll": "مسح الكل",

    // Page Titles
    "page.home": "الرئيسية",
    "page.teachers": "المعلمون",
    "page.dashboard": "لوحة التحكم",
    "page.contact": "تواصل معنا",
    "page.about": "حول",
    "page.pricing": "الأسعار",
    "page.help": "مساعدة",
    "page.login": "تسجيل الدخول",
    "page.signup": "إنشاء حساب",
    "page.profile": "الملف الشخصي",
    "page.messages": "الرسائل",
    "page.lessons": "الدروس",
    "page.settings": "الإعدادات",

    // Status Messages
    "status.online": "متصل",
    "status.offline": "غير متصل",
    "status.away": "غائب",
    "status.busy": "مشغول",
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
