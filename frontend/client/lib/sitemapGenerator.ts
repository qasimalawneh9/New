import { db } from "./database";

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
  alternates?: { hreflang: string; href: string }[];
}

export class SitemapGenerator {
  private baseUrl = "https://talkcon.com";

  generateSitemap(): string {
    const urls: SitemapUrl[] = [
      // Static pages
      ...this.getStaticUrls(),
      // Dynamic teacher profiles
      ...this.getTeacherUrls(),
      // Language-specific pages
      ...this.getLanguageUrls(),
    ];

    return this.generateXML(urls);
  }

  private getStaticUrls(): SitemapUrl[] {
    const now = new Date().toISOString();

    return [
      {
        loc: this.baseUrl,
        lastmod: now,
        changefreq: "daily",
        priority: 1.0,
        alternates: [
          { hreflang: "en", href: `${this.baseUrl}/` },
          { hreflang: "es", href: `${this.baseUrl}/es/` },
          { hreflang: "fr", href: `${this.baseUrl}/fr/` },
          { hreflang: "de", href: `${this.baseUrl}/de/` },
        ],
      },
      {
        loc: `${this.baseUrl}/teachers`,
        lastmod: now,
        changefreq: "daily",
        priority: 0.9,
      },
      {
        loc: `${this.baseUrl}/how-it-works`,
        lastmod: now,
        changefreq: "weekly",
        priority: 0.9,
      },
      {
        loc: `${this.baseUrl}/teach`,
        lastmod: now,
        changefreq: "weekly",
        priority: 0.9,
      },
      {
        loc: `${this.baseUrl}/pricing`,
        lastmod: now,
        changefreq: "weekly",
        priority: 0.8,
      },
      {
        loc: `${this.baseUrl}/languages`,
        lastmod: now,
        changefreq: "weekly",
        priority: 0.8,
      },
      {
        loc: `${this.baseUrl}/community`,
        lastmod: now,
        changefreq: "daily",
        priority: 0.7,
      },
      {
        loc: `${this.baseUrl}/help`,
        lastmod: now,
        changefreq: "weekly",
        priority: 0.6,
      },
      {
        loc: `${this.baseUrl}/contact`,
        lastmod: now,
        changefreq: "monthly",
        priority: 0.6,
      },
      {
        loc: `${this.baseUrl}/privacy`,
        lastmod: "2024-01-01T00:00:00+00:00",
        changefreq: "monthly",
        priority: 0.3,
      },
      {
        loc: `${this.baseUrl}/terms`,
        lastmod: "2024-01-01T00:00:00+00:00",
        changefreq: "monthly",
        priority: 0.3,
      },
    ];
  }

  private getTeacherUrls(): SitemapUrl[] {
    const teachers = db.getTeachers({ status: "approved" });

    return teachers.map((teacher) => ({
      loc: `${this.baseUrl}/teachers/${this.slugify(teacher.name)}-${teacher.id}`,
      lastmod: teacher.updatedAt || new Date().toISOString(),
      changefreq: "weekly" as const,
      priority: 0.7,
    }));
  }

  private getLanguageUrls(): SitemapUrl[] {
    const languages = [
      "english",
      "spanish",
      "french",
      "german",
      "italian",
      "portuguese",
      "chinese",
      "japanese",
      "korean",
      "arabic",
      "russian",
      "dutch",
    ];

    return languages.map((language) => ({
      loc: `${this.baseUrl}/teachers?language=${language}`,
      lastmod: new Date().toISOString(),
      changefreq: "daily" as const,
      priority: 0.8,
    }));
  }

  private generateXML(urls: SitemapUrl[]): string {
    const xmlUrls = urls.map((url) => this.generateUrlXML(url)).join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlUrls}
</urlset>`;
  }

  private generateUrlXML(url: SitemapUrl): string {
    let xml = `  <url>
    <loc>${this.escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>`;

    if (url.alternates) {
      url.alternates.forEach((alternate) => {
        xml += `\n    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${this.escapeXml(alternate.href)}" />`;
      });
    }

    xml += "\n  </url>";
    return xml;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (char) => {
      switch (char) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case "'":
          return "&apos;";
        case '"':
          return "&quot;";
        default:
          return char;
      }
    });
  }

  // Generate robots.txt content
  generateRobotsTxt(): string {
    return `# Robots.txt for Talkcon Language Learning Marketplace
User-agent: *
Allow: /

# Allow important pages for SEO
Allow: /teachers
Allow: /teachers/*
Allow: /languages
Allow: /how-it-works
Allow: /pricing
Allow: /teach
Allow: /help
Allow: /contact
Allow: /community

# Disallow admin and private areas
Disallow: /admin*
Disallow: /dashboard*
Disallow: /teacher-dashboard*
Disallow: /settings*
Disallow: /login*
Disallow: /signup*
Disallow: /forgot-password*
Disallow: /teacher-application*
Disallow: /lesson/*
Disallow: /booking/*
Disallow: /messages*

# Allow media files
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.png
Allow: /*.gif
Allow: /*.webp
Allow: /*.svg
Allow: /*.ico
Allow: /*.css
Allow: /*.js

Crawl-delay: 1
Sitemap: ${this.baseUrl}/sitemap.xml`;
  }
}

export const sitemapGenerator = new SitemapGenerator();
