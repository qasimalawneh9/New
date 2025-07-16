import React from "react";
import { Check, Globe } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useLanguage, languages, Language } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  variant?: "default" | "minimal" | "compact";
  showFlag?: boolean;
  showLabel?: boolean;
  align?: "start" | "center" | "end";
  className?: string;
}

export function LanguageSwitcher({
  variant = "default",
  showFlag = true,
  showLabel = true,
  align = "end",
  className,
}: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();

  const currentLanguage = languages.find((lang) => lang.code === language);

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);

    // Update document direction for RTL languages
    if (langCode === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = langCode;
    }

    // Update page title based on language
    const titles = {
      en: "Talkcon - Learn Languages with Native Speakers",
      ar: "تولكون - تعلم اللغات مع المتحدثين الأصليين",
      es: "Talkcon - Aprende Idiomas con Hablantes Nativos",
      fr: "Talkcon - Apprenez les Langues avec des Locuteurs Natifs",
      de: "Talkcon - Sprachen mit Muttersprachlern Lernen",
      zh: "Talkcon - 与母语人士学习语言",
    };
    document.title = titles[langCode] || titles.en;
  };

  if (variant === "minimal") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-8 w-8 p-0", className)}
          >
            <Globe className="h-4 w-4" />
            <span className="sr-only">{t("language.change")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} className="min-w-[140px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center gap-2"
            >
              <span className="text-base">{lang.flag}</span>
              <span className="flex-1">{lang.name}</span>
              {language === lang.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("h-8 gap-1", className)}
          >
            {showFlag && (
              <span className="text-sm">{currentLanguage?.flag}</span>
            )}
            <span className="text-xs font-medium">
              {currentLanguage?.code.toUpperCase()}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} className="min-w-[140px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center gap-2"
            >
              <span className="text-base">{lang.flag}</span>
              <span className="flex-1">{lang.name}</span>
              {language === lang.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("gap-2", className)}>
          <Globe className="h-4 w-4" />
          {showFlag && (
            <span className="text-base">{currentLanguage?.flag}</span>
          )}
          {showLabel && (
            <span className="font-medium">{currentLanguage?.name}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[160px]">
        <div className="p-2">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            {t("language.select")}
          </div>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent"
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex-1">
                <div className="font-medium">{lang.name}</div>
                <div className="text-xs text-muted-foreground">
                  {lang.code.toUpperCase()}
                </div>
              </div>
              {language === lang.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Utility component for language-specific styling
export function LanguageAwareText({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { language } = useLanguage();

  return (
    <div
      className={cn(
        // RTL support for Arabic
        language === "ar" && "text-right",
        // Font optimizations for different languages
        language === "ar" && "font-arabic",
        language === "zh" && "font-chinese",
        className,
      )}
      dir={language === "ar" ? "rtl" : "ltr"}
      {...props}
    >
      {children}
    </div>
  );
}

export default LanguageSwitcher;
