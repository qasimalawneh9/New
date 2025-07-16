# Laravel API Endpoint Mapping

## 🎯 Complete API Integration Guide

This document provides the complete mapping between frontend API services and Laravel backend endpoints.

## 📋 Endpoint Categories

### **🔐 Authentication Endpoints**

| Frontend Service Method        | HTTP Method | Laravel Route               | Controller Method               | Request Body                                       | Response                      |
| ------------------------------ | ----------- | --------------------------- | ------------------------------- | -------------------------------------------------- | ----------------------------- |
| `AuthService.login()`          | POST        | `/api/auth/login`           | `AuthController@login`          | `{ email, password, remember }`                    | `{ user, token, expires_in }` |
| `AuthService.register()`       | POST        | `/api/auth/register`        | `AuthController@register`       | `{ name, email, password, password_confirmation }` | `{ user, token, expires_in }` |
| `AuthService.logout()`         | POST        | `/api/auth/logout`          | `AuthController@logout`         | `{}`                                               | `{ message }`                 |
| `AuthService.refresh()`        | POST        | `/api/auth/refresh`         | `AuthController@refresh`        | `{}`                                               | `{ token, expires_in }`       |
| `AuthService.forgotPassword()` | POST        | `/api/auth/forgot-password` | `AuthController@forgotPassword` | `{ email }`                                        | `{ message }`                 |

### **👤 User Management Endpoints**

| Frontend Service Method        | HTTP Method | Laravel Route        | Controller Method               | Request Body                      | Response                  |
| ------------------------------ | ----------- | -------------------- | ------------------------------- | --------------------------------- | ------------------------- |
| `UserService.getProfile()`     | GET         | `/api/user/profile`  | `UserController@profile`        | N/A                               | `{ user, profile }`       |
| `UserService.updateProfile()`  | PUT         | `/api/user/profile`  | `UserController@update`         | `{ name, bio, avatar, ... }`      | `{ user, message }`       |
| `UserService.updateAvatar()`   | POST        | `/api/user/avatar`   | `UserController@avatar`         | `FormData with image`             | `{ avatar_url, message }` |
| `UserService.getSettings()`    | GET         | `/api/user/settings` | `UserController@settings`       | N/A                               | `{ settings }`            |
| `UserService.updateSettings()` | PUT         | `/api/user/settings` | `UserController@updateSettings` | `{ notifications, privacy, ... }` | `{ settings, message }`   |

### **👨‍🏫 Teacher Management Endpoints**

| Frontend Service Method               | HTTP Method | Laravel Route                     | Controller Method                      | Request Body                                                           | Response                      |
| ------------------------------------- | ----------- | --------------------------------- | -------------------------------------- | ---------------------------------------------------------------------- | ----------------------------- |
| `TeacherService.getAll()`             | GET         | `/api/teachers`                   | `TeacherController@index`              | Query params: `page, per_page, search, language, price_min, price_max` | `PaginatedResponse<Teacher>`  |
| `TeacherService.getById()`            | GET         | `/api/teachers/{id}`              | `TeacherController@show`               | N/A                                                                    | `{ teacher, reviews, stats }` |
| `TeacherService.getAvailability()`    | GET         | `/api/teachers/{id}/availability` | `TeacherController@availability`       | Query: `date, timezone`                                                | `{ available_slots }`         |
| `TeacherService.getReviews()`         | GET         | `/api/teachers/{id}/reviews`      | `TeacherController@reviews`            | Query: `page, per_page`                                                | `PaginatedResponse<Review>`   |
| `TeacherService.apply()`              | POST        | `/api/teacher/apply`              | `TeacherApplicationController@store`   | `{ teacher_application_data }`                                         | `{ application, message }`    |
| `TeacherService.getApplication()`     | GET         | `/api/teacher/application`        | `TeacherApplicationController@show`    | N/A                                                                    | `{ application }`             |
| `TeacherService.updateProfile()`      | PUT         | `/api/teacher/profile`            | `TeacherController@updateProfile`      | `{ headline, description, hourly_rate, ... }`                          | `{ teacher, message }`        |
| `TeacherService.updateAvailability()` | PUT         | `/api/teacher/availability`       | `TeacherController@updateAvailability` | `{ availability_schedule }`                                            | `{ availability, message }`   |

### **📚 Lesson Management Endpoints**

| Frontend Service Method       | HTTP Method | Laravel Route                  | Controller Method             | Request Body                                                 | Response                       |
| ----------------------------- | ----------- | ------------------------------ | ----------------------------- | ------------------------------------------------------------ | ------------------------------ |
| `LessonService.create()`      | POST        | `/api/lessons`                 | `LessonController@store`      | `{ teacher_id, scheduled_at, duration, lesson_type, notes }` | `{ lesson, payment_intent }`   |
| `LessonService.getById()`     | GET         | `/api/lessons/{id}`            | `LessonController@show`       | N/A                                                          | `{ lesson, teacher, student }` |
| `LessonService.getUpcoming()` | GET         | `/api/lessons/upcoming`        | `LessonController@upcoming`   | Query: `user_type, limit`                                    | `{ lessons }`                  |
| `LessonService.getHistory()`  | GET         | `/api/lessons/history`         | `LessonController@history`    | Query: `page, per_page, status`                              | `PaginatedResponse<Lesson>`    |
| `LessonService.start()`       | PUT         | `/api/lessons/{id}/start`      | `LessonController@start`      | `{ meeting_url }`                                            | `{ lesson, message }`          |
| `LessonService.complete()`    | PUT         | `/api/lessons/{id}/complete`   | `LessonController@complete`   | `{ notes, homework }`                                        | `{ lesson, message }`          |
| `LessonService.cancel()`      | PUT         | `/api/lessons/{id}/cancel`     | `LessonController@cancel`     | `{ reason }`                                                 | `{ lesson, message }`          |
| `LessonService.reschedule()`  | PUT         | `/api/lessons/{id}/reschedule` | `LessonController@reschedule` | `{ new_scheduled_at }`                                       | `{ lesson, message }`          |

### **💬 Messaging Endpoints**

| Frontend Service Method               | HTTP Method | Laravel Route                      | Controller Method              | Request Body                         | Response                          |
| ------------------------------------- | ----------- | ---------------------------------- | ------------------------------ | ------------------------------------ | --------------------------------- |
| `MessageService.getConversations()`   | GET         | `/api/conversations`               | `ConversationController@index` | Query: `page, per_page`              | `PaginatedResponse<Conversation>` |
| `MessageService.getMessages()`        | GET         | `/api/conversations/{id}/messages` | `MessageController@index`      | Query: `page, per_page`              | `PaginatedResponse<Message>`      |
| `MessageService.sendMessage()`        | POST        | `/api/messages`                    | `MessageController@store`      | `{ conversation_id, content, type }` | `{ message, conversation }`       |
| `MessageService.markAsRead()`         | PUT         | `/api/messages/{id}/read`          | `MessageController@markAsRead` | N/A                                  | `{ message }`                     |
| `MessageService.createConversation()` | POST        | `/api/conversations`               | `ConversationController@store` | `{ participant_ids, subject }`       | `{ conversation, message }`       |

### **💳 Payment Endpoints**

| Frontend Service Method          | HTTP Method | Laravel Route           | Controller Method           | Request Body                                      | Response                       |
| -------------------------------- | ----------- | ----------------------- | --------------------------- | ------------------------------------------------- | ------------------------------ |
| `PaymentService.process()`       | POST        | `/api/payments`         | `PaymentController@process` | `{ amount, payment_method, lesson_id, metadata }` | `{ payment, transaction }`     |
| `PaymentService.getHistory()`    | GET         | `/api/payments/history` | `PaymentController@history` | Query: `page, per_page, type`                     | `PaginatedResponse<Payment>`   |
| `PaymentService.getWallet()`     | GET         | `/api/wallet`           | `WalletController@show`     | N/A                                               | `{ balance, transactions }`    |
| `PaymentService.topUpWallet()`   | POST        | `/api/wallet/topup`     | `WalletController@topup`    | `{ amount, payment_method }`                      | `{ transaction, new_balance }` |
| `PaymentService.requestPayout()` | POST        | `/api/payouts`          | `PayoutController@store`    | `{ amount, payout_method, details }`              | `{ payout_request, message }`  |

### **⭐ Review Endpoints**

| Frontend Service Method        | HTTP Method | Laravel Route                | Controller Method            | Request Body                            | Response                    |
| ------------------------------ | ----------- | ---------------------------- | ---------------------------- | --------------------------------------- | --------------------------- |
| `ReviewService.create()`       | POST        | `/api/reviews`               | `ReviewController@store`     | `{ lesson_id, rating, title, comment }` | `{ review, message }`       |
| `ReviewService.getByTeacher()` | GET         | `/api/teachers/{id}/reviews` | `ReviewController@byTeacher` | Query: `page, per_page, rating`         | `PaginatedResponse<Review>` |
| `ReviewService.getByUser()`    | GET         | `/api/user/reviews`          | `ReviewController@byUser`    | Query: `page, per_page, type`           | `PaginatedResponse<Review>` |
| `ReviewService.update()`       | PUT         | `/api/reviews/{id}`          | `ReviewController@update`    | `{ rating, title, comment }`            | `{ review, message }`       |

### **🏛 Admin Endpoints**

| Frontend Service Method              | HTTP Method | Laravel Route                      | Controller Method                     | Request Body                               | Response                      |
| ------------------------------------ | ----------- | ---------------------------------- | ------------------------------------- | ------------------------------------------ | ----------------------------- |
| `AdminService.getDashboard()`        | GET         | `/api/admin/dashboard`             | `AdminController@dashboard`           | N/A                                        | `{ stats, charts, activity }` |
| `AdminService.getUsers()`            | GET         | `/api/admin/users`                 | `AdminController@users`               | Query: `page, search, status`              | `PaginatedResponse<User>`     |
| `AdminService.updateUser()`          | PUT         | `/api/admin/users/{id}`            | `AdminController@updateUser`          | `{ status, role, notes }`                  | `{ user, message }`           |
| `AdminService.getTeachers()`         | GET         | `/api/admin/teachers`              | `AdminController@teachers`            | Query: `page, status, search`              | `PaginatedResponse<Teacher>`  |
| `AdminService.approveTeacher()`      | PUT         | `/api/admin/teachers/{id}/approve` | `AdminController@approveTeacher`      | `{ notes }`                                | `{ teacher, message }`        |
| `AdminService.rejectTeacher()`       | PUT         | `/api/admin/teachers/{id}/reject`  | `AdminController@rejectTeacher`       | `{ reason, notes }`                        | `{ teacher, message }`        |
| `AdminService.getPayouts()`          | GET         | `/api/admin/payouts`               | `AdminController@payouts`             | Query: `page, status, search`              | `PaginatedResponse<Payout>`   |
| `AdminService.approvePayout()`       | PUT         | `/api/admin/payouts/{id}/approve`  | `AdminController@approvePayout`       | `{ notes }`                                | `{ payout, message }`         |
| `AdminService.getTrialSettings()`    | GET         | `/api/admin/trial-settings`        | `AdminController@trialSettings`       | N/A                                        | `{ settings }`                |
| `AdminService.updateTrialSettings()` | PUT         | `/api/admin/trial-settings`        | `AdminController@updateTrialSettings` | `{ duration, price, max_trials, enabled }` | `{ settings, message }`       |

## 🛠 Request/Response Formats

### **Authentication Response Format**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "type": "student|teacher|admin",
      "avatar": "https://example.com/avatar.jpg",
      "is_tutor": false,
      "is_admin": false
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
    "expires_in": 3600
  },
  "message": "Login successful"
}
```

### **Validation Error Response Format**

```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### **Paginated Response Format**

```json
{
  "data": [...],
  "current_page": 1,
  "first_page_url": "http://localhost:8000/api/teachers?page=1",
  "from": 1,
  "last_page": 5,
  "last_page_url": "http://localhost:8000/api/teachers?page=5",
  "next_page_url": "http://localhost:8000/api/teachers?page=2",
  "path": "http://localhost:8000/api/teachers",
  "per_page": 15,
  "prev_page_url": null,
  "to": 15,
  "total": 67
}
```

## 🔒 Authentication & Middleware

### **Required Headers for Protected Routes**

```typescript
{
  "Authorization": "Bearer {jwt_token}",
  "Content-Type": "application/json",
  "Accept": "application/json",
  "X-Requested-With": "XMLHttpRequest"
}
```

### **Laravel Middleware Groups**

| Route Group | Middleware              | Description         |
| ----------- | ----------------------- | ------------------- |
| Public      | `web`                   | No authentication   |
| Protected   | `auth:sanctum`          | Authenticated users |
| Teacher     | `auth:sanctum, teacher` | Teachers only       |
| Admin       | `auth:sanctum, admin`   | Administrators only |

## 🚀 Implementation Priority

### **Phase 1: Core Authentication & Users** (Week 1)

- AuthController (login, register, logout)
- UserController (profile, settings)
- Middleware setup

### **Phase 2: Teachers & Lessons** (Week 2)

- TeacherController (listing, profiles, applications)
- LessonController (booking, management)
- Payment integration

### **Phase 3: Communication & Reviews** (Week 3)

- MessageController & WebSocket setup
- ReviewController
- Real-time notifications

### **Phase 4: Admin Panel** (Week 4)

- AdminController
- Advanced analytics
- System management

## 📊 Database Models Required

Each endpoint corresponds to these Laravel Eloquent models:

- `User` (users table)
- `UserProfile` (user_profiles table)
- `Teacher` / `TutorProfile` (tutor_profiles table)
- `Lesson` (lessons table)
- `Message` (messages table)
- `Conversation` (conversations table)
- `Payment` (payments table)
- `Review` (reviews table)
- `TeacherApplication` (teacher_applications table)

## 🔧 Quick Setup Commands

```bash
# Create controllers
php artisan make:controller AuthController
php artisan make:controller UserController
php artisan make:controller TeacherController
php artisan make:controller LessonController
php artisan make:controller MessageController
php artisan make:controller PaymentController
php artisan make:controller ReviewController
php artisan make:controller AdminController

# Create middleware
php artisan make:middleware TeacherMiddleware
php artisan make:middleware AdminMiddleware

# Create API resources
php artisan make:resource UserResource
php artisan make:resource TeacherResource
php artisan make:resource LessonResource
```

This mapping provides complete Laravel backend integration requirements!
