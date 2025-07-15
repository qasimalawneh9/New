import { LANGUAGES, PAYMENT_METHODS, TIMEZONES } from "@/lib/constants";

// Common component configurations
export const formConfigs = {
  // Login form configuration
  login: {
    fields: [
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Enter your email",
        required: true,
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
        required: true,
      },
    ],
    submitText: "Sign In",
    validationRules: {
      email: (value: string) => (!value.includes("@") ? "Invalid email" : ""),
      password: (value: string) =>
        value.length < 6 ? "Password too short" : "",
    },
  },

  // Signup form configuration
  signup: {
    steps: [
      {
        title: "Account Type",
        fields: [
          {
            name: "userType",
            label: "I want to",
            type: "radio",
            options: [
              { value: "student", label: "Learn Languages" },
              { value: "teacher", label: "Teach Languages" },
            ],
            required: true,
          },
        ],
      },
      {
        title: "Personal Information",
        fields: [
          {
            name: "firstName",
            label: "First Name",
            type: "text",
            required: true,
          },
          {
            name: "lastName",
            label: "Last Name",
            type: "text",
            required: true,
          },
          {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            required: true,
          },
        ],
      },
    ],
  },
};

// Table configurations
export const tableConfigs = {
  users: {
    columns: [
      { key: "name", label: "Name", sortable: true },
      { key: "email", label: "Email", sortable: true },
      { key: "status", label: "Status", render: (value: string) => value },
      { key: "joinedDate", label: "Joined", sortable: true },
      { key: "actions", label: "Actions", sortable: false },
    ],
    filters: [
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["active", "suspended"],
      },
      { key: "search", label: "Search", type: "text" },
    ],
  },

  teachers: {
    columns: [
      { key: "name", label: "Teacher", sortable: true },
      { key: "languages", label: "Languages" },
      { key: "experience", label: "Experience", sortable: true },
      { key: "status", label: "Status" },
      { key: "actions", label: "Actions", sortable: false },
    ],
  },
};

// Modal configurations
export const modalConfigs = {
  confirmDelete: {
    title: "Confirm Delete",
    description:
      "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
  },

  userDetails: {
    title: "User Details",
    size: "lg" as const,
    sections: ["personal", "activity", "wallet", "settings"],
  },
};

// Dashboard configurations
export const dashboardConfigs = {
  student: {
    stats: [
      { key: "hoursLearned", label: "Hours Learned", icon: "clock" },
      { key: "lessonsCompleted", label: "Lessons", icon: "book" },
      { key: "currentStreak", label: "Streak", icon: "fire" },
      { key: "walletBalance", label: "Wallet", icon: "wallet" },
    ],
    sections: [
      { id: "overview", title: "Overview" },
      { id: "lessons", title: "My Lessons" },
      { id: "progress", title: "Progress" },
    ],
  },

  teacher: {
    stats: [
      { key: "totalEarnings", label: "Earnings", icon: "dollar" },
      { key: "totalStudents", label: "Students", icon: "users" },
      { key: "thisMonthLessons", label: "This Month", icon: "calendar" },
      { key: "rating", label: "Rating", icon: "star" },
    ],
    sections: [
      { id: "overview", title: "Overview" },
      { id: "lessons", title: "Lessons" },
      { id: "students", title: "Students" },
      { id: "earnings", title: "Earnings" },
    ],
  },

  admin: {
    stats: [
      { key: "totalUsers", label: "Users", icon: "users" },
      { key: "totalTeachers", label: "Teachers", icon: "graduation-cap" },
      { key: "totalLessons", label: "Lessons", icon: "calendar" },
      { key: "totalRevenue", label: "Revenue", icon: "dollar" },
    ],
    sections: [
      { id: "overview", title: "Overview" },
      { id: "users", title: "Users" },
      { id: "teachers", title: "Teachers" },
      { id: "system", title: "System" },
    ],
  },
};

// Common select options
export const selectOptions = {
  languages: LANGUAGES.map((lang) => ({ value: lang, label: lang })),
  paymentMethods: PAYMENT_METHODS.map((method) => ({
    value: method.value,
    label: method.label,
    icon: method.icon,
  })),
  timezones: TIMEZONES.map((tz) => ({ value: tz, label: tz })),
  userRoles: [
    { value: "student", label: "Student" },
    { value: "teacher", label: "Teacher" },
    { value: "admin", label: "Admin" },
  ],
  statusOptions: [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
    { value: "suspended", label: "Suspended" },
  ],
};
