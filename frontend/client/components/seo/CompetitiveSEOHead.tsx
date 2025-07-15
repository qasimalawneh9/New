import { useEffect } from "react";
import { primaryKeywords } from "@/lib/competitiveSEO";
import { TalkconSEOManager, seoUtils } from "@/lib/seoConfig";

export interface CompetitiveSEOHeadProps {
  // Basic SEO
  title: string;
  description: string;
  keywords?: string;

  // Advanced SEO
  h1Text?: string;
  targetKeywords?: string[];
  competitorKeywords?: string[];
  semanticKeywords?: string[];

  // Technical SEO
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;

  // Open Graph Enhanced
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogUrl?: string;
  ogType?: string;
  ogSiteName?: string;

  // Twitter Enhanced
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImageAlt?: string;
  twitterSite?: string;
  twitterCreator?: string;

  // Rich Snippets
  structured?: any;
  breadcrumbs?: { name: string; url: string }[];

  // Language/Internationalization
  language?: string;
  alternateLanguages?: { hreflang: string; href: string }[];

  // Performance
  preloadImages?: string[];
  prefetchUrls?: string[];

  // Competitive Advantages
  emphasizeUSPs?: boolean;
  targetCompetitorKeywords?: boolean;
}

export const CompetitiveSEOHead: React.FC<CompetitiveSEOHeadProps> = ({
  title,
  description,
  keywords,
  h1Text,
  targetKeywords = [],
  competitorKeywords = [],
  semanticKeywords = [],
  canonical,
  noindex = false,
  nofollow = false,
  ogTitle,
  ogDescription,
  ogImage = "/og-image-competitive.jpg",
  ogImageAlt,
  ogUrl,
  ogType = "website",
  ogSiteName = "Talkcon",
  twitterCard = "summary_large_image",
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterImageAlt,
  twitterSite = "@Talkcon",
  twitterCreator = "@Talkcon",
  structured,
  breadcrumbs = [],
  language = "en",
  alternateLanguages = [],
  preloadImages = [],
  prefetchUrls = [],
  emphasizeUSPs = true,
  targetCompetitorKeywords = true,
}) => {
  useEffect(() => {
    // Enhanced title with competitive keywords
    let enhancedTitle = title;
    if (targetCompetitorKeywords && competitorKeywords.length > 0) {
      const mainKeyword = competitorKeywords[0];
      if (!title.toLowerCase().includes(mainKeyword.toLowerCase())) {
        enhancedTitle = `${title} | ${mainKeyword}`;
      }
    }

    // Ensure title includes brand and competitive advantage
    if (!enhancedTitle.includes("Talkcon")) {
      enhancedTitle = `${enhancedTitle} | Talkcon`;
    }

    document.title = enhancedTitle;

    // Enhanced keywords with competitive and semantic keywords
    const allKeywords = [
      ...(keywords ? keywords.split(", ") : []),
      ...targetKeywords,
      ...competitorKeywords,
      ...semanticKeywords,
      // Add competitive advantage keywords
      "trial lessons from $1",
      "native speaker teachers",
      "24/7 availability",
      "money back guarantee",
      "verified tutors",
      "conversation practice",
      "cultural immersion",
    ]
      .filter(Boolean)
      .join(", ");

    // Enhanced description with USPs
    let enhancedDescription = description;
    if (emphasizeUSPs) {
      const uspPhrases = [
        "trial lessons from $1",
        "native speakers",
        "24/7 availability",
        "money-back guarantee",
      ];

      // Add USP if not already in description
      uspPhrases.forEach((usp) => {
        if (!enhancedDescription.toLowerCase().includes(usp.toLowerCase())) {
          if (enhancedDescription.length + usp.length < 155) {
            enhancedDescription = `${enhancedDescription} ${usp.charAt(0).toUpperCase() + usp.slice(1)}.`;
          }
        }
      });
    }

    // Update meta tags
    updateMetaTag("name", "description", enhancedDescription);
    updateMetaTag("name", "keywords", allKeywords);
    updateMetaTag("name", "author", "Talkcon Language Learning Platform");
    updateMetaTag(
      "name",
      "robots",
      `${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}, max-snippet:160, max-image-preview:large`,
    );

    // Language and regional targeting
    updateMetaTag("name", "language", language);
    updateMetaTag("http-equiv", "content-language", language);
    updateMetaTag("name", "geo.region", "US");
    updateMetaTag("name", "geo.placename", "United States");

    // Enhanced Open Graph
    updateMetaTag("property", "og:title", ogTitle || enhancedTitle);
    updateMetaTag(
      "property",
      "og:description",
      ogDescription || enhancedDescription,
    );
    updateMetaTag("property", "og:image", ogImage);
    updateMetaTag(
      "property",
      "og:image:alt",
      ogImageAlt || `${ogTitle || title} - Talkcon Language Learning`,
    );
    updateMetaTag("property", "og:url", ogUrl || window.location.href);
    updateMetaTag("property", "og:type", ogType);
    updateMetaTag("property", "og:site_name", ogSiteName);
    updateMetaTag(
      "property",
      "og:locale",
      language === "en" ? "en_US" : language,
    );
    updateMetaTag("property", "og:image:width", "1200");
    updateMetaTag("property", "og:image:height", "630");
    updateMetaTag("property", "og:image:type", "image/jpeg");

    // Enhanced Twitter Cards
    updateMetaTag("name", "twitter:card", twitterCard);
    updateMetaTag("name", "twitter:site", twitterSite);
    updateMetaTag("name", "twitter:creator", twitterCreator);
    updateMetaTag(
      "name",
      "twitter:title",
      twitterTitle || ogTitle || enhancedTitle,
    );
    updateMetaTag(
      "name",
      "twitter:description",
      twitterDescription || ogDescription || enhancedDescription,
    );
    updateMetaTag("name", "twitter:image", twitterImage || ogImage);
    updateMetaTag(
      "name",
      "twitter:image:alt",
      twitterImageAlt || ogImageAlt || `${title} - Language Learning Platform`,
    );

    // Additional competitive meta tags
    updateMetaTag("name", "application-name", "Talkcon");
    updateMetaTag("name", "apple-mobile-web-app-title", "Talkcon");
    updateMetaTag("name", "theme-color", "#dc2626");
    updateMetaTag("name", "msapplication-TileColor", "#dc2626");
    updateMetaTag("name", "apple-mobile-web-app-capable", "yes");
    updateMetaTag("name", "mobile-web-app-capable", "yes");

    // Canonical URL
    updateLinkTag("canonical", canonical || window.location.href.split("?")[0]);

    // Alternate language versions
    alternateLanguages.forEach((lang) => {
      updateLinkTag("alternate", lang.href, lang.hreflang);
    });

    // Default alternates for major languages
    const defaultAlternates = [
      { hreflang: "en", href: window.location.href },
      {
        hreflang: "es",
        href: window.location.href.replace(/\.com/, ".com/es"),
      },
      {
        hreflang: "fr",
        href: window.location.href.replace(/\.com/, ".com/fr"),
      },
      {
        hreflang: "de",
        href: window.location.href.replace(/\.com/, ".com/de"),
      },
      { hreflang: "x-default", href: window.location.href },
    ];

    defaultAlternates.forEach((lang) => {
      if (!alternateLanguages.find((al) => al.hreflang === lang.hreflang)) {
        updateLinkTag("alternate", lang.href, lang.hreflang);
      }
    });

    // Performance optimizations
    preloadImages.forEach((imageUrl) => {
      updateLinkTag("preload", imageUrl, undefined, false, "image");
    });

    prefetchUrls.forEach((url) => {
      updateLinkTag("prefetch", url);
    });

    // Preconnect to performance-critical domains
    updateLinkTag("preconnect", "https://fonts.googleapis.com");
    updateLinkTag("preconnect", "https://fonts.gstatic.com", undefined, true);
    updateLinkTag("preconnect", "https://cdnjs.cloudflare.com");
    updateLinkTag("dns-prefetch", "https://api.talkcon.com");
    updateLinkTag("dns-prefetch", "https://images.talkcon.com");

    // Structured data
    if (structured) {
      updateStructuredData(structured);
    }

    // Breadcrumb structured data
    if (breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      };
      updateStructuredData(breadcrumbSchema, "breadcrumb");
    }
  }, [
    title,
    description,
    keywords,
    targetKeywords,
    competitorKeywords,
    semanticKeywords,
    canonical,
    noindex,
    nofollow,
    ogTitle,
    ogDescription,
    ogImage,
    ogImageAlt,
    ogUrl,
    structured,
    breadcrumbs,
    language,
    alternateLanguages,
    emphasizeUSPs,
    targetCompetitorKeywords,
  ]);

  return null;
};

function updateMetaTag(
  attribute: "name" | "property" | "http-equiv",
  value: string,
  content: string,
) {
  let element = document.querySelector(`meta[${attribute}="${value}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function updateLinkTag(
  rel: string,
  href: string,
  hreflang?: string,
  crossorigin?: boolean,
  as?: string,
) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"][href="${href}"]`;

  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    if (hreflang) element.setAttribute("hreflang", hreflang);
    if (crossorigin) element.setAttribute("crossorigin", "");
    if (as) element.setAttribute("as", as);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function updateStructuredData(data: any, id: string = "main") {
  // Remove existing structured data with same ID
  const existing = document.querySelector(`script[data-schema-id="${id}"]`);
  if (existing) {
    existing.remove();
  }

  // Add new structured data
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.setAttribute("data-schema-id", id);
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

// Export competitive keyword helpers
export const getCompetitorTargetKeywords = (page: string) => {
  return primaryKeywords
    .filter((kw) => kw.opportunity === "high" && kw.intent === "commercial")
    .slice(0, 5)
    .map((kw) => kw.keyword);
};

export const getSemanticKeywords = (mainKeyword: string) => {
  const semanticMap: { [key: string]: string[] } = {
    "language learning": [
      "language acquisition",
      "second language learning",
      "foreign language study",
      "multilingual education",
    ],
    "online tutoring": [
      "virtual lessons",
      "remote teaching",
      "digital learning",
      "e-learning platform",
    ],
    "conversation practice": [
      "speaking practice",
      "oral communication",
      "dialogue training",
      "conversational fluency",
    ],
    "native speaker": [
      "mother tongue speaker",
      "native language teacher",
      "authentic pronunciation",
      "cultural immersion",
    ],
  };

  return semanticMap[mainKeyword.toLowerCase()] || [];
};

// Standalone SEO configuration helper
export const createSEOConfig = (pageKey: string, language?: string) => {
  return new TalkconSEOManager(pageKey, language);
};

// Content optimization helper
export const optimizePageContent = (content: string, pageKey: string) => {
  const seoManager = new TalkconSEOManager(pageKey);
  const targetKeywords = seoManager.getTargetKeywords();
  return seoUtils.optimizeContent(content, targetKeywords);
};
