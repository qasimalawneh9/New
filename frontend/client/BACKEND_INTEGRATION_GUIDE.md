# Backend Integration Guide

## 🎯 Purpose

This guide helps backend developers (Laravel) understand the frontend structure and integrate with APIs efficiently.

## 📁 Project Structure

```
client/
├── api/                    # API integration layer
│   ├── config.ts          # API configuration & base URLs
│   ├── endpoints.ts       # All API endpoint definitions
│   ├── base.service.ts    # Base API service class
│   └── services/          # Service classes for each feature
├── components/            # Reusable UI components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication components
│   ├── booking/          # Lesson booking components
│   ├── common/           # Shared components
│   ├── community/        # Community features
│   ├── layout/           # Layout components
│   ├── messaging/        # Chat/messaging components
│   ├── payment/          # Payment components
│   ├── reviews/          # Rating/review components
│   └── ui/               # Base UI components (buttons, forms, etc.)
├── contexts/             # React contexts (global state)
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── pages/                # Page components (routes)
├── router/               # Routing configuration
├── services/             # Business logic services
├── types/                # TypeScript type definitions
└── config/               # Configuration files
```

## 🔗 Key Integration Points

### 1. API Services Structure

All API calls are centralized in `client/api/services/` with the following pattern:

```typescript
// Example: client/api/services/user.service.ts
export class UserService extends BaseService {
  // Maps to Laravel Route: GET /api/users/{id}
  async getUser(id: string) { ... }

  // Maps to Laravel Route: PUT /api/users/{id}
  async updateUser(id: string, data: UpdateUserData) { ... }
}
```

### 2. Database-Connected Components

#### **🔴 HIGH PRIORITY - Need Database Integration**

**User Management:**

- `client/pages/AdminDashboard.tsx` - Admin panel (lines 1200-1500)
  - User list table: `data-id="admin-users-table"`
  - Teacher applications: `data-id="teacher-applications-list"`
  - System statistics: `data-id="dashboard-stats"`

**Authentication:**

- `client/components/auth/LoginForm.tsx` - Login form
  - Form ID: `#login-form`
  - Submit handler: `handleLogin()` function
- `client/components/auth/SignupForm.tsx` - Registration
  - Form ID: `#signup-form`
  - Submit handler: `handleSignup()` function

**Teacher Profiles:**

- `client/pages/TeacherProfile.tsx` - Individual teacher pages
  - Teacher data container: `data-id="teacher-profile-container"`
  - Booking form: `data-id="lesson-booking-form"`
  - Reviews section: `data-id="teacher-reviews"`

**Lesson Management:**

- `client/pages/Dashboard.tsx` - Student dashboard
  - Upcoming lessons: `data-id="upcoming-lessons-list"`
  - Lesson history: `data-id="lesson-history"`
  - Trial lessons: `data-id="trial-lessons-section"`

**Messaging System:**

- `client/pages/Messages.tsx` - Chat interface
  - Conversation list: `data-id="conversations-list"`
  - Message thread: `data-id="message-thread"`
  - Send form: `data-id="message-send-form"`

**Payment System:**

- `client/components/payment/PaymentForm.tsx` - Payment processing
  - Payment form: `data-id="payment-form"`
  - Wallet balance: `data-id="wallet-balance"`

#### **🟡 MEDIUM PRIORITY - Configuration Needed**

**Settings & Preferences:**

- `client/pages/Settings.tsx` - User settings
- `client/pages/TeacherSettings.tsx` - Teacher preferences
- `client/components/admin/TrialLessonsManager.tsx` - Trial lesson config

**Community Features:**

- `client/pages/Community.tsx` - Community posts and events

### 3. Form Handling Pattern

All forms follow this consistent pattern:

```typescript
// Form container with semantic ID
<form id="unique-form-id" onSubmit={handleSubmit}>

  // Input fields with name attributes matching database columns
  <input
    name="email"
    data-field="user.email"
    required
  />

  // Submit button with loading state
  <button
    type="submit"
    data-action="submit"
    disabled={isSubmitting}
  >
    {isSubmitting ? 'Loading...' : 'Submit'}
  </button>
</form>
```

### 4. API Endpoint Mapping

| Frontend Service                | Laravel Route                 | Controller Method             |
| ------------------------------- | ----------------------------- | ----------------------------- |
| `AuthService.login()`           | `POST /api/auth/login`        | `AuthController@login`        |
| `UserService.getProfile()`      | `GET /api/users/profile`      | `UserController@profile`      |
| `LessonService.create()`        | `POST /api/lessons`           | `LessonController@store`      |
| `TeacherService.getAvailable()` | `GET /api/teachers/available` | `TeacherController@available` |
| `MessageService.send()`         | `POST /api/messages`          | `MessageController@store`     |
| `PaymentService.process()`      | `POST /api/payments`          | `PaymentController@process`   |

### 5. State Management

**Context Providers:**

- `AuthContext` - User authentication state
- `LanguageContext` - Internationalization
- `NotificationContext` - Toast notifications

**Local Storage Keys:**

- `talkcon_user` - Authenticated user data
- `talkcon_token` - JWT token
- `talkcon_preferences` - User preferences

## 🛠 Laravel Integration Steps

### Step 1: API Routes Setup

```php
// routes/api.php
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
    Route::apiResource('lessons', LessonController::class);
    Route::apiResource('teachers', TeacherController::class);
    Route::apiResource('messages', MessageController::class);
    Route::apiResource('payments', PaymentController::class);
});
```

### Step 2: Update API Configuration

```typescript
// client/api/config.ts
export const API_CONFIG = {
  BASE_URL: process.env.VITE_API_URL || "http://localhost:8000/api",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
};
```

### Step 3: Authentication Setup

The frontend expects the following authentication response format:

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "type": "student|teacher|admin",
    "avatar": "url"
  },
  "token": "jwt_token_here",
  "expires_in": 3600
}
```

## 🔍 Component Analysis

### High-Impact Components (Need Database Integration)

1. **AdminDashboard.tsx** - Complete admin panel

   - Lines 1200-1500: User management table
   - Lines 800-1000: Teacher application workflow
   - Lines 500-700: System statistics and analytics

2. **TeacherProfile.tsx** - Teacher booking system

   - Lines 300-500: Teacher information display
   - Lines 600-800: Lesson booking form
   - Lines 900-1100: Reviews and ratings

3. **Messages.tsx** - Real-time messaging
   - Lines 200-400: Conversation list
   - Lines 500-700: Message thread
   - Lines 100-200: WebSocket connection setup

### Medium-Impact Components

4. **Dashboard.tsx** - Student dashboard
5. **TeacherDashboard.tsx** - Teacher dashboard
6. **Community.tsx** - Community features

## 🚀 Quick Start Checklist

### For Backend Developer:

- [ ] Set up Laravel API routes matching `client/api/endpoints.ts`
- [ ] Implement authentication using Laravel Sanctum
- [ ] Create database migrations based on `client/types/models.ts`
- [ ] Set up CORS for frontend domain
- [ ] Configure file upload for avatars/documents
- [ ] Implement WebSocket for real-time messaging
- [ ] Set up payment gateway integration
- [ ] Create admin seeder for initial admin user

### Testing Integration:

1. Start with authentication flow (`AuthService`)
2. Test user profile management (`UserService`)
3. Implement teacher listing (`TeacherService`)
4. Add lesson booking functionality (`LessonService`)
5. Set up messaging system (`MessageService`)
6. Integrate payment processing (`PaymentService`)

## 🐛 Common Integration Issues

**CORS Issues:**

- Frontend runs on `http://localhost:8080`
- Ensure Laravel CORS config allows this origin

**Authentication:**

- Frontend expects JWT tokens in `Authorization: Bearer {token}` format
- User data should be included in auth responses

**File Uploads:**

- Profile pictures: max 5MB, formats: jpg, png, gif
- Documents: max 10MB, formats: pdf, doc, docx

**WebSocket:**

- Used for real-time messaging and lesson notifications
- Configure Laravel WebSocket broadcasting

## 📞 Support

For questions about frontend implementation:

- Check `DEVELOPER_GUIDE.md` for detailed component documentation
- Review `PROJECT_STRUCTURE.md` for architecture overview
- Examine component files for inline comments and data attributes
