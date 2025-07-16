# Talkcon Frontend - Developer Guide

## 🚀 Overview

This frontend is built with React + TypeScript and is designed for seamless Laravel backend integration.

## 📁 Project Structure

```
client/
├── api/                    # API integration layer
│   ├── endpoints/         # API endpoint definitions
│   ├── types/            # API response types
│   └── services/         # API service classes
├── assets/               # Static assets
│   ├── images/          # Image files
│   ├── icons/           # Icon files
│   └── fonts/           # Font files
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   ├── booking/        # Booking system components
│   ├── common/         # Shared components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components
│   ├── modals/         # Modal components
│   └── ui/             # UI library components
├── config/             # Configuration files
│   ├── api.ts          # API configuration
│   ├── constants.ts    # App constants
│   └── routes.ts       # Route definitions
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── AppContext.tsx  # Global app state
├── hooks/              # Custom React hooks
│   ├── useApi.ts       # API integration hook
│   ├── useAuth.ts      # Authentication hook
│   └── useForm.ts      # Form handling hook
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard pages
│   ├── legal/         # Legal pages
│   └── public/        # Public pages
├── services/           # Business logic services
│   ├── auth.service.ts
│   ├── booking.service.ts
│   └── user.service.ts
├── types/              # TypeScript type definitions
│   ├── api.ts         # API types
│   ├── auth.ts        # Authentication types
│   └── models.ts      # Data model types
└── utils/              # Utility functions
    ├── api.ts         # API utilities
    ├── validation.ts  # Form validation
    └── helpers.ts     # General helpers
```

## 🔗 Laravel Integration Points

### 1. API Endpoints (client/api/endpoints/)

Each API endpoint file corresponds to Laravel controllers:

```typescript
// client/api/endpoints/auth.ts
export const AUTH_ENDPOINTS = {
  LOGIN: "/api/auth/login", // → AuthController@login
  LOGOUT: "/api/auth/logout", // → AuthController@logout
  REGISTER: "/api/auth/register", // → AuthController@register
  PROFILE: "/api/auth/profile", // → AuthController@profile
};
```

### 2. Data Models (client/types/models.ts)

TypeScript interfaces that match Laravel Eloquent models:

```typescript
// User model - matches Laravel User model
export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}
```

### 3. Form Components (client/components/forms/)

Forms with Laravel-compatible validation and CSRF tokens:

```tsx
// Login form with Laravel validation
<form
  id="login-form"
  className="auth-form"
  data-laravel-action="/api/auth/login"
>
```

## 🎯 Naming Conventions

### CSS Classes

- **BEM methodology**: `.component__element--modifier`
- **Laravel blade compatible**: `auth-form`, `user-dashboard`, `booking-card`
- **Data attributes**: `data-component`, `data-action`, `data-model`

### Component IDs

- **Semantic naming**: `login-form`, `user-profile-edit`, `booking-calendar`
- **Laravel route mapping**: `{resource}-{action}` (e.g., `lesson-create`, `user-update`)

### API Integration

- **Endpoints match Laravel routes**: `/api/{resource}/{action}`
- **Request/Response types**: Match Laravel API resources
- **Error handling**: Compatible with Laravel validation responses

## 🔐 Authentication Flow

### Frontend State Management

```typescript
// AuthContext provides:
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

### Laravel Integration

1. **Login**: POST `/api/auth/login` → returns JWT token
2. **Token Storage**: localStorage/sessionStorage
3. **Request Headers**: `Authorization: Bearer {token}`
4. **Protected Routes**: Check authentication state

## 📋 CRUD Operations

### Standard Pattern

Each entity follows the same pattern:

```typescript
// Service Layer (client/services/user.service.ts)
export class UserService {
  async index(): Promise<User[]>; // GET /api/users
  async show(id: string): Promise<User>; // GET /api/users/{id}
  async store(data: CreateUserData): Promise<User>; // POST /api/users
  async update(id: string, data: UpdateUserData): Promise<User>; // PUT /api/users/{id}
  async destroy(id: string): Promise<void>; // DELETE /api/users/{id}
}
```

### Form Integration

```tsx
// Create/Edit forms use consistent structure
<form
  id="{resource}-{action}-form"
  data-resource="users"
  data-action="create"
  onSubmit={handleSubmit}
>
```

## 🛠 Development Guidelines

### 1. Component Structure

```tsx
// StandardComponent.tsx
interface Props {
  // Props definition
}

interface ComponentData {
  // Local state definition
}

const StandardComponent: React.FC<Props> = ({ ...props }) => {
  // 1. Hooks and state
  // 2. API calls and effects
  // 3. Event handlers
  // 4. Render logic

  return (
    <div
      id="component-container"
      className="component-wrapper"
      data-component="standard-component"
    >
      {/* Component content */}
    </div>
  );
};
```

### 2. API Integration

```typescript
// Use custom hooks for API calls
const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.index();
      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, fetchUsers };
};
```

### 3. Error Handling

```typescript
// Handle Laravel validation errors
interface LaravelValidationError {
  message: string;
  errors: Record<string, string[]>;
}

const handleApiError = (error: LaravelValidationError) => {
  // Display validation errors
  Object.entries(error.errors).forEach(([field, messages]) => {
    const fieldElement = document.getElementById(`${field}-input`);
    // Show error messages
  });
};
```

## 📊 State Management

### Context Structure

```typescript
// Global app state
interface AppState {
  user: User | null;
  preferences: UserPreferences;
  ui: UIState;
  notifications: Notification[];
}
```

### Local Component State

- Use `useState` for component-specific data
- Use `useReducer` for complex state logic
- Use custom hooks for reusable state logic

## 🔄 Routing Integration

### Frontend Routes → Laravel Routes

```typescript
// Frontend routes that map to Laravel
const ROUTES = {
  // Auth routes
  LOGIN: "/login", // → login view
  REGISTER: "/register", // → register view

  // Dashboard routes
  DASHBOARD: "/dashboard", // → dashboard view
  PROFILE: "/profile", // → profile view

  // API routes (AJAX)
  API_USERS: "/api/users", // → UserController
  API_LESSONS: "/api/lessons", // → LessonController
};
```

## 🎨 Styling Guidelines

### CSS Organization

```scss
// styles/
├── base/           # Reset, typography, base styles
├── components/     # Component-specific styles
├── layouts/        # Layout styles
├── pages/          # Page-specific styles
├── themes/         # Theme variables
└── utilities/      # Utility classes
```

### Class Naming

- **Components**: `.auth-form`, `.user-card`, `.booking-panel`
- **Elements**: `.auth-form__input`, `.user-card__avatar`
- **Modifiers**: `.auth-form--loading`, `.user-card--highlighted`
- **Utilities**: `.text-center`, `.mb-4`, `.hidden`

## 🧪 Testing Integration

### Component Testing

```typescript
// Components include test-friendly attributes
<button
  id="submit-login"
  data-testid="login-submit-button"
  data-action="submit-login-form"
>
  Login
</button>
```

### API Testing

- Mock API responses match Laravel API resource format
- Test error handling for Laravel validation responses
- Test authentication flows

## 📱 Responsive Design

### Breakpoints

```scss
$breakpoints: (
  sm: 640px,
  // Small devices
  md: 768px,
  // Medium devices
  lg: 1024px,
  // Large devices
  xl: 1280px, // Extra large devices
);
```

### Mobile-First Approach

- Design for mobile first
- Progressive enhancement for larger screens
- Touch-friendly interfaces

## 🔧 Build & Deployment

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Talkcon
VITE_APP_VERSION=1.0.0
```

### Build Configuration

- Development: `npm run dev`
- Production: `npm run build`
- Testing: `npm run test`

## 📝 Code Examples

### User Authentication Component

```tsx
// components/auth/LoginForm.tsx
export const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <form
      id="login-form"
      className="auth-form"
      data-component="login-form"
      onSubmit={handleSubmit}
    >
      <input
        id="email-input"
        name="email"
        type="email"
        className="auth-form__input"
        data-field="email"
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
        required
      />
      <button
        id="login-submit"
        type="submit"
        className="auth-form__submit"
        data-action="submit-login"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};
```

This guide provides a foundation for Laravel developers to understand and work with the frontend codebase effectively.
