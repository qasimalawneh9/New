# Laravel Backend Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing the Talkcon language learning platform backend using Laravel.

## Prerequisites

- PHP >= 8.1
- Composer
- MySQL >= 8.0
- Node.js & NPM (for asset compilation)

## Installation Steps

### 1. Create Laravel Project

```bash
composer create-project laravel/laravel talkcon-backend
cd talkcon-backend
```

### 2. Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

Update `.env` file:

```env
APP_NAME=Talkcon
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=talkcon
DB_USERNAME=your_username
DB_PASSWORD=your_password

FRONTEND_URL=http://localhost:3000

JWT_SECRET=your_jwt_secret_here
```

### 3. Install Required Packages

```bash
# Authentication
composer require tymon/jwt-auth

# API Resources
composer require spatie/laravel-query-builder

# File uploads
composer require spatie/laravel-medialibrary

# Notifications
composer require laravel/sanctum

# Development tools
composer require --dev laravel/telescope
```

### 4. Database Setup

Create the database:

```sql
CREATE DATABASE talkcon;
```

Run the provided schema file:

```bash
mysql -u your_username -p talkcon < docs/database-schema.sql
```

Or create migrations:

```bash
php artisan make:migration create_users_table
php artisan make:migration create_student_profiles_table
php artisan make:migration create_teacher_profiles_table
# ... continue for all tables
```

### 5. Model Structure

Create models with relationships:

```bash
php artisan make:model User
php artisan make:model StudentProfile
php artisan make:model TeacherProfile
php artisan make:model Lesson
php artisan make:model Booking
php artisan make:model WalletTransaction
php artisan make:model PayoutRequest
php artisan make:model Review
php artisan make:model Message
php artisan make:model CommunityPost
php artisan make:model CommunityEvent
php artisan make:model ActivityLog
```

### 6. Controllers

Create API controllers:

```bash
php artisan make:controller Api/AuthController
php artisan make:controller Api/UserController
php artisan make:controller Api/TeacherController
php artisan make:controller Api/LessonController
php artisan make:controller Api/BookingController
php artisan make:controller Api/WalletController
php artisan make:controller Api/PaymentController
php artisan make:controller Api/PayoutController
php artisan make:controller Api/CommunityController
php artisan make:controller Api/AdminController
```

### 7. API Routes

Update `routes/api.php`:

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TeacherController;
// ... other imports

// Public routes
Route::prefix('v1')->group(function () {
    // Authentication
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

    // Public teacher listings
    Route::get('/teachers', [TeacherController::class, 'index']);
    Route::get('/teachers/{id}', [TeacherController::class, 'show']);
});

// Protected routes
Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {
    // Authentication
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    // Users
    Route::apiResource('users', UserController::class);
    Route::get('/users/{id}/transactions', [UserController::class, 'transactions']);

    // Teachers
    Route::post('/teachers/apply', [TeacherController::class, 'apply']);
    Route::put('/teachers/{id}/meeting-platforms', [TeacherController::class, 'updateMeetingPlatforms']);

    // Lessons
    Route::apiResource('lessons', LessonController::class);
    Route::get('/lessons/{id}/meeting-info', [LessonController::class, 'meetingInfo']);

    // Bookings
    Route::apiResource('bookings', BookingController::class);
    Route::put('/bookings/{id}/confirm', [BookingController::class, 'confirm']);
    Route::put('/bookings/{id}/cancel', [BookingController::class, 'cancel']);

    // Wallet & Payments
    Route::get('/wallet/balance', [WalletController::class, 'balance']);
    Route::post('/wallet/recharge', [WalletController::class, 'recharge']);
    Route::get('/wallet/transactions', [WalletController::class, 'transactions']);
    Route::post('/payments/lesson', [PaymentController::class, 'processLessonPayment']);

    // Payouts
    Route::post('/payouts/request', [PayoutController::class, 'request']);
    Route::get('/payouts', [PayoutController::class, 'index']);

    // Community
    Route::get('/community/posts', [CommunityController::class, 'posts']);
    Route::post('/community/posts', [CommunityController::class, 'createPost']);
    Route::get('/community/events', [CommunityController::class, 'events']);
    Route::post('/community/events', [CommunityController::class, 'createEvent']);
});

// Admin routes
Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/stats', [AdminController::class, 'stats']);
    Route::get('/activities', [AdminController::class, 'activities']);
    Route::get('/users', [AdminController::class, 'users']);
    Route::get('/teachers', [AdminController::class, 'teachers']);
    Route::get('/teachers/applications', [AdminController::class, 'teacherApplications']);
    Route::put('/teachers/{id}/approve', [AdminController::class, 'approveTeacher']);
    Route::put('/teachers/{id}/reject', [AdminController::class, 'rejectTeacher']);
    Route::put('/payouts/{id}/approve', [AdminController::class, 'approvePayout']);
    Route::put('/payouts/{id}/reject', [AdminController::class, 'rejectPayout']);
});
```

### 8. Middleware

Create admin middleware:

```bash
php artisan make:middleware AdminMiddleware
```

### 9. Request Validation

Create form requests:

```bash
php artisan make:request LoginRequest
php artisan make:request RegisterRequest
php artisan make:request TeacherApplicationRequest
php artisan make:request BookingRequest
php artisan make:request WalletRechargeRequest
```

### 10. API Resources

Create API resources for consistent responses:

```bash
php artisan make:resource UserResource
php artisan make:resource TeacherResource
php artisan make:resource LessonResource
php artisan make:resource BookingResource
```

## Key Implementation Points

### Authentication

Use Laravel Sanctum for API authentication:

```php
// In AuthController
public function login(LoginRequest $request)
{
    $credentials = $request->validated();

    if (!Auth::attempt($credentials)) {
        return response()->json([
            'success' => false,
            'error' => 'Invalid credentials'
        ], 401);
    }

    $user = Auth::user();
    $token = $user->createToken('auth-token')->plainTextToken;

    return response()->json([
        'success' => true,
        'data' => [
            'user' => new UserResource($user),
            'token' => $token
        ]
    ]);
}
```

### File Uploads

Handle avatar and video uploads:

```php
// In TeacherController
public function apply(TeacherApplicationRequest $request)
{
    $data = $request->validated();

    if ($request->hasFile('intro_video')) {
        $videoPath = $request->file('intro_video')->store('teacher-videos', 'public');
        $data['video_url'] = Storage::url($videoPath);
    }

    // Create teacher application...
}
```

### Payment Integration

Integrate with payment providers:

```php
// In PaymentController
public function processLessonPayment(Request $request)
{
    // Integrate with Stripe, PayPal, etc.
    // Handle payment processing
    // Update wallet balances
    // Create transaction records
}
```

### Real-time Features

Use Laravel Broadcasting for real-time features:

```bash
composer require pusher/pusher-php-server
```

### Testing

Create comprehensive tests:

```bash
php artisan make:test AuthTest
php artisan make:test TeacherTest
php artisan make:test LessonTest
```

## Deployment

### Production Checklist

1. Configure production environment variables
2. Set up SSL certificates
3. Configure database backups
4. Set up monitoring (Laravel Telescope, Sentry)
5. Configure queues for background jobs
6. Set up CORS for frontend integration

### CORS Configuration

Update `config/cors.php`:

```php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

## Frontend Integration

The frontend should use the API service layer provided in `client/services/api.service.ts` to communicate with the Laravel backend. Update the `VITE_API_URL` environment variable to point to your Laravel API endpoint.

## Security Considerations

1. Use HTTPS in production
2. Implement rate limiting
3. Validate all inputs
4. Sanitize user data
5. Use prepared statements for database queries
6. Implement proper error handling
7. Regular security updates

## Performance Optimization

1. Database indexing
2. Query optimization
3. Caching (Redis)
4. Image optimization
5. CDN for static assets
6. Database connection pooling
