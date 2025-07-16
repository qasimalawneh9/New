# Talkcon Frontend - Project Structure

## 📁 Organized Project Structure

The frontend has been restructured for optimal Laravel backend integration with clear separation of concerns and developer-friendly organization.

### Current Structure

```
client/
├── 📄 DEVELOPER_GUIDE.md        # Comprehensive developer documentation
├── 📄 PROJECT_STRUCTURE.md      # This file - project overview
├── 📄 App.tsx                   # Main application component
├──
├── 🔗 api/                      # API Integration Layer
│   ├── config.ts               # API configuration and utilities
│   ├── endpoints.ts             # All API endpoint definitions
│   ├── base.service.ts          # Base API service class
│   └── services/               # API service classes
│       ├── auth.service.ts     # Authentication API calls
│       └── booking.service.ts  # Booking API calls
│
├── 🎨 assets/                   # Static Assets (future)
│   ├── images/                 # Image files
│   ├── icons/                  # Icon files
│   └── fonts/                  # Font files
│
├── 🧩 components/               # Reusable Components
│   ├── auth/                   # Authentication components
│   │   └── LoginForm.tsx       # Enhanced login form with semantic IDs
│   ├── booking/                # Booking system components
│   │   └── BookingForm.tsx     # Multi-step booking form
│   ├── common/                 # Shared components
│   ├── forms/                  # Form components
│   ├── layout/                 # Layout components
│   ├── modals/                 # Modal components
│   └── ui/                     # UI library components
│
├── ⚙️ config/                   # Configuration Files
│   └── constants.ts            # Application constants matching Laravel
│
├── 🔄 contexts/                 # React Contexts
│   ├── AuthContext.tsx         # Authentication state management
│   └── LanguageContext.tsx     # Language/localization context
│
├── 🎣 hooks/                    # Custom React Hooks
│   └── useAuth.ts              # Authentication hook for Laravel integration
│
├── 📄 lib/                      # Utility Libraries
│   ├── api.ts                  # API utilities
│   ├── database.ts             # Mock database (to be replaced)
│   └── validation.ts           # Form validation utilities
│
├── 📱 pages/                    # Page Components
│   ├── auth/                   # Authentication pages
│   ├── dashboard/              # Dashboard pages
│   ├── legal/                  # Legal pages
│   └── public/                 # Public pages
│
├── 🔧 services/                 # Business Logic Services
│   ├── auth.service.ts         # Authentication business logic
│   └── booking.service.ts      # Booking business logic
│
├── 📝 types/                    # TypeScript Definitions
│   └── models.ts               # Data models matching Laravel Eloquent
│
└── 🛠 utils/                    # Utility Functions
    ├── api.ts                  # API helper functions
    ├── validation.ts           # Validation utilities
    └── helpers.ts              # General helper functions
```

## 🎯 Laravel Integration Features

### 1. **Semantic HTML Structure**

```html
<!-- All forms include Laravel-compatible attributes -->
<form
  id="login-form"
  data-laravel-controller="AuthController"
  data-laravel-action="login"
  data-form-type="authentication"
>
  <input
    id="email-input"
    name="email"
    data-field="email"
    data-laravel-validation="required|email"
  />
</form>
```

### 2. **API Service Classes**

```typescript
// Each service maps to Laravel controllers
export class AuthService extends BaseApiService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.post("/auth/login", credentials); // → AuthController@login
  }
}
```

### 3. **Type Safety**

```typescript
// TypeScript interfaces match Laravel Eloquent models exactly
export interface User extends BaseModel {
  id: string;
  name: string;
  email: string;
  user_type: "student" | "teacher" | "admin";
  created_at: string;
  updated_at: string;
}
```

### 4. **Constants Alignment**

```typescript
// All constants match Laravel database enum values
export const USER_TYPES = {
  STUDENT: "student", // matches Laravel enum
  TEACHER: "teacher", // matches Laravel enum
  ADMIN: "admin", // matches Laravel enum
} as const;
```

## 🚀 Developer Benefits

### **Easy API Integration**

- Pre-defined endpoints mapping to Laravel routes
- Automatic error handling for Laravel validation responses
- Type-safe request/response interfaces

### **Consistent Naming**

- CSS classes follow BEM methodology
- IDs match Laravel form field names
- Data attributes provide integration points

### **Form Handling**

```typescript
// Forms automatically handle Laravel validation errors
const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

// Display field-specific errors
{getFieldError("email") && (
  <p id="email-error" className="error-message" role="alert">
    {getFieldError("email")}
  </p>
)}
```

### **Component Structure**

```typescript
// Consistent component pattern
export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  className,
}) => {
  const { login, isLoading, error } = useAuth(); // Custom hook

  const handleSubmit = async (e: FormEvent) => {
    try {
      await login(formData); // API service call
      onSuccess?.();
    } catch (error: any) {
      if (error.validationErrors) {
        setValidationErrors(error.validationErrors); // Laravel validation
      }
    }
  };
};
```

## 📋 Implementation Checklist

### ✅ **Completed**

- [x] Developer documentation (DEVELOPER_GUIDE.md)
- [x] API configuration and base service class
- [x] Authentication service with Laravel integration
- [x] Booking service with multi-step form
- [x] Enhanced LoginForm with semantic IDs
- [x] Enhanced BookingForm with step-by-step process
- [x] Custom useAuth hook for state management
- [x] Comprehensive constants file
- [x] Complete TypeScript model definitions
- [x] Project structure documentation

### 🔄 **Ready for Laravel Integration**

- [x] API endpoints match Laravel route structure
- [x] Request/response types match Laravel API resources
- [x] Form validation compatible with Laravel validation
- [x] Error handling for Laravel error responses
- [x] Authentication flow with JWT tokens
- [x] File upload structure ready
- [x] Pagination support for Laravel collections

### 📋 **Next Steps for Laravel Developer**

1. **Set up Laravel API routes** matching frontend endpoints
2. **Create controllers** referenced in service classes
3. **Set up authentication** with JWT or Sanctum
4. **Configure CORS** for frontend domain
5. **Set up file uploads** for avatars and materials
6. **Configure real-time features** (optional)

## 🔧 Configuration

### **Environment Variables**

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Talkcon
VITE_APP_VERSION=1.0.0
```

### **API Configuration**

```typescript
// api/config.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
};
```

## 📚 Key Documentation Files

1. **DEVELOPER_GUIDE.md** - Comprehensive guide for Laravel developers
2. **api/endpoints.ts** - All API endpoint definitions
3. **types/models.ts** - TypeScript interfaces matching Laravel models
4. **config/constants.ts** - Application constants
5. **hooks/useAuth.ts** - Authentication state management

## 🎨 CSS Organization

### **Class Naming Convention (BEM)**

```scss
// Component blocks
.auth-form {
}
.booking-form {
}
.user-card {
}

// Elements
.auth-form__input {
}
.auth-form__submit {
}
.user-card__avatar {
}

// Modifiers
.auth-form--loading {
}
.user-card--highlighted {
}
```

### **Data Attributes for Laravel**

```html
<!-- Component identification -->
<div data-component="login-form" data-laravel-controller="AuthController">
  <!-- Field identification -->
  <input data-field="email" data-laravel-validation="required|email" />

  <!-- Action identification -->
  <button data-action="submit-login" data-laravel-route="auth.login"></button>
</div>
```

This structure provides a solid foundation for seamless Laravel backend integration while maintaining clean, maintainable frontend code.
