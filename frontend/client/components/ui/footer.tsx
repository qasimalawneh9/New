import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import { Button } from "./button";

export function Footer() {
  const { t } = useLanguage();

  const footerSections = [
    {
      title: "For Students",
      links: [
        { label: "Find Teachers", href: "/teachers" },
        { label: "How it Works", href: "/how-it-works" },
        { label: "Pricing", href: "/pricing" },
        { label: "Languages", href: "/languages" },
        { label: "Trial Lessons", href: "/teachers?trial=true" },
      ],
    },
    {
      title: "For Teachers",
      links: [
        { label: "Become a Teacher", href: "/teach" },
        { label: "Teacher Resources", href: "/teacher-resources" },
        { label: "Teacher Support", href: "/teacher-support" },
        { label: "Apply Now", href: "/teacher-application" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
        { label: "Blog", href: "/blog" },
        { label: "Partnerships", href: "/partnerships" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Contact Us", href: "/contact" },
        { label: "Safety", href: "/safety" },
      ],
    },
    {
      title: "Legal",
      links: [{ label: "Legal Center", href: "/legal" }],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/talkcon", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/talkcon", label: "Twitter" },
    {
      icon: Instagram,
      href: "https://instagram.com/talkcon",
      label: "Instagram",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/talkcon",
      label: "LinkedIn",
    },
    { icon: Youtube, href: "https://youtube.com/talkcon", label: "YouTube" },
  ];

  return (
    <footer className="bg-white text-foreground border-t border-border">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 shadow-lg transform rotate-3">
                <div className="absolute inset-0.5 rounded-lg bg-gradient-to-br from-red-500/90 to-red-800/90">
                  <div className="absolute top-1 left-1 w-3 h-2.5 bg-white/90 rounded-sm"></div>
                  <div className="absolute top-2.5 right-1 w-2.5 h-2 bg-white/70 rounded-sm"></div>
                  <div className="absolute bottom-1.5 left-1.5 w-2 h-1.5 bg-white/50 rounded-sm"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white font-bold text-sm leading-none">
                      T
                    </div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full shadow-sm"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent tracking-tight">
                  Talkcon
                </span>
                <span className="text-xs text-muted-foreground -mt-1 tracking-wider">
                  CONNECT
                </span>
              </div>
            </Link>

            <p className="text-muted-foreground text-sm mb-6 leading-relaxed max-w-md">
              The world's leading platform for learning languages with certified
              native speakers. Connect, learn, and master any language with
              personalized 1-on-1 lessons.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@talkcon.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">
                Stay Updated
              </h3>
              <p className="text-sm text-muted-foreground mb-4 md:mb-0">
                Get the latest updates on new teachers, features, and language
                learning tips.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="flex flex-1 md:w-80">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button
                  className="rounded-l-none bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-sm text-muted-foreground text-center md:text-left">
              <p>{t("footer.copyright")}</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 transform hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-4 text-sm">
              <Link
                to="/legal"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Legal Center
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                to="/legal#privacy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                to="/legal#terms"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
