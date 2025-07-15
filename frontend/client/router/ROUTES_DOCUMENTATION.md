# Frontend Routes Documentation

## 🎯 Backend Integration Guide

This document maps frontend routes to their corresponding Laravel backend requirements.

## 📍 Route Structure

### **Public Routes** (No authentication required)

| Frontend Route    | Component      | Laravel Controller | API Endpoints                                                                                         | Description                     |
| ----------------- | -------------- | ------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------- |
| `/`               | Index          | PageController     | `GET /api/featured-teachers`<br>`GET /api/platform-stats`                                             | Homepage with featured teachers |
| `/teachers`       | Teachers       | TeacherController  | `GET /api/teachers`<br>`GET /api/teachers/search`                                                     | Teacher listing with filters    |
| `/teachers/:id`   | TeacherProfile | TeacherController  | `GET /api/teachers/{id}`<br>`GET /api/teachers/{id}/reviews`<br>`GET /api/teachers/{id}/availability` | Individual teacher profile      |
| `/login`          | Login          | AuthController     | `POST /api/auth/login`                                                                                | User authentication             |
| `/signup`         | Signup         | AuthController     | `POST /api/auth/register`                                                                             | User registration               |
| `/how-it-works`   | HowItWorks     | PageController     | Static content                                                                                        | Platform explanation            |
| `/pricing`        | Pricing        | PageController     | `GET /api/pricing-plans`                                                                              | Pricing information             |
| `/languages`      | Languages      | LanguageController | `GET /api/languages`                                                                                  | Supported languages             |
| `/help`           | Help           | SupportController  | `GET /api/help/articles`                                                                              | Help articles                   |
| `/contact`        | Contact        | ContactController  | `POST /api/contact`                                                                                   | Contact form                    |
| `/legal`          | Legal          | PageController     | Static content                                                                                        | Legal documents                 |
| `/become-teacher` | BecomeTeacher  | PageController     | Static content                                                                                        | Teacher recruitment             |

### **Protected Routes** (Authentication required)

| Frontend Route | Component           | Auth Level      | Laravel Controller  | API Endpoints                                                                                | Description          |
| -------------- | ------------------- | --------------- | ------------------- | -------------------------------------------------------------------------------------------- | -------------------- |
| `/dashboard`   | Dashboard           | Student/Teacher | DashboardController | `GET /api/dashboard/stats`<br>`GET /api/lessons/upcoming`                                    | User dashboard       |
| `/messages`    | Messages            | Any             | MessageController   | `GET /api/conversations`<br>`POST /api/messages`<br>`WebSocket: /broadcasting/messages`      | Messaging system     |
| `/lesson/:id`  | LessonRoom          | Any             | LessonController    | `GET /api/lessons/{id}`<br>`PUT /api/lessons/{id}/start`<br>`PUT /api/lessons/{id}/complete` | Virtual classroom    |
| `/booking/:id` | BookingConfirmation | Student         | BookingController   | `GET /api/bookings/{id}`<br>`POST /api/bookings/{id}/confirm`                                | Booking confirmation |
| `/settings`    | Settings            | Any             | UserController      | `GET /api/user/profile`<br>`PUT /api/user/profile`                                           | User settings        |

### **Teacher Routes** (Teacher authentication required)

| Frontend Route                | Component                | Laravel Controller           | API Endpoints                                                                               | Description              |
| ----------------------------- | ------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------- | ------------------------ |
| `/teacher/dashboard`          | TeacherDashboard         | TeacherController            | `GET /api/teacher/dashboard`<br>`GET /api/teacher/earnings`                                 | Teacher dashboard        |
| `/teacher/settings`           | TeacherSettings          | TeacherController            | `GET /api/teacher/profile`<br>`PUT /api/teacher/profile`<br>`PUT /api/teacher/availability` | Teacher profile settings |
| `/teacher/application`        | TeacherApplication       | TeacherApplicationController | `POST /api/teacher/apply`                                                                   | Teacher application form |
| `/teacher/application/status` | TeacherApplicationStatus | TeacherApplicationController | `GET /api/teacher/application-status`                                                       | Application status check |
| `/teacher/resources`          | TeacherResources         | TeacherController            | `GET /api/teacher/resources`                                                                | Teaching resources       |
| `/teacher/support`            | TeacherSupport           | SupportController            | `GET /api/teacher/support`                                                                  | Teacher-specific support |

### **Admin Routes** (Admin authentication required)

| Frontend Route | Component      | Laravel Controller | API Endpoints                                                                                                       | Description          |
| -------------- | -------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `/admin`       | AdminDashboard | AdminController    | `GET /api/admin/dashboard`<br>`GET /api/admin/stats`<br>`GET /api/admin/users`<br>`GET /api/admin/teachers/pending` | Complete admin panel |

### **Special Routes**

| Frontend Route     | Component      | Purpose            | Backend Notes                                             |
| ------------------ | -------------- | ------------------ | --------------------------------------------------------- |
| `/forgot-password` | ForgotPassword | Password reset     | `POST /api/auth/forgot-password`                          |
| `/community`       | Community      | Community features | `GET /api/community/posts`<br>`POST /api/community/posts` |
| `*`                | NotFound       | 404 handler        | Return 404 status                                         |

## 🔒 Authentication Flow

### Route Protection Middleware

```typescript
// client/components/ProtectedRoute.tsx
// Maps to Laravel middleware groups:

// 'auth:sanctum' - Any authenticated user
// 'teacher' - Teachers only
// 'admin' - Administrators only
```

### User Roles

1. **Student** - Default user role
2. **Teacher** - Approved teachers (is_tutor = true)
3. **Admin** - Platform administrators (is_admin = true)

## 📋 Component Data Requirements

### High Priority Components (Need Database Connection)

#### **Teachers.tsx** - Teacher Listing

```typescript
// Required API: GET /api/teachers
// Laravel Model: Teacher with User relationship
// Includes: pagination, filtering, search
```

#### **TeacherProfile.tsx** - Individual Teacher

```typescript
// Required APIs:
// - GET /api/teachers/{id}
// - GET /api/teachers/{id}/reviews
// - GET /api/teachers/{id}/availability
// - POST /api/lessons (booking)

// Critical Elements:
// - #teacher-profile-container [data-teacher-id]
// - #lesson-booking-trigger [data-action="open-booking"]
// - #lesson-booking-modal [data-modal="lesson-booking"]
```

#### **Dashboard.tsx** - User Dashboard

```typescript
// Required APIs:
// - GET /api/dashboard/stats
// - GET /api/lessons/upcoming
// - GET /api/wallet/balance

// Critical Elements:
// - #dashboard-stats [data-api="/api/dashboard/stats"]
// - #upcoming-lessons [data-api="/api/lessons/upcoming"]
```

#### **Messages.tsx** - Messaging System

```typescript
// Required APIs:
// - GET /api/conversations
// - POST /api/messages
// - WebSocket connection for real-time

// Critical Elements:
// - #conversations-list [data-api="/api/conversations"]
// - #message-thread [data-conversation-id]
// - #message-send-form [data-action="send-message"]
```

#### **AdminDashboard.tsx** - Admin Panel

```typescript
// Required APIs:
// - GET /api/admin/users
// - GET /api/admin/teachers/pending
// - PUT /api/admin/teachers/{id}/approve

// Critical Elements:
// - #admin-users-table [data-table="users"]
// - #admin-teacher-applications [data-table="teacher-applications"]
```

## 🚀 Laravel Route Setup

### API Routes Structure

```php
// routes/api.php

// Public routes
Route::get('/teachers', [TeacherController::class, 'index']);
Route::get('/teachers/{id}', [TeacherController::class, 'show']);

// Authentication routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Student routes
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::post('/lessons', [LessonController::class, 'store']);

    // Teacher routes
    Route::middleware('teacher')->group(function () {
        Route::get('/teacher/dashboard', [TeacherController::class, 'dashboard']);
    });

    // Admin routes
    Route::middleware('admin')->group(function () {
        Route::get('/admin/users', [AdminController::class, 'users']);
    });
});
```

## 🔄 State Management Integration

### React Contexts → Laravel Session/Auth

| Frontend Context      | Laravel Equivalent    | Storage       |
| --------------------- | --------------------- | ------------- |
| `AuthContext`         | `Auth::user()`        | JWT Token     |
| `LanguageContext`     | `App::getLocale()`    | Local Storage |
| `NotificationContext` | Laravel Notifications | WebSocket     |

## 📊 Data Flow Examples

### Lesson Booking Flow

1. Frontend: User clicks "Book Lesson" → TeacherProfile.tsx
2. API Call: `POST /api/lessons` → LessonController@store
3. Response: Created lesson data
4. Redirect: `/booking/{lesson_id}` → BookingConfirmation.tsx

### Teacher Application Flow

1. Frontend: Submit application → TeacherApplication.tsx
2. API Call: `POST /api/teacher/apply` → TeacherApplicationController@store
3. Admin Review: AdminDashboard.tsx → `PUT /api/admin/teachers/{id}/approve`
4. Notification: Teacher status update

## 🐛 Common Integration Points

### Form Validation

- Frontend validation mirrors Laravel validation rules
- Error responses use Laravel format: `{ errors: { field: [messages] } }`

### File Uploads

- Profile pictures: `/api/upload/avatar`
- Documents: `/api/upload/documents`
- Max sizes defined in both frontend and Laravel config

### Real-time Features

- WebSocket for messaging: Laravel WebSockets
- Lesson notifications: Pusher/Socket.io integration
- Live lesson status updates

## 📞 Quick Reference

### Critical Data Attributes for Backend

```html
<!-- User Tables -->
<table data-table="users" data-api="/api/admin/users">
  <!-- Forms -->
  <form data-form-action="login" data-api="/api/auth/login">
    <!-- Booking Elements -->
    <button data-action="book-lesson" data-teacher-id="123">
      <!-- Real-time Elements -->
      <div data-websocket="conversations" data-channel="user.123"></div>
    </button>
  </form>
</table>
```

This documentation provides everything needed for seamless Laravel integration!
