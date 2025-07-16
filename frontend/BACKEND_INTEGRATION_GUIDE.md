# Backend Integration Guide for Talkcon Frontend

This document provides a comprehensive guide for backend developers to understand the frontend structure and implement the necessary API endpoints.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Frontend Architecture](#frontend-architecture)
- [API Requirements](#api-requirements)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [File Upload Requirements](#file-upload-requirements)
- [Real-time Features](#real-time-features)
- [Testing Guidelines](#testing-guidelines)
- [Deployment Considerations](#deployment-considerations)

## 🎯 Project Overview

Talkcon is a language learning platform that connects students with native-speaking teachers for online lessons. The platform supports:

- User registration and authentication (students, teachers, admins)
- Teacher application and approval process
- Lesson booking and scheduling
- Video conferencing integration
- Payment processing and wallet system
- Messaging between users
- Review and rating system
- Admin dashboard for platform management

## 🏗️ Frontend Architecture

### Directory Structure

```
client/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── auth/           # Authentication components
│   ├── booking/        # Lesson booking components
│   ├── messaging/      # Chat and messaging components
│   └── admin/          # Admin dashboard components
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── config/             # Configuration and constants
└── contexts/           # React context providers
```

### Key Files for Backend Integration

| File                  | Purpose                   | Backend Relevance                           |
| --------------------- | ------------------------- | ------------------------------------------- |
| `types/api.ts`        | API type definitions      | **CRITICAL** - Defines all API contracts    |
| `services/api.ts`     | API service layer         | **CRITICAL** - Shows all required endpoints |
| `config/constants.ts` | Application constants     | **IMPORTANT** - Configuration values        |
| `hooks/useApi.ts`     | React hooks for API calls | **HELPFUL** - Shows data flow patterns      |

## 🔌 API Requirements

### Base API Configuration

- **Base URL**: `/api` (configurable via `REACT_APP_API_URL`)
- **Content Type**: `application/json`
- **Authentication**: Bearer token in Authorization header
- **Response Format**: Consistent API response wrapper

### Required Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>; // Laravel validation errors
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
}
```

### Core API Endpoints

#### Authentication Endpoints

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/verify-email/{id}/{hash}
POST   /api/auth/email/verification-notification
```

#### User Management

```
GET    /api/user/profile
PUT    /api/user/profile
POST   /api/user/avatar
DELETE /api/user/account
PUT    /api/user/password
```

#### Teacher Endpoints

```
GET    /api/teachers                    # List all teachers with filters
GET    /api/teachers/{id}               # Get teacher details
GET    /api/teachers/{id}/availability  # Get teacher availability
PUT    /api/teacher/availability        # Update teacher availability
PUT    /api/teacher/profile            # Update teacher profile
GET    /api/teacher/students           # Get teacher's students
GET    /api/teacher/earnings           # Get earnings data
POST   /api/teacher/payout-request     # Request payout
```

#### Student Endpoints

```
PUT    /api/student/profile                    # Update student profile
GET    /api/student/teachers                   # Get student's teachers
POST   /api/student/favorites/{teacherId}      # Add to favorites
DELETE /api/student/favorites/{teacherId}      # Remove from favorites
GET    /api/student/wallet/balance             # Get wallet balance
POST   /api/student/wallet/topup              # Top up wallet
GET    /api/student/wallet/transactions        # Get wallet transactions
```

#### Lesson Management

```
GET    /api/lessons                    # List lessons with filters
GET    /api/lessons/{id}               # Get lesson details
POST   /api/lessons                    # Create lesson
PUT    /api/lessons/{id}               # Update lesson
POST   /api/lessons/{id}/cancel        # Cancel lesson
POST   /api/lessons/{id}/reschedule    # Reschedule lesson
POST   /api/lessons/{id}/complete      # Mark lesson complete
GET    /api/lessons/{id}/meeting       # Get meeting info
POST   /api/lessons/{id}/recording     # Upload recording
```

#### Booking System

```
POST   /api/bookings                   # Create booking
GET    /api/bookings/{id}              # Get booking details
POST   /api/bookings/{id}/confirm      # Confirm booking
POST   /api/bookings/{id}/cancel       # Cancel booking
GET    /api/bookings/my                # Get user's bookings
```

#### Messaging

```
GET    /api/conversations              # List conversations
GET    /api/conversations/{id}         # Get conversation details
POST   /api/messages                   # Send message
POST   /api/messages/{id}/read         # Mark message as read
POST   /api/conversations/{id}/attachment  # Upload attachment
```

#### Reviews

```
GET    /api/teachers/{id}/reviews      # Get teacher reviews
POST   /api/reviews                    # Submit review
PUT    /api/reviews/{id}               # Update review
DELETE /api/reviews/{id}               # Delete review
```

#### Admin Endpoints

```
GET    /api/admin/stats                           # Platform statistics
GET    /api/admin/users                           # List all users
GET    /api/admin/teachers                        # List all teachers
GET    /api/admin/teacher-applications            # Teacher applications
POST   /api/admin/teacher-applications/{id}/approve  # Approve teacher
POST   /api/admin/teacher-applications/{id}/reject   # Reject teacher
POST   /api/admin/users/{id}/suspend              # Suspend user
POST   /api/admin/users/{id}/reactivate           # Reactivate user
GET    /api/admin/payout-requests                 # List payout requests
POST   /api/admin/payout-requests/{id}/{action}  # Process payout
```

### Query Parameters and Filters

#### Teacher Search Filters

- `languages[]`: Array of languages
- `price_min`: Minimum price
- `price_max`: Maximum price
- `rating_min`: Minimum rating
- `availability_day`: Day of week
- `availability_time`: Time slot
- `specializations[]`: Array of specializations
- `is_native`: Boolean for native speakers
- `has_trial`: Boolean for trial availability

#### Lesson Filters

- `status[]`: Array of lesson statuses
- `date_from`: Start date
- `date_to`: End date
- `teacher_id`: Filter by teacher
- `student_id`: Filter by student
- `language`: Filter by language

## 🗄️ Database Schema

### Core Tables Required

#### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('student', 'teacher', 'admin') NOT NULL,
    avatar VARCHAR(255) NULL,
    phone VARCHAR(50) NULL,
    date_of_birth DATE NULL,
    country VARCHAR(100) NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    preferred_language VARCHAR(50) DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    last_active_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Student Profiles Table

```sql
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    learning_languages JSON NOT NULL,
    native_language VARCHAR(50) NOT NULL,
    language_levels JSON NULL,
    learning_goals JSON NULL,
    completed_lessons INT DEFAULT 0,
    total_hours_learned DECIMAL(8,2) DEFAULT 0,
    trial_lessons_used INT DEFAULT 0,
    wallet_balance DECIMAL(10,2) DEFAULT 0,
    subscription_status ENUM('active', 'inactive', 'cancelled') NULL,
    subscription_plan VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Teacher Profiles Table

```sql
CREATE TABLE teacher_profiles (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    bio TEXT NOT NULL,
    languages JSON NOT NULL,
    native_language VARCHAR(50) NOT NULL,
    specializations JSON NOT NULL,
    experience_years INT NOT NULL,
    education TEXT NOT NULL,
    certifications JSON NOT NULL,
    hourly_rate DECIMAL(8,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INT DEFAULT 0,
    total_lessons INT DEFAULT 0,
    total_students INT DEFAULT 0,
    response_time_hours INT DEFAULT 24,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    status ENUM('active', 'suspended', 'inactive') DEFAULT 'active',
    meeting_platforms JSON NULL,
    bank_details JSON NULL,
    paypal_email VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Lessons Table

```sql
CREATE TABLE lessons (
    id UUID PRIMARY KEY,
    teacher_id UUID NOT NULL,
    student_id UUID NOT NULL,
    title VARCHAR(255) NULL,
    description TEXT NULL,
    language VARCHAR(50) NOT NULL,
    level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INT NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    lesson_type ENUM('trial', 'regular', 'package') NOT NULL,
    meeting_platform ENUM('zoom', 'google_meet', 'skype') NOT NULL,
    meeting_url VARCHAR(512) NULL,
    meeting_id VARCHAR(255) NULL,
    meeting_password VARCHAR(255) NULL,
    materials JSON NULL,
    homework TEXT NULL,
    teacher_notes TEXT NULL,
    student_notes TEXT NULL,
    recording_url VARCHAR(512) NULL,
    teacher_rating INT NULL,
    student_rating INT NULL,
    teacher_feedback TEXT NULL,
    student_feedback TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
);
```

[Continue with more tables: bookings, reviews, messages, conversations, payments, etc.]

## 🔐 Authentication & Authorization

### JWT Token Structure

```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "user_type": "student|teacher|admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Permission System

```php
// Laravel example - Role-based permissions
class User extends Model
{
    public function canBook(): bool
    {
        return $this->user_type === 'student';
    }

    public function canTeach(): bool
    {
        return $this->user_type === 'teacher' &&
               $this->teacher_profile?->verification_status === 'approved';
    }

    public function canAccessAdmin(): bool
    {
        return $this->user_type === 'admin';
    }
}
```

## 📁 File Upload Requirements

### File Types and Limits

| File Type  | Max Size | Allowed Formats | Purpose                     |
| ---------- | -------- | --------------- | --------------------------- |
| Avatar     | 2MB      | JPG, PNG, WebP  | User profile pictures       |
| Documents  | 10MB     | PDF, DOC, DOCX  | Teacher certifications      |
| Videos     | 100MB    | MP4, WebM, MOV  | Teacher introduction videos |
| Recordings | 500MB    | MP4, WebM       | Lesson recordings           |

### Upload Endpoints

```
POST /api/user/avatar
POST /api/teacher-applications/documents/{type}
POST /api/teacher-applications/video
POST /api/lessons/{id}/recording
POST /api/conversations/{id}/attachment
```

### Response Format

```json
{
  "success": true,
  "data": {
    "file_url": "https://storage.example.com/path/to/file.jpg",
    "file_name": "original_name.jpg",
    "file_size": 1024000,
    "file_type": "image/jpeg"
  }
}
```

## 🔄 Real-time Features

### WebSocket/Pusher Integration

The frontend expects real-time updates for:

1. **New Messages**: Instant message delivery
2. **Lesson Notifications**: Lesson reminders and updates
3. **Booking Updates**: Real-time booking confirmations
4. **Admin Notifications**: Platform updates for admins

### Pusher Channels

```javascript
// Example channel subscriptions
const userChannel = pusher.subscribe(`user.${userId}`);
const conversationChannel = pusher.subscribe(`conversation.${conversationId}`);
const adminChannel = pusher.subscribe("admin.updates");
```

### Event Types

- `message.sent`
- `lesson.reminder`
- `booking.confirmed`
- `booking.cancelled`
- `payout.processed`
- `application.reviewed`

## 🧪 Testing Guidelines

### API Testing Requirements

1. **Unit Tests**: Test all service methods
2. **Integration Tests**: Test API endpoints
3. **Authentication Tests**: Verify token handling
4. **Permission Tests**: Test role-based access
5. **Validation Tests**: Test input validation
6. **File Upload Tests**: Test file handling

### Test Data Requirements

The backend should provide test data endpoints for development:

```
POST /api/test/seed-users
POST /api/test/seed-teachers
POST /api/test/seed-lessons
DELETE /api/test/clear-data
```

### Mock Data Examples

```json
// Example test user
{
  "name": "John Doe",
  "email": "john@example.com",
  "user_type": "student",
  "student_profile": {
    "learning_languages": ["Spanish", "French"],
    "native_language": "English",
    "language_levels": {
      "Spanish": "intermediate",
      "French": "beginner"
    }
  }
}
```

## 🚀 Deployment Considerations

### Environment Variables

```env
# Database
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=talkcon
DB_USERNAME=user
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_TTL=1440

# File Storage
FILESYSTEM_DRIVER=s3
AWS_ACCESS_KEY_ID=key
AWS_SECRET_ACCESS_KEY=secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=talkcon-files

# Payment Processing
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
PAYPAL_CLIENT_ID=client_id
PAYPAL_CLIENT_SECRET=secret

# Video Conferencing
ZOOM_API_KEY=key
ZOOM_API_SECRET=secret

# Real-time
PUSHER_APP_ID=app_id
PUSHER_APP_KEY=app_key
PUSHER_APP_SECRET=secret
PUSHER_APP_CLUSTER=us2

# Email
MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@mg.talkcon.com
MAIL_PASSWORD=password
```

### Performance Considerations

1. **Database Indexing**: Index frequently queried columns
2. **Caching**: Implement Redis caching for frequently accessed data
3. **File Storage**: Use CDN for file delivery
4. **API Rate Limiting**: Implement rate limiting for API endpoints
5. **Database Optimization**: Use query optimization and connection pooling

### Security Requirements

1. **Input Validation**: Validate all user inputs
2. **SQL Injection Prevention**: Use parameterized queries
3. **XSS Prevention**: Sanitize output
4. **CSRF Protection**: Implement CSRF tokens
5. **File Upload Security**: Validate file types and scan for malware
6. **API Security**: Implement proper authentication and authorization

## 📞 API Integration Examples

### Authentication Flow

```php
// Laravel example
public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (!$token = auth()->attempt($credentials)) {
        return response()->json([
            'success' => false,
            'error' => 'Invalid credentials'
        ], 401);
    }

    return response()->json([
        'success' => true,
        'data' => [
            'user' => auth()->user(),
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]
    ]);
}
```

### Teacher Search with Filters

```php
public function index(Request $request)
{
    $query = User::with('teacher_profile')
        ->where('user_type', 'teacher')
        ->whereHas('teacher_profile', function ($q) {
            $q->where('verification_status', 'approved')
              ->where('status', 'active');
        });

    // Apply filters
    if ($request->has('languages')) {
        $query->whereHas('teacher_profile', function ($q) use ($request) {
            $q->whereJsonContains('languages', $request->languages);
        });
    }

    if ($request->has('price_min')) {
        $query->whereHas('teacher_profile', function ($q) use ($request) {
            $q->where('hourly_rate', '>=', $request->price_min);
        });
    }

    // Add more filters...

    $teachers = $query->paginate(12);

    return response()->json([
        'success' => true,
        'data' => $teachers->items(),
        'meta' => [
            'current_page' => $teachers->currentPage(),
            'last_page' => $teachers->lastPage(),
            'per_page' => $teachers->perPage(),
            'total' => $teachers->total(),
        ]
    ]);
}
```

## 📋 Checklist for Backend Implementation

### Core Features

- [ ] User authentication system
- [ ] User registration and email verification
- [ ] Password reset functionality
- [ ] User profile management
- [ ] Teacher application system
- [ ] Teacher approval workflow
- [ ] Lesson booking system
- [ ] Payment processing
- [ ] Wallet system
- [ ] Messaging system
- [ ] Review and rating system
- [ ] Admin dashboard APIs
- [ ] File upload handling
- [ ] Real-time notifications

### API Endpoints

- [ ] All authentication endpoints
- [ ] User management endpoints
- [ ] Teacher management endpoints
- [ ] Student management endpoints
- [ ] Lesson management endpoints
- [ ] Booking system endpoints
- [ ] Review system endpoints
- [ ] Messaging endpoints
- [ ] Admin endpoints
- [ ] File upload endpoints

### Database

- [ ] Database schema implemented
- [ ] Proper indexing for performance
- [ ] Database seeders for test data
- [ ] Migration files for schema changes

### Security

- [ ] JWT authentication implemented
- [ ] Role-based permissions
- [ ] Input validation
- [ ] File upload security
- [ ] API rate limiting
- [ ] CORS configuration

### Integration

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Video conferencing integration (Zoom/Google Meet)
- [ ] Email service integration
- [ ] Real-time notifications (Pusher/WebSocket)
- [ ] File storage (AWS S3/Google Cloud)

### Testing

- [ ] Unit tests for all models
- [ ] Integration tests for API endpoints
- [ ] Authentication tests
- [ ] Permission tests
- [ ] File upload tests

### Documentation

- [ ] API documentation (Swagger/Postman)
- [ ] Database schema documentation
- [ ] Setup and deployment instructions
- [ ] Environment configuration guide

---

## 📞 Support

For questions about the frontend implementation or API requirements, please contact:

- **Frontend Lead**: frontend@talkcon.com
- **Documentation**: This file and inline code comments
- **API Types**: See `client/types/api.ts` for complete type definitions
- **Constants**: See `client/config/constants.ts` for configuration values

This guide should provide everything needed to implement a backend that seamlessly integrates with the Talkcon frontend. The types and interfaces defined in the frontend serve as the contract for all API communications.
