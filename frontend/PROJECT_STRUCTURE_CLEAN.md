# Talkcon Frontend Project Structure

## 🎯 Overview

This document provides a comprehensive overview of the Talkcon frontend project structure. The codebase is organized following modern React/TypeScript best practices with clear separation of concerns.

## 📁 Directory Structure

```
client/
├── components/                 # Reusable UI components
│   ├── ui/                    # Base design system components
│   │   ├── button.tsx         # Button component with variants
│   │   ├── input.tsx          # Input components
│   │   ├── modal.tsx          # Modal and dialog components
│   │   ├── toast.tsx          # Toast notification system
│   │   └── ...                # Other base UI components
│   ├── auth/                  # Authentication components
│   │   ├── LoginForm.tsx      # Login form component
│   │   ├── SignupForm.tsx     # Registration form
│   │   └── ProtectedRoute.tsx # Route protection wrapper
│   ├── booking/               # Lesson booking components
│   │   ├── BookingCalendar.tsx
│   │   ├── TimeSlotPicker.tsx
│   │   └── BookingConfirmation.tsx
│   ├── messaging/             # Chat and messaging
│   │   ├── ChatWindow.tsx
│   │   ├── MessageList.tsx
│   │   └── ConversationList.tsx
│   ├── admin/                 # Admin dashboard components
│   │   ├── UserManagement.tsx
│   │   ├── TeacherApproval.tsx
│   │   └── AnalyticsDashboard.tsx
│   ├── common/                # Shared components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   └── index.ts               # Component exports
├── pages/                     # Page components (routes)
│   ├── Index.tsx              # Homepage
│   ├── Login.tsx              # Login page
│   ├── Signup.tsx             # Registration page
│   ├── Teachers.tsx           # Teacher listing
│   ├── StudentDashboard.tsx   # Student dashboard
│   ├── TeacherDashboard.tsx   # Teacher dashboard
│   ├── AdminDashboard.tsx     # Admin dashboard
│   ├── LessonRoom.tsx         # Video lesson interface
│   └── ...                    # Other pages
├── hooks/                     # Custom React hooks
│   ├── useApi.ts              # API interaction hooks
│   ├── useAuth.ts             # Authentication hooks
│   ├── useLocalStorage.ts     # Local storage utilities
│   ├── useDebounce.ts         # Debouncing hook
│   └── index.ts               # Hook exports
├── services/                  # External service integrations
│   ├── api.ts                 # API service layer
│   ├── auth.ts                # Authentication service
│   ├── websocket.ts           # WebSocket connections
│   └── analytics.ts           # Analytics tracking
├── types/                     # TypeScript type definitions
│   ├── api.ts                 # API response types
│   ├── ui.ts                  # UI component types
│   ├── forms.ts               # Form and validation types
│   ├── models.ts              # Data model types (legacy)
│   ├── platform.ts            # Platform-specific types (legacy)
│   ├── laravel-api.ts         # Laravel API types (legacy)
│   └── index.ts               # Type exports
├── utils/                     # Utility functions
│   ├── index.ts               # Main utilities export
│   ├── validation.ts          # Validation utilities
│   ├── formatting.ts          # Data formatting
│   ├── constants.ts           # Application constants (legacy)
│   └── helpers.ts             # Helper functions
├── config/                    # Configuration files
│   ├── constants.ts           # Application constants
│   ├── environment.ts         # Environment variables
│   └── routes.ts              # Route definitions
├── contexts/                  # React context providers
│   ├── AuthContext.tsx        # Authentication context
│   ├── ThemeContext.tsx       # Theme and styling
│   ├── LanguageContext.tsx    # Internationalization
│   └── NotificationContext.tsx # Global notifications
├── lib/                       # Third-party library configurations
│   ├── database.ts            # Local database simulation
│   ├── api.ts                 # API client configuration
│   ├── utils.ts               # Utility functions (legacy)
│   └── seoConfig.ts           # SEO configuration
├── router/                    # Routing configuration
│   ├── routes.tsx             # Route definitions
│   └── ProtectedRoute.tsx     # Route protection
├── providers/                 # Global providers
│   └── index.tsx              # Provider composition
├── global.css                 # Global styles
├── App.tsx                    # Main app component
└── vite-env.d.ts             # Vite type definitions
```

## 🏗️ Architecture Overview

### Component Organization

Components are organized by feature and complexity:

1. **`components/ui/`** - Base design system components (buttons, inputs, modals)
2. **`components/[feature]/`** - Feature-specific components (auth, booking, messaging)
3. **`components/common/`** - Shared layout and navigation components
4. **`pages/`** - Top-level page components that correspond to routes

### Data Flow

```
Pages → Custom Hooks → Services → API → Backend
  ↓         ↓           ↓
Components ← Contexts ← Utils
```

### Type Safety

- **`types/api.ts`** - Primary API contract definitions
- **`types/ui.ts`** - Component prop types
- **`types/forms.ts`** - Form and validation types
- Legacy type files are maintained for backward compatibility

## 📋 Key Files and Their Purpose

### Core Application Files

| File                  | Purpose                    | Importance    |
| --------------------- | -------------------------- | ------------- |
| `App.tsx`             | Main application component | **Critical**  |
| `pages/[Page].tsx`    | Route components           | **Critical**  |
| `services/api.ts`     | API service layer          | **Critical**  |
| `types/api.ts`        | API type definitions       | **Critical**  |
| `config/constants.ts` | Application configuration  | **Important** |
| `hooks/useApi.ts`     | API interaction hooks      | **Important** |

### Backend Integration Files

| File                           | Purpose          | Backend Relevance                          |
| ------------------------------ | ---------------- | ------------------------------------------ |
| `types/api.ts`                 | API contracts    | **Essential** - Defines all API interfaces |
| `services/api.ts`              | API calls        | **Essential** - Shows required endpoints   |
| `config/constants.ts`          | Config values    | **Important** - API URLs, limits, etc.     |
| `BACKEND_INTEGRATION_GUIDE.md` | Integration docs | **Critical** - Complete backend guide      |

### Development Files

| File               | Purpose               | When to Modify   |
| ------------------ | --------------------- | ---------------- |
| `lib/database.ts`  | Local data simulation | Development only |
| `lib/demo-data.ts` | Test data generation  | Development only |
| `utils/index.ts`   | Utility functions     | As needed        |

## 🔧 Configuration Management

### Environment Variables

```typescript
// config/constants.ts
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
  TIMEOUT: 30000,
} as const;
```

### Feature Flags

```typescript
// config/constants.ts
export const FEATURES = {
  ENABLE_TRIAL_LESSONS: true,
  ENABLE_VIDEO_CALLS: true,
  ENABLE_WALLET: true,
} as const;
```

## 🎨 Styling and UI

### Design System

- **Base Components**: `components/ui/` - Reusable, styled components
- **Theme Configuration**: `contexts/ThemeContext.tsx`
- **Global Styles**: `global.css` - Global CSS and Tailwind imports
- **Component Styling**: Tailwind CSS classes with component variants

### Component Patterns

```typescript
// Example component structure
interface ButtonProps {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({
  variant = "solid",
  size = "md",
  ...props
}: ButtonProps) {
  // Component implementation
}
```

## 🔄 State Management

### Global State

- **Authentication**: `contexts/AuthContext.tsx`
- **Theme**: `contexts/ThemeContext.tsx`
- **Language**: `contexts/LanguageContext.tsx`
- **Notifications**: `contexts/NotificationContext.tsx`

### Local State

- **API Data**: React Query hooks in `hooks/useApi.ts`
- **Form State**: Custom form hooks and libraries
- **Component State**: React useState and useReducer

### Data Fetching

```typescript
// Example API hook
export function useTeachers(filters?: TeacherSearchFilters) {
  return useQuery({
    queryKey: ["teachers", filters],
    queryFn: () => teacherService.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
```

## 🛣️ Routing

### Route Structure

```typescript
// router/routes.tsx
const routes = [
  { path: "/", component: Index },
  { path: "/login", component: Login },
  { path: "/teachers", component: Teachers },
  { path: "/student", component: StudentDashboard, protected: true },
  { path: "/teacher", component: TeacherDashboard, protected: true },
  { path: "/admin", component: AdminDashboard, protected: true, role: "admin" },
];
```

### Protection

- **Authentication**: `ProtectedRoute` component
- **Role-based**: Route-level role checking
- **Redirects**: Automatic redirects for unauthorized access

## 🧪 Testing Strategy

### Test Organization

```
__tests__/
├── components/         # Component tests
├── hooks/             # Hook tests
├── services/          # Service tests
├── utils/             # Utility tests
└── integration/       # Integration tests
```

### Testing Patterns

- **Components**: React Testing Library
- **Hooks**: @testing-library/react-hooks
- **Services**: Jest mocks
- **Integration**: End-to-end with Cypress

## 📦 Build and Deployment

### Build Configuration

- **Bundler**: Vite
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript compiler

### Environment Builds

- **Development**: `npm run dev` - Hot reload, debug tools
- **Staging**: `npm run build:staging` - Production build with debug
- **Production**: `npm run build` - Optimized production build

## 🔐 Security Considerations

### Authentication

- **JWT Tokens**: Stored in localStorage with expiration
- **Route Protection**: Role-based access control
- **API Security**: Bearer token authentication

### Data Protection

- **Input Validation**: Client-side and server-side validation
- **XSS Prevention**: Sanitized user inputs
- **File Uploads**: Type and size validation

## 📊 Performance Optimization

### Code Splitting

- **Route-based**: Lazy loading of page components
- **Component-based**: Dynamic imports for heavy components
- **Library**: Vendor chunks for third-party libraries

### Caching Strategy

- **API Data**: React Query with stale-while-revalidate
- **Static Assets**: Browser caching with versioning
- **Images**: Lazy loading and optimization

## 🌐 Internationalization

### Language Support

- **Context**: `LanguageContext.tsx` for language state
- **Translation Keys**: Structured translation files
- **RTL Support**: CSS and layout adjustments for Arabic

### Implementation

```typescript
// Example usage
const { t } = useLanguage();
return <h1>{t("welcome.title")}</h1>;
```

## 📱 Responsive Design

### Breakpoint Strategy

```typescript
// config/constants.ts
export const UI_CONFIG = {
  BREAKPOINTS: {
    SM: "640px", // Mobile
    MD: "768px", // Tablet
    LG: "1024px", // Desktop
    XL: "1280px", // Large desktop
  },
} as const;
```

### Component Responsiveness

- **Mobile-first**: Default styles for mobile
- **Progressive Enhancement**: Larger screen enhancements
- **Touch-friendly**: Appropriate touch targets

## 🔧 Development Guidelines

### Code Style

- **TypeScript**: Strict mode, explicit types
- **Naming**: PascalCase for components, camelCase for functions
- **File Organization**: Feature-based grouping
- **Import Order**: External → Internal → Relative

### Component Guidelines

```typescript
// Good component structure
interface Props {
  // Required props first
  title: string;
  // Optional props with defaults
  variant?: "primary" | "secondary";
  // Event handlers
  onClick?: () => void;
}

export function Component({ title, variant = "primary", onClick }: Props) {
  // Component implementation
}
```

### API Integration

- **Type Safety**: All API calls typed with `types/api.ts`
- **Error Handling**: Consistent error handling patterns
- **Loading States**: UI feedback for async operations
- **Caching**: Appropriate cache strategies

## 📚 Documentation

### Code Documentation

- **TSDoc**: Function and interface documentation
- **README**: Setup and development instructions
- **API Docs**: `BACKEND_INTEGRATION_GUIDE.md`
- **Type Definitions**: Self-documenting TypeScript interfaces

### Component Documentation

```typescript
/**
 * Button component with multiple variants and sizes
 *
 * @param variant - Visual style variant
 * @param size - Button size
 * @param children - Button content
 * @param onClick - Click handler
 */
export function Button(props: ButtonProps) {
  // Implementation
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- TypeScript knowledge
- React experience

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint
```

### Key Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run type-check` - Type checking

## 📞 Support and Maintenance

### Code Maintenance

- **Regular Updates**: Keep dependencies updated
- **Type Safety**: Maintain strict TypeScript standards
- **Performance**: Monitor and optimize bundle size
- **Security**: Regular security audits

### Adding New Features

1. **Plan**: Define types in `types/api.ts`
2. **Implement**: Create components and hooks
3. **Test**: Add comprehensive tests
4. **Document**: Update documentation
5. **Deploy**: Follow deployment procedures

---

This structure provides a solid foundation for scalable React/TypeScript development with clear separation of concerns and excellent developer experience.
