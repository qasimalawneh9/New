import { useEffect } from "react";

// Advanced Schema Markup for Rich Snippets and Featured Snippets

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ReviewItem {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  language?: string;
}

export interface CourseItem {
  name: string;
  description: string;
  provider: string;
  instructor?: string;
  language: string;
  level: string;
  price: number;
  currency: string;
  duration?: string;
  url: string;
}

export interface TeacherProfile {
  name: string;
  bio: string;
  languages: string[];
  nativeLanguage: string;
  experience: number;
  rating: number;
  reviewCount: number;
  price: number;
  specialties: string[];
  education?: string[];
  certifications?: string[];
  image?: string;
  url: string;
}

export interface EventItem {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: "online";
  instructor: string;
  language: string;
  price?: number;
  maxParticipants?: number;
  url: string;
}

// FAQ Schema for Featured Snippets
export const createFAQSchema = (faqs: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

// Review Schema for Trust Signals
export const createReviewSchema = (
  reviews: ReviewItem[],
  itemName: string,
  itemType: string = "Service",
) => ({
  "@context": "https://schema.org",
  "@type": itemType,
  name: itemName,
  review: reviews.map((review) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.author,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
    inLanguage: review.language || "en",
  })),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1),
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
  },
});

// Course Schema for Educational Content
export const createCourseSchema = (course: CourseItem) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name: course.name,
  description: course.description,
  provider: {
    "@type": "Organization",
    name: course.provider,
    url: "https://talkcon.com",
  },
  instructor: course.instructor
    ? {
        "@type": "Person",
        name: course.instructor,
      }
    : undefined,
  inLanguage: course.language,
  educationalLevel: course.level,
  coursePrerequisites:
    course.level === "Beginner" ? "None" : `Basic ${course.language} knowledge`,
  timeRequired: course.duration,
  url: course.url,
  offers: {
    "@type": "Offer",
    price: course.price,
    priceCurrency: course.currency,
    availability: "https://schema.org/InStock",
    validFrom: new Date().toISOString(),
    priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  teaches: `${course.language} language skills including speaking, listening, reading, and writing`,
  courseMode: "online",
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseSchedule: "Flexible scheduling available 24/7",
  },
});

// Enhanced Teacher Schema for Person Rich Snippets
export const createTeacherSchema = (teacher: TeacherProfile) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: teacher.name,
  description: teacher.bio,
  image: teacher.image,
  url: teacher.url,
  jobTitle: `${teacher.languages.join(", ")} Language Instructor`,
  worksFor: {
    "@type": "Organization",
    name: "Talkcon",
    url: "https://talkcon.com",
  },
  knowsLanguage: teacher.languages.map((lang) => ({
    "@type": "Language",
    name: lang,
    alternateName: lang,
  })),
  homeLocation: {
    "@type": "Place",
    name: `Native ${teacher.nativeLanguage} Speaker`,
  },
  hasCredential: teacher.certifications?.map((cert) => ({
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "certification",
    name: cert,
  })),
  alumniOf: teacher.education?.map((edu) => ({
    "@type": "EducationalOrganization",
    name: edu,
  })),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: teacher.rating,
    reviewCount: teacher.reviewCount,
    bestRating: 5,
    worstRating: 1,
  },
  offers: {
    "@type": "Offer",
    price: teacher.price,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    itemOffered: {
      "@type": "Service",
      name: `${teacher.languages.join("/")} Language Tutoring`,
      description: `Professional ${teacher.languages.join(" and ")} language instruction with ${teacher.experience} years of teaching experience`,
      serviceType: "Language Education",
      areaServed: "Worldwide",
      hoursAvailable: "Mo-Su 00:00-23:59",
    },
  },
  specialty: teacher.specialties,
  yearExperience: teacher.experience,
});

// Event Schema for Live Sessions
export const createEventSchema = (event: EventItem) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: event.name,
  description: event.description,
  startDate: event.startDate,
  endDate: event.endDate,
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  location: {
    "@type": "VirtualLocation",
    url: event.url,
    name: "Talkcon Virtual Classroom",
  },
  instructor: {
    "@type": "Person",
    name: event.instructor,
  },
  inLanguage: event.language,
  organizer: {
    "@type": "Organization",
    name: "Talkcon",
    url: "https://talkcon.com",
  },
  offers: event.price
    ? {
        "@type": "Offer",
        price: event.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: event.url,
      }
    : {
        "@type": "Offer",
        price: 0,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
  maximumAttendeeCapacity: event.maxParticipants,
  eventStatus: "https://schema.org/EventScheduled",
  typicalAgeRange: "16-99",
});

// Breadcrumb Schema for Navigation
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

// How-To Schema for Educational Content
export const createHowToSchema = (
  name: string,
  steps: { name: string; text: string; image?: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: name,
  description: `Learn ${name.toLowerCase()} with expert guidance and proven methods`,
  totalTime: "PT30M",
  supply: [
    "Computer or mobile device",
    "Internet connection",
    "Notebook (optional)",
  ],
  tool: [
    "Talkcon platform",
    "Video chat software",
    "Language learning materials",
  ],
  step: steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.name,
    text: step.text,
    image: step.image,
  })),
});

// Organization Schema with Enhanced Trust Signals
export const createEnhancedOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Talkcon",
  alternateName: "Talkcon Language Learning Platform",
  url: "https://talkcon.com",
  logo: "https://talkcon.com/logo.png",
  description:
    "Leading online language learning marketplace connecting students with certified native speakers and expert tutors worldwide. Personalized lessons, conversation practice, and cultural immersion in 50+ languages.",
  foundingDate: "2024",
  founder: {
    "@type": "Person",
    name: "Talkcon Team",
  },
  numberOfEmployees: "50-100",
  slogan: "Speak Any Language, Connect Any Culture",
  contactPoint: [
    {
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
      hoursAvailable: "Mo-Su 00:00-23:59",
    },
    {
      "@type": "ContactPoint",
      email: "support@talkcon.com",
      contactType: "customer support",
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
  sameAs: [
    "https://twitter.com/talkcon",
    "https://facebook.com/talkcon",
    "https://instagram.com/talkcon",
    "https://linkedin.com/company/talkcon",
    "https://youtube.com/talkcon",
  ],
  areaServed: {
    "@type": "Place",
    name: "Worldwide",
  },
  serviceArea: {
    "@type": "Place",
    name: "Global",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Language Learning Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "One-on-One Language Tutoring",
          description: "Personalized language lessons with certified teachers",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Conversation Practice Sessions",
          description: "Real-world conversation practice with native speakers",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Business Language Coaching",
          description: "Professional language training for business contexts",
        },
      },
    ],
  },
  award: [
    "Best Language Learning Platform 2024",
    "Top Rated Online Education Service",
    "Excellence in Language Education",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.8,
    reviewCount: 15000,
    bestRating: 5,
    worstRating: 1,
  },
});

// Service Schema for Main Offering
export const createServiceSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Online Language Learning Platform",
  alternateName: "Language Tutoring Marketplace",
  description:
    "Connect with certified language teachers for personalized online lessons. Learn any language through conversation practice, structured lessons, and cultural immersion with native speakers.",
  provider: {
    "@type": "Organization",
    name: "Talkcon",
  },
  serviceType: "Educational Services",
  areaServed: "Worldwide",
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
  hoursAvailable: "Mo-Su 00:00-23:59",
  isRelatedTo: [
    "Language Education",
    "Online Tutoring",
    "Conversation Practice",
    "Cultural Exchange",
  ],
  category: "Education",
  audience: {
    "@type": "Audience",
    audienceType: "Language Learners",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Language Learning Programs",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Trial Lesson",
        price: 1,
        priceCurrency: "USD",
        description: "30-minute trial lesson with any teacher",
      },
      {
        "@type": "Offer",
        name: "Individual Lessons",
        priceRange: "$10-$50",
        priceCurrency: "USD",
        description: "Personalized one-on-one language lessons",
      },
      {
        "@type": "Offer",
        name: "Lesson Packages",
        priceRange: "$100-$500",
        priceCurrency: "USD",
        description: "Discounted lesson packages for regular study",
      },
    ],
  },
});

// Component for injecting schema markup
interface AdvancedSchemaProps {
  faqs?: FAQItem[];
  reviews?: ReviewItem[];
  course?: CourseItem;
  teacher?: TeacherProfile;
  event?: EventItem;
  breadcrumbs?: { name: string; url: string }[];
  howToSteps?: { name: string; text: string; image?: string }[];
  howToTitle?: string;
  includeOrganization?: boolean;
  includeService?: boolean;
}

export const AdvancedSchema: React.FC<AdvancedSchemaProps> = ({
  faqs,
  reviews,
  course,
  teacher,
  event,
  breadcrumbs,
  howToSteps,
  howToTitle,
  includeOrganization = false,
  includeService = false,
}) => {
  useEffect(() => {
    const schemas = [];

    if (faqs && faqs.length > 0) {
      schemas.push(createFAQSchema(faqs));
    }

    if (reviews && reviews.length > 0) {
      schemas.push(createReviewSchema(reviews, "Talkcon Language Learning"));
    }

    if (course) {
      schemas.push(createCourseSchema(course));
    }

    if (teacher) {
      schemas.push(createTeacherSchema(teacher));
    }

    if (event) {
      schemas.push(createEventSchema(event));
    }

    if (breadcrumbs) {
      schemas.push(createBreadcrumbSchema(breadcrumbs));
    }

    if (howToSteps && howToTitle) {
      schemas.push(createHowToSchema(howToTitle, howToSteps));
    }

    if (includeOrganization) {
      schemas.push(createEnhancedOrganizationSchema());
    }

    if (includeService) {
      schemas.push(createServiceSchema());
    }

    // Remove existing schema script
    const existingScript = document.querySelector(
      'script[data-schema="advanced"]',
    );
    if (existingScript) {
      existingScript.remove();
    }

    // Add new schema script if we have schemas
    if (schemas.length > 0) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-schema", "advanced");
      script.textContent = JSON.stringify(
        schemas.length === 1 ? schemas[0] : schemas,
      );
      document.head.appendChild(script);
    }

    return () => {
      const script = document.querySelector('script[data-schema="advanced"]');
      if (script) {
        script.remove();
      }
    };
  }, [
    faqs,
    reviews,
    course,
    teacher,
    event,
    breadcrumbs,
    howToSteps,
    howToTitle,
    includeOrganization,
    includeService,
  ]);

  return null;
};
