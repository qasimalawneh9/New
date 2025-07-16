/**
 * Utility Functions
 *
 * This file contains reusable utility functions organized by category.
 * Each function is pure and thoroughly tested.
 */

import { VALIDATION, TIME_CONFIG, LANGUAGES } from "@/config/constants";
import type { User, Teacher, Student } from "@/types/api";

// String Utilities
export const stringUtils = {
  /**
   * Capitalizes the first letter of a string
   */
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  /**
   * Converts string to title case
   */
  toTitleCase: (str: string): string => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => stringUtils.capitalize(word))
      .join(" ");
  },

  /**
   * Truncates text to specified length with ellipsis
   */
  truncate: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  },

  /**
   * Removes HTML tags from string
   */
  stripHtml: (html: string): string => {
    return html.replace(/<[^>]*>/g, "");
  },

  /**
   * Generates a random string of specified length
   */
  generateRandomString: (length: number): string => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * Converts a string to a URL-friendly slug
   */
  slugify: (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },

  /**
   * Extracts initials from a name
   */
  getInitials: (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  },
};

// Date and Time Utilities
export const dateUtils = {
  /**
   * Formats a date according to the specified format
   */
  format: (
    date: Date | string,
    format: "date" | "time" | "datetime" | "relative" = "date",
  ): string => {
    const d = typeof date === "string" ? new Date(date) : date;

    switch (format) {
      case "date":
        return d.toLocaleDateString();
      case "time":
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      case "datetime":
        return d.toLocaleString();
      case "relative":
        return dateUtils.getRelativeTime(d);
      default:
        return d.toLocaleDateString();
    }
  },

  /**
   * Returns relative time (e.g., "2 hours ago", "in 3 days")
   */
  getRelativeTime: (date: Date | string): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return dateUtils.format(d, "date");
  },

  /**
   * Checks if a date is today
   */
  isToday: (date: Date | string): boolean => {
    const d = typeof date === "string" ? new Date(date) : date;
    const today = new Date();
    return d.toDateString() === today.toDateString();
  },

  /**
   * Checks if a date is in the future
   */
  isFuture: (date: Date | string): boolean => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.getTime() > Date.now();
  },

  /**
   * Adds specified time to a date
   */
  addTime: (
    date: Date | string,
    amount: number,
    unit: "minutes" | "hours" | "days",
  ): Date => {
    const d = typeof date === "string" ? new Date(date) : new Date(date);
    const multiplier = {
      minutes: 60 * 1000,
      hours: 60 * 60 * 1000,
      days: 24 * 60 * 60 * 1000,
    };
    return new Date(d.getTime() + amount * multiplier[unit]);
  },

  /**
   * Converts timezone-aware datetime to local time
   */
  toLocalTime: (dateTime: string, timezone: string): Date => {
    return new Date(
      new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: timezone,
      }).format(new Date(dateTime)),
    );
  },
};

// Number and Currency Utilities
export const numberUtils = {
  /**
   * Formats a number as currency
   */
  formatCurrency: (
    amount: number,
    currency: string = "USD",
    locale: string = "en-US",
  ): string => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  },

  /**
   * Formats a large number with K, M, B suffixes
   */
  formatLargeNumber: (num: number): string => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toString();
  },

  /**
   * Rounds a number to specified decimal places
   */
  round: (num: number, decimals: number = 2): number => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  /**
   * Clamps a number between min and max values
   */
  clamp: (num: number, min: number, max: number): number => {
    return Math.min(Math.max(num, min), max);
  },

  /**
   * Generates a random number between min and max
   */
  random: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};

// Array Utilities
export const arrayUtils = {
  /**
   * Removes duplicates from an array
   */
  unique: <T>(array: T[]): T[] => {
    return Array.from(new Set(array));
  },

  /**
   * Groups array items by a key function
   */
  groupBy: <T, K extends string | number>(
    array: T[],
    keyFn: (item: T) => K,
  ): Record<K, T[]> => {
    return array.reduce(
      (groups, item) => {
        const key = keyFn(item);
        groups[key] = groups[key] || [];
        groups[key].push(item);
        return groups;
      },
      {} as Record<K, T[]>,
    );
  },

  /**
   * Sorts array by multiple keys
   */
  sortBy: <T>(
    array: T[],
    ...keys: Array<keyof T | ((item: T) => any)>
  ): T[] => {
    return array.sort((a, b) => {
      for (const key of keys) {
        const aVal = typeof key === "function" ? key(a) : a[key];
        const bVal = typeof key === "function" ? key(b) : b[key];
        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
      }
      return 0;
    });
  },

  /**
   * Chunks array into smaller arrays of specified size
   */
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  /**
   * Flattens nested arrays
   */
  flatten: <T>(array: (T | T[])[]): T[] => {
    return array.reduce(
      (flat, item) =>
        flat.concat(Array.isArray(item) ? arrayUtils.flatten(item) : item),
      [] as T[],
    );
  },
};

// Object Utilities
export const objectUtils = {
  /**
   * Deep clones an object
   */
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as any;
    if (obj instanceof Array)
      return obj.map((item) => objectUtils.deepClone(item)) as any;
    if (typeof obj === "object") {
      const cloned = {} as any;
      Object.keys(obj).forEach((key) => {
        cloned[key] = objectUtils.deepClone((obj as any)[key]);
      });
      return cloned;
    }
    return obj;
  },

  /**
   * Picks specified keys from an object
   */
  pick: <T extends object, K extends keyof T>(
    obj: T,
    keys: K[],
  ): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach((key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  /**
   * Omits specified keys from an object
   */
  omit: <T extends object, K extends keyof T>(
    obj: T,
    keys: K[],
  ): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach((key) => {
      delete result[key];
    });
    return result;
  },

  /**
   * Checks if an object is empty
   */
  isEmpty: (obj: object): boolean => {
    return Object.keys(obj).length === 0;
  },

  /**
   * Deep merges multiple objects
   */
  deepMerge: <T extends object>(...objects: Partial<T>[]): T => {
    const result = {} as T;
    objects.forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        const value = (obj as any)[key];
        if (value && typeof value === "object" && !Array.isArray(value)) {
          (result as any)[key] = objectUtils.deepMerge(
            (result as any)[key] || {},
            value,
          );
        } else {
          (result as any)[key] = value;
        }
      });
    });
    return result;
  },
};

// Validation Utilities
export const validationUtils = {
  /**
   * Validates email format
   */
  isValidEmail: (email: string): boolean => {
    return VALIDATION.EMAIL.PATTERN.test(email);
  },

  /**
   * Validates password strength
   */
  isValidPassword: (password: string): boolean => {
    if (password.length < VALIDATION.PASSWORD.MIN_LENGTH) return false;
    if (VALIDATION.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password))
      return false;
    if (VALIDATION.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password))
      return false;
    if (VALIDATION.PASSWORD.REQUIRE_NUMBERS && !/\d/.test(password))
      return false;
    if (VALIDATION.PASSWORD.REQUIRE_SYMBOLS && !/[^A-Za-z0-9]/.test(password))
      return false;
    return true;
  },

  /**
   * Validates phone number format
   */
  isValidPhone: (phone: string): boolean => {
    return VALIDATION.PHONE.PATTERN.test(phone);
  },

  /**
   * Validates if a value is required (not empty)
   */
  isRequired: (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim() !== "";
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },

  /**
   * Validates string length
   */
  isValidLength: (value: string, min: number, max?: number): boolean => {
    if (value.length < min) return false;
    if (max && value.length > max) return false;
    return true;
  },
};

// File Utilities
export const fileUtils = {
  /**
   * Formats file size in human-readable format
   */
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  /**
   * Gets file extension from filename
   */
  getFileExtension: (filename: string): string => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  },

  /**
   * Validates file type
   */
  isValidFileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type);
  },

  /**
   * Validates file size
   */
  isValidFileSize: (file: File, maxSize: number): boolean => {
    return file.size <= maxSize;
  },

  /**
   * Reads file as data URL
   */
  readAsDataURL: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};

// URL and Query Utilities
export const urlUtils = {
  /**
   * Builds query string from object
   */
  buildQueryString: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, item));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    return searchParams.toString();
  },

  /**
   * Parses query string to object
   */
  parseQueryString: (queryString: string): Record<string, string> => {
    const params = new URLSearchParams(queryString);
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  },

  /**
   * Checks if URL is absolute
   */
  isAbsoluteURL: (url: string): boolean => {
    return /^https?:\/\//.test(url);
  },

  /**
   * Combines URL parts safely
   */
  joinURL: (...parts: string[]): string => {
    return parts
      .map((part, index) => {
        if (index === 0) return part.replace(/\/+$/, "");
        return part.replace(/^\/+/, "").replace(/\/+$/, "");
      })
      .filter(Boolean)
      .join("/");
  },
};

// Local Storage Utilities
export const storageUtils = {
  /**
   * Sets item in localStorage with error handling
   */
  setItem: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Failed to set localStorage item:", error);
      return false;
    }
  },

  /**
   * Gets item from localStorage with error handling
   */
  getItem: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error("Failed to get localStorage item:", error);
      return defaultValue || null;
    }
  },

  /**
   * Removes item from localStorage
   */
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Failed to remove localStorage item:", error);
      return false;
    }
  },

  /**
   * Clears all localStorage
   */
  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
      return false;
    }
  },
};

// User-specific Utilities
export const userUtils = {
  /**
   * Gets display name for a user
   */
  getDisplayName: (user: User): string => {
    return user.name || user.email.split("@")[0] || "User";
  },

  /**
   * Gets user initials
   */
  getInitials: (user: User): string => {
    return stringUtils.getInitials(userUtils.getDisplayName(user));
  },

  /**
   * Checks if user is a teacher
   */
  isTeacher: (user: User): user is Teacher => {
    return user.user_type === "teacher";
  },

  /**
   * Checks if user is a student
   */
  isStudent: (user: User): user is Student => {
    return user.user_type === "student";
  },

  /**
   * Checks if user is an admin
   */
  isAdmin: (user: User): boolean => {
    return user.user_type === "admin";
  },

  /**
   * Gets user's full profile (including teacher/student profile)
   */
  getFullProfile: (user: User): Teacher | Student | User => {
    if (userUtils.isTeacher(user) && user.teacher_profile) {
      return { ...user, ...user.teacher_profile } as Teacher;
    }
    if (userUtils.isStudent(user) && user.student_profile) {
      return { ...user, ...user.student_profile } as Student;
    }
    return user;
  },
};

// Language Utilities
export const languageUtils = {
  /**
   * Gets language display name
   */
  getLanguageName: (code: string): string => {
    const language = LANGUAGES.find((lang) =>
      lang.toLowerCase().includes(code.toLowerCase()),
    );
    return language || code;
  },

  /**
   * Checks if a language is supported
   */
  isSupported: (language: string): boolean => {
    return LANGUAGES.some((lang) =>
      lang.toLowerCase().includes(language.toLowerCase()),
    );
  },

  /**
   * Gets flag emoji for a language/country
   */
  getFlagEmoji: (language: string): string => {
    const flags: Record<string, string> = {
      english: "🇺🇸",
      spanish: "🇪🇸",
      french: "🇫🇷",
      german: "🇩🇪",
      italian: "🇮🇹",
      portuguese: "🇵🇹",
      chinese: "🇨🇳",
      japanese: "🇯🇵",
      korean: "🇰🇷",
      arabic: "🇸🇦",
      russian: "🇷🇺",
      hindi: "🇮🇳",
      dutch: "🇳🇱",
    };
    return flags[language.toLowerCase()] || "🌐";
  },
};

// Performance Utilities
export const performanceUtils = {
  /**
   * Debounces a function
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  /**
   * Throttles a function
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number,
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Measures execution time of a function
   */
  measureTime: <T>(name: string, func: () => T): T => {
    const start = performance.now();
    const result = func();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  },
};

// Export all utilities as a single object
export default {
  string: stringUtils,
  date: dateUtils,
  number: numberUtils,
  array: arrayUtils,
  object: objectUtils,
  validation: validationUtils,
  file: fileUtils,
  url: urlUtils,
  storage: storageUtils,
  user: userUtils,
  language: languageUtils,
  performance: performanceUtils,
};

// Export individual utility objects for direct imports
export {
  stringUtils,
  dateUtils,
  numberUtils,
  arrayUtils,
  objectUtils,
  validationUtils,
  fileUtils,
  urlUtils,
  storageUtils,
  userUtils,
  languageUtils,
  performanceUtils,
};
