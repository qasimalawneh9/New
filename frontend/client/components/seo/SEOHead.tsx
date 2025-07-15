import { useEffect } from "react";

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: "summary" | "summary_large_image";
  canonical?: string;
  noindex?: boolean;
  structured?: any;
  alternateLanguages?: { hreflang: string; href: string }[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = "language learning, online tutoring, language teachers, English lessons, Spanish lessons, French lessons, language marketplace, conversational practice, professional tutoring",
  ogTitle,
  ogDescription,
  ogImage = "/og-image.jpg",
  ogUrl,
  twitterCard = "summary_large_image",
  canonical,
  noindex = false,
  structured,
  alternateLanguages = [],
}) => {
  useEffect(() => {
    // Set document title
    document.title = title.includes("Talkcon")
      ? title
      : `${title} | Talkcon - Learn Languages with Expert Tutors`;

    // Update meta tags
    updateMetaTag("name", "description", description);
    updateMetaTag("name", "keywords", keywords);
    updateMetaTag("name", "author", "Talkcon");
    updateMetaTag(
      "name",
      "viewport",
      "width=device-width, initial-scale=1.0, viewport-fit=cover",
    );

    // Open Graph tags
    updateMetaTag("property", "og:title", ogTitle || title);
    updateMetaTag("property", "og:description", ogDescription || description);
    updateMetaTag("property", "og:image", ogImage);
    updateMetaTag("property", "og:url", ogUrl || window.location.href);
    updateMetaTag("property", "og:type", "website");
    updateMetaTag("property", "og:site_name", "Talkcon");
    updateMetaTag("property", "og:locale", "en_US");

    // Twitter Card tags
    updateMetaTag("name", "twitter:card", twitterCard);
    updateMetaTag("name", "twitter:title", ogTitle || title);
    updateMetaTag("name", "twitter:description", ogDescription || description);
    updateMetaTag("name", "twitter:image", ogImage);
    updateMetaTag("name", "twitter:site", "@Talkcon");

    // Additional SEO tags
    updateMetaTag(
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow",
    );
    updateMetaTag("name", "theme-color", "#dc2626");
    updateMetaTag("name", "msapplication-TileColor", "#dc2626");

    // Canonical URL
    updateLinkTag("canonical", canonical || window.location.href);

    // Alternate language versions
    alternateLanguages.forEach((lang) => {
      updateLinkTag("alternate", lang.href, lang.hreflang);
    });

    // Structured data
    if (structured) {
      updateStructuredData(structured);
    }

    // Preconnect to external domains for performance
    updateLinkTag("preconnect", "https://fonts.googleapis.com");
    updateLinkTag("preconnect", "https://fonts.gstatic.com", undefined, true);
    updateLinkTag("dns-prefetch", "https://api.talkcon.com");
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    canonical,
    noindex,
    structured,
    alternateLanguages,
  ]);

  return null;
};

function updateMetaTag(
  attribute: "name" | "property",
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
) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    if (hreflang) element.setAttribute("hreflang", hreflang);
    if (crossorigin) element.setAttribute("crossorigin", "");
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function updateStructuredData(data: any) {
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }

  // Add new structured data
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

// Common structured data schemas
export const createWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Talkcon",
  alternateName: "Talkcon Language Learning",
  url: "https://talkcon.com",
  description:
    "Learn languages with expert tutors through personalized online lessons. Connect with native speakers and certified teachers for conversation practice, grammar, and fluency building.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://talkcon.com/teachers?search={search_term_string}",
    "query-input": "required name=search_term_string",
  },
  sameAs: [
    "https://twitter.com/talkcon",
    "https://facebook.com/talkcon",
    "https://instagram.com/talkcon",
    "https://linkedin.com/company/talkcon",
  ],
});

export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Talkcon",
  url: "https://talkcon.com",
  logo: "https://talkcon.com/logo.png",
  description:
    "Premier online language learning marketplace connecting students with expert tutors worldwide",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-555-TALKCON",
    contactType: "customer service",
    availableLanguage: [
      "English",
      "Spanish",
      "French",
      "German",
      "Italian",
      "Portuguese",
      "Chinese",
      "Japanese",
      "Korean",
      "Arabic",
      "Russian",
      "Dutch",
    ],
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
  sameAs: [
    "https://twitter.com/talkcon",
    "https://facebook.com/talkcon",
    "https://instagram.com/talkcon",
  ],
});

export const createTeacherSchema = (teacher: any) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: teacher.name,
  jobTitle: "Language Tutor",
  description: teacher.bio,
  image: teacher.avatar,
  worksFor: {
    "@type": "Organization",
    name: "Talkcon",
  },
  knowsLanguage: teacher.languages,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: teacher.rating,
    reviewCount: teacher.reviewCount || 0,
    bestRating: 5,
    worstRating: 1,
  },
  offers: {
    "@type": "Offer",
    price: teacher.price,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
});

export const createCourseSchema = (lesson: any) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name: lesson.title || "Language Lesson",
  description: lesson.description || "Professional language tutoring session",
  provider: {
    "@type": "Organization",
    name: "Talkcon",
  },
  instructor: {
    "@type": "Person",
    name: lesson.teacherName,
  },
  educationalLevel: lesson.level,
  inLanguage: lesson.language,
  offers: {
    "@type": "Offer",
    price: lesson.price,
    priceCurrency: "USD",
  },
});

export const createBreadcrumbSchema = (
  items: { name: string; url: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
