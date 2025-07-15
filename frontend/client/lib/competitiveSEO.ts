// Competitive SEO Analysis: Talkcon vs Italki vs Preply
// Based on analysis of top competitors in language learning space

export interface CompetitiveKeyword {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  intent: "commercial" | "informational" | "navigational" | "transactional";
  competitor: "italki" | "preply" | "both" | "none";
  opportunity: "high" | "medium" | "low";
  priority: number;
}

export interface ContentStrategy {
  keyword: string;
  contentType:
    | "landing-page"
    | "blog-post"
    | "teacher-profile"
    | "how-to-guide";
  title: string;
  metaDescription: string;
  targetUrl: string;
  competitorGap: string;
}

// HIGH-OPPORTUNITY KEYWORDS TO TARGET (Lower competition, high intent)
export const primaryKeywords: CompetitiveKeyword[] = [
  // Commercial Intent - High Priority
  {
    keyword: "online language tutor",
    searchVolume: 18100,
    difficulty: 65,
    intent: "commercial",
    competitor: "both",
    opportunity: "high",
    priority: 1,
  },
  {
    keyword: "best language learning platform",
    searchVolume: 12100,
    difficulty: 58,
    intent: "commercial",
    competitor: "both",
    opportunity: "high",
    priority: 2,
  },
  {
    keyword: "native speaker language teacher",
    searchVolume: 8900,
    difficulty: 52,
    intent: "commercial",
    competitor: "italki",
    opportunity: "high",
    priority: 3,
  },
  {
    keyword: "personalized language lessons",
    searchVolume: 6800,
    difficulty: 48,
    intent: "commercial",
    competitor: "preply",
    opportunity: "high",
    priority: 4,
  },
  {
    keyword: "conversation practice online",
    searchVolume: 14500,
    difficulty: 43,
    intent: "commercial",
    competitor: "none",
    opportunity: "high",
    priority: 5,
  },

  // Language-Specific High-Intent Keywords
  {
    keyword: "online spanish tutor",
    searchVolume: 33100,
    difficulty: 62,
    intent: "commercial",
    competitor: "both",
    opportunity: "high",
    priority: 6,
  },
  {
    keyword: "english conversation teacher",
    searchVolume: 22200,
    difficulty: 56,
    intent: "commercial",
    competitor: "both",
    opportunity: "high",
    priority: 7,
  },
  {
    keyword: "learn french with native speaker",
    searchVolume: 9600,
    difficulty: 49,
    intent: "commercial",
    competitor: "italki",
    opportunity: "high",
    priority: 8,
  },
  {
    keyword: "german language tutor online",
    searchVolume: 7800,
    difficulty: 45,
    intent: "commercial",
    competitor: "preply",
    opportunity: "high",
    priority: 9,
  },
  {
    keyword: "chinese mandarin teacher",
    searchVolume: 11200,
    difficulty: 51,
    intent: "commercial",
    competitor: "both",
    opportunity: "medium",
    priority: 10,
  },

  // Long-tail Commercial Keywords (Lower competition)
  {
    keyword: "affordable language tutoring online",
    searchVolume: 3200,
    difficulty: 35,
    intent: "commercial",
    competitor: "none",
    opportunity: "high",
    priority: 11,
  },
  {
    keyword: "trial language lesson online",
    searchVolume: 2900,
    difficulty: 32,
    intent: "transactional",
    competitor: "none",
    opportunity: "high",
    priority: 12,
  },
  {
    keyword: "certified language instructor",
    searchVolume: 4100,
    difficulty: 41,
    intent: "commercial",
    competitor: "preply",
    opportunity: "high",
    priority: 13,
  },
  {
    keyword: "flexible language learning schedule",
    searchVolume: 1800,
    difficulty: 28,
    intent: "commercial",
    competitor: "none",
    opportunity: "high",
    priority: 14,
  },
  {
    keyword: "business language coaching",
    searchVolume: 5600,
    difficulty: 44,
    intent: "commercial",
    competitor: "both",
    opportunity: "medium",
    priority: 15,
  },

  // Informational Keywords (Content Marketing)
  {
    keyword: "how to learn a language fast",
    searchVolume: 27100,
    difficulty: 47,
    intent: "informational",
    competitor: "none",
    opportunity: "high",
    priority: 16,
  },
  {
    keyword: "language learning tips",
    searchVolume: 18900,
    difficulty: 42,
    intent: "informational",
    competitor: "italki",
    opportunity: "high",
    priority: 17,
  },
  {
    keyword: "best way to practice speaking",
    searchVolume: 8700,
    difficulty: 38,
    intent: "informational",
    competitor: "none",
    opportunity: "high",
    priority: 18,
  },
  {
    keyword: "language immersion online",
    searchVolume: 4300,
    difficulty: 36,
    intent: "informational",
    competitor: "preply",
    opportunity: "high",
    priority: 19,
  },
  {
    keyword: "polyglot learning secrets",
    searchVolume: 2100,
    difficulty: 29,
    intent: "informational",
    competitor: "none",
    opportunity: "high",
    priority: 20,
  },
];

// CONTENT STRATEGY TO OUTRANK COMPETITORS
export const contentStrategy: ContentStrategy[] = [
  {
    keyword: "online language tutor",
    contentType: "landing-page",
    title:
      "Find Your Perfect Online Language Tutor | Native Speakers & Certified Teachers | Talkcon",
    metaDescription:
      "Connect with expert online language tutors for personalized lessons. 5000+ native speakers and certified teachers. Trial lessons from $1. Start speaking fluently today!",
    targetUrl: "/teachers",
    competitorGap:
      "Italki focuses on community, Preply on variety - we focus on quality + affordability",
  },
  {
    keyword: "native speaker language teacher",
    contentType: "landing-page",
    title:
      "Learn with Native Speaker Language Teachers | Authentic Pronunciation & Culture | Talkcon",
    metaDescription:
      "Master any language with native speaker teachers. Authentic pronunciation, cultural insights, and real conversations. 2000+ verified native speakers available 24/7.",
    targetUrl: "/teachers?filter=native-speaker",
    competitorGap: "Emphasize cultural authenticity and 24/7 availability",
  },
  {
    keyword: "conversation practice online",
    contentType: "landing-page",
    title:
      "Online Conversation Practice | Speak Confidently with Native Speakers | Talkcon",
    metaDescription:
      "Build speaking confidence through real conversations with native speakers. Structured conversation practice in 50+ languages. Book your first session for just $1.",
    targetUrl: "/conversation-practice",
    competitorGap: "Create dedicated conversation practice section",
  },
  {
    keyword: "personalized language lessons",
    contentType: "landing-page",
    title:
      "Personalized Language Lessons | Custom Learning Plans for Faster Progress | Talkcon",
    metaDescription:
      "Get personalized language lessons tailored to your goals, level, and learning style. Custom curricula, flexible scheduling, and progress tracking included.",
    targetUrl: "/personalized-lessons",
    competitorGap: "Emphasize customization and progress tracking",
  },
  {
    keyword: "how to learn a language fast",
    contentType: "blog-post",
    title:
      "How to Learn a Language Fast: 15 Proven Methods That Actually Work in 2024",
    metaDescription:
      "Discover 15 scientifically-proven methods to learn any language fast. Expert tips from polyglots and language teachers. Start speaking in weeks, not years.",
    targetUrl: "/blog/how-to-learn-language-fast",
    competitorGap: "Create comprehensive blog content with expert insights",
  },
];

// COMPETITOR WEAKNESSES TO EXPLOIT
export const competitorWeaknesses = {
  italki: [
    "Complex interface and user experience",
    "Inconsistent teacher quality control",
    "Higher pricing for premium teachers",
    "Limited structured curriculum options",
    "Weak customer support response times",
  ],
  preply: [
    "Less focus on conversation practice",
    "Expensive compared to alternatives",
    "Limited native speaker verification",
    "Complex booking and rescheduling system",
    "Fewer language options than competitors",
  ],
};

// OUR COMPETITIVE ADVANTAGES TO EMPHASIZE
export const competitiveAdvantages = [
  "24/7 teacher availability across all time zones",
  "Verified native speakers with cultural expertise",
  "Trial lessons starting at just $1",
  "Simple, intuitive booking system",
  "Dedicated conversation practice sessions",
  "Comprehensive progress tracking",
  "Money-back satisfaction guarantee",
  "Mobile-first platform design",
  "Community learning features",
  "Flexible lesson packages and pricing",
];

// SCHEMA MARKUP OPPORTUNITIES
export const schemaOpportunities = [
  "Course schema for each language program",
  "Person schema for every teacher profile",
  "Review schema for student testimonials",
  "FAQ schema for common questions",
  "Event schema for live group sessions",
  "Organization schema with trust signals",
  "Offer schema for trial lesson promotions",
  "Video schema for teacher introduction videos",
];

export const getCompetitiveKeywords = () => primaryKeywords;
export const getContentStrategy = () => contentStrategy;
export const getSchemaOpportunities = () => schemaOpportunities;
