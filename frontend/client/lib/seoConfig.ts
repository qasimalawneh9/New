// Standalone SEO Configuration System for Talkcon
// Complete SEO management without external dependencies

export interface SEOPageConfig {
  // Core SEO settings
  pageTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;

  // Competitive SEO settings
  targetKeywords: string[];
  competitorKeywords: string[];
  semanticKeywords: string[];

  // Rich snippet configuration
  enableFAQ: boolean;
  enableReviews: boolean;
  enableBreadcrumbs: boolean;
  enableSchema: boolean;

  // Open Graph settings
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;

  // Technical SEO
  robotsDirective:
    | "index,follow"
    | "noindex,nofollow"
    | "index,nofollow"
    | "noindex,follow";
  priority: number;
  changeFreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";

  // Language settings
  language: string;
  alternateLanguages: { hreflang: string; href: string }[];
}

// Centralized SEO configurations for all pages
export const seoConfigurations: { [key: string]: SEOPageConfig } = {
  homepage: {
    pageTitle:
      "Best Online Language Tutors & Native Speaker Teachers | Learn 50+ Languages | Talkcon",
    metaDescription:
      "Find the best online language tutors and native speaker teachers. Personalized language lessons from $1 trial. Learn English, Spanish, French, Chinese and 47+ languages with certified instructors. 24/7 availability, money-back guarantee.",
    keywords: [
      "online language tutor",
      "native speaker language teacher",
      "best language learning platform",
      "personalized language lessons",
      "conversation practice online",
      "certified language instructors",
      "trial language lesson online",
      "language learning marketplace",
    ],
    targetKeywords: [
      "online language tutor",
      "native speaker language teacher",
      "best language learning platform",
      "conversation practice online",
    ],
    competitorKeywords: [
      "online language tutor",
      "personalized language lessons",
      "native speaker teacher",
    ],
    semanticKeywords: [
      "language acquisition",
      "second language learning",
      "multilingual education",
      "virtual lessons",
      "speaking practice",
      "cultural immersion",
    ],
    enableFAQ: true,
    enableReviews: true,
    enableBreadcrumbs: false,
    enableSchema: true,
    ogImage: "/og-homepage-competitive.jpg",
    ogImageAlt:
      "Online language tutors and native speaker teachers on Talkcon platform",
    robotsDirective: "index,follow",
    priority: 1.0,
    changeFreq: "daily",
    language: "en",
    alternateLanguages: [
      { hreflang: "en", href: "https://talkcon.com/" },
      { hreflang: "es", href: "https://talkcon.com/es/" },
      { hreflang: "fr", href: "https://talkcon.com/fr/" },
      { hreflang: "de", href: "https://talkcon.com/de/" },
      { hreflang: "x-default", href: "https://talkcon.com/" },
    ],
  },

  teachers: {
    pageTitle:
      "Find the Best Online Language Tutors & Native Speaker Teachers | 5000+ Verified Instructors | Talkcon",
    metaDescription:
      "Find the best online language tutors and native speaker teachers. 5000+ certified language instructors for personalized lessons in 50+ languages. Trial lessons from $1, 24/7 availability, money-back guarantee.",
    keywords: [
      "online language tutor",
      "native speaker language teacher",
      "certified language instructors",
      "personalized language lessons",
      "find language teacher",
      "qualified language teacher",
      "language teacher near me",
    ],
    targetKeywords: [
      "online language tutor",
      "native speaker teacher",
      "certified language instructors",
    ],
    competitorKeywords: [
      "online language tutor",
      "native speaker teacher",
      "certified language instructors",
    ],
    semanticKeywords: [
      "language instruction",
      "multilingual education",
      "speaking practice",
      "cultural immersion",
    ],
    enableFAQ: true,
    enableReviews: false,
    enableBreadcrumbs: true,
    enableSchema: true,
    ogImage: "/og-teachers-page.jpg",
    robotsDirective: "index,follow",
    priority: 0.9,
    changeFreq: "daily",
    language: "en",
    alternateLanguages: [
      { hreflang: "en", href: "https://talkcon.com/teachers" },
      { hreflang: "es", href: "https://talkcon.com/es/teachers" },
    ],
  },

  howItWorks: {
    pageTitle:
      "How It Works - Learn Languages Online in 3 Simple Steps | Talkcon",
    metaDescription:
      "Discover how easy it is to learn languages online with Talkcon. Find your perfect teacher, book lessons, and start speaking confidently in 3 simple steps. Trial lessons from $1.",
    keywords: [
      "how to learn languages online",
      "online language learning process",
      "language tutoring steps",
      "find language teacher",
      "book language lessons",
      "language learning guide",
    ],
    targetKeywords: [
      "how to learn languages online",
      "online language learning process",
    ],
    competitorKeywords: [
      "how to learn languages online",
      "language learning steps",
    ],
    semanticKeywords: [
      "language acquisition process",
      "online education",
      "learning methodology",
    ],
    enableFAQ: true,
    enableReviews: false,
    enableBreadcrumbs: true,
    enableSchema: true,
    robotsDirective: "index,follow",
    priority: 0.9,
    changeFreq: "weekly",
    language: "en",
    alternateLanguages: [
      { hreflang: "en", href: "https://talkcon.com/how-it-works" },
    ],
  },

  pricing: {
    pageTitle:
      "Language Learning Pricing | Affordable Online Tutoring from $1 Trial | Talkcon",
    metaDescription:
      "Transparent language learning pricing with trial lessons from $1. No hidden fees, flexible packages, and money-back guarantee. Compare our affordable rates with certified tutors.",
    keywords: [
      "language learning pricing",
      "affordable language tutoring",
      "trial language lesson online",
      "language tutor cost",
      "cheap language lessons",
    ],
    targetKeywords: [
      "affordable language tutoring online",
      "trial language lesson online",
    ],
    competitorKeywords: [
      "language learning pricing",
      "affordable language tutoring",
    ],
    semanticKeywords: [
      "cost-effective learning",
      "budget-friendly education",
      "flexible pricing",
    ],
    enableFAQ: true,
    enableReviews: false,
    enableBreadcrumbs: true,
    enableSchema: true,
    robotsDirective: "index,follow",
    priority: 0.8,
    changeFreq: "weekly",
    language: "en",
    alternateLanguages: [],
  },
};

// Language-specific SEO configurations
export const getLanguageSpecificSEO = (
  language: string,
): Partial<SEOPageConfig> => {
  const languageConfigs: { [key: string]: Partial<SEOPageConfig> } = {
    spanish: {
      pageTitle: `Best Spanish Tutors & Native Speaker Teachers Online | Learn Spanish Fast | Talkcon`,
      metaDescription: `Learn Spanish with certified native speaker teachers and expert Spanish tutors. Personalized Spanish lessons from $1 trial. 500+ verified instructors available 24/7 for conversation practice and cultural immersion.`,
      targetKeywords: [
        "spanish tutor online",
        "learn spanish with native speaker",
        "spanish conversation practice",
      ],
      competitorKeywords: ["online spanish tutor", "spanish teacher online"],
    },
    english: {
      pageTitle: `Best English Tutors & Native Speaker Teachers Online | Learn English Fast | Talkcon`,
      metaDescription: `Learn English with certified native speaker teachers and expert English tutors. Personalized English lessons from $1 trial. 1000+ verified instructors available 24/7 for conversation practice and business English.`,
      targetKeywords: [
        "english tutor online",
        "english conversation teacher",
        "learn english with native speaker",
      ],
      competitorKeywords: ["online english tutor", "english teacher online"],
    },
    french: {
      pageTitle: `Best French Tutors & Native Speaker Teachers Online | Learn French Fast | Talkcon`,
      metaDescription: `Learn French with certified native speaker teachers and expert French tutors. Personalized French lessons from $1 trial. 300+ verified instructors available 24/7 for conversation practice and cultural immersion.`,
      targetKeywords: [
        "french tutor online",
        "learn french with native speaker",
        "french conversation practice",
      ],
      competitorKeywords: ["online french tutor", "french teacher online"],
    },
  };

  return languageConfigs[language.toLowerCase()] || {};
};

// SEO Manager Class for standalone operation
export class TalkconSEOManager {
  private pageConfig: SEOPageConfig;

  constructor(pageKey: string, languageOverride?: string) {
    this.pageConfig = { ...seoConfigurations[pageKey] };

    if (languageOverride && pageKey === "teachers") {
      const langConfig = getLanguageSpecificSEO(languageOverride);
      this.pageConfig = { ...this.pageConfig, ...langConfig };
    }
  }

  // Generate complete meta tag configuration
  getMetaTags(): { [key: string]: string } {
    return {
      title: this.pageConfig.pageTitle,
      description: this.pageConfig.metaDescription,
      keywords: this.pageConfig.keywords.join(", "),
      "og:title": this.pageConfig.ogTitle || this.pageConfig.pageTitle,
      "og:description":
        this.pageConfig.ogDescription || this.pageConfig.metaDescription,
      "og:image": this.pageConfig.ogImage || "/og-image.jpg",
      "og:image:alt": this.pageConfig.ogImageAlt || this.pageConfig.pageTitle,
      canonical: this.pageConfig.canonicalUrl || window.location.href,
      robots: this.pageConfig.robotsDirective,
      language: this.pageConfig.language,
    };
  }

  // Get target keywords for content optimization
  getTargetKeywords(): string[] {
    return this.pageConfig.targetKeywords;
  }

  // Get competitor keywords for analysis
  getCompetitorKeywords(): string[] {
    return this.pageConfig.competitorKeywords;
  }

  // Get semantic keywords for natural integration
  getSemanticKeywords(): string[] {
    return this.pageConfig.semanticKeywords;
  }

  // Check if FAQ schema should be enabled
  shouldEnableFAQ(): boolean {
    return this.pageConfig.enableFAQ;
  }

  // Check if review schema should be enabled
  shouldEnableReviews(): boolean {
    return this.pageConfig.enableReviews;
  }

  // Get breadcrumb configuration
  shouldEnableBreadcrumbs(): boolean {
    return this.pageConfig.enableBreadcrumbs;
  }

  // Get alternate language links
  getAlternateLanguages(): { hreflang: string; href: string }[] {
    return this.pageConfig.alternateLanguages;
  }

  // Update configuration dynamically
  updateConfig(updates: Partial<SEOPageConfig>): void {
    this.pageConfig = { ...this.pageConfig, ...updates };
  }

  // Get sitemap entry
  getSitemapEntry(baseUrl: string = "https://talkcon.com"): any {
    return {
      url: this.pageConfig.canonicalUrl || baseUrl,
      priority: this.pageConfig.priority,
      changefreq: this.pageConfig.changeFreq,
      lastmod: new Date().toISOString(),
    };
  }
}

// Utility functions for SEO optimization
export const seoUtils = {
  // Extract keywords from text content
  extractKeywords: (text: string, targetKeywords: string[]): string[] => {
    const foundKeywords: string[] = [];
    targetKeywords.forEach((keyword) => {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
      }
    });
    return foundKeywords;
  },

  // Generate keyword-optimized content
  optimizeContent: (content: string, keywords: string[]): string => {
    let optimizedContent = content;
    keywords.forEach((keyword) => {
      if (!content.toLowerCase().includes(keyword.toLowerCase())) {
        // Suggest adding keyword naturally
        console.log(`Consider adding keyword "${keyword}" to content`);
      }
    });
    return optimizedContent;
  },

  // Calculate keyword density
  getKeywordDensity: (content: string, keyword: string): number => {
    const words = content.toLowerCase().split(/\s+/);
    const keywordWords = keyword.toLowerCase().split(/\s+/);
    const totalWords = words.length;

    let keywordCount = 0;
    for (let i = 0; i <= words.length - keywordWords.length; i++) {
      const phrase = words.slice(i, i + keywordWords.length).join(" ");
      if (phrase === keyword.toLowerCase()) {
        keywordCount++;
      }
    }

    return (keywordCount / totalWords) * 100;
  },

  // Generate SEO-friendly URL slug
  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },
};

// Export default configurations and manager
export default {
  seoConfigurations,
  TalkconSEOManager,
  getLanguageSpecificSEO,
  seoUtils,
};
