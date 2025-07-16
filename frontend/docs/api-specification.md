# Talkcon API Specification for Laravel Backend

## Overview

This document outlines the API endpoints and data structures needed for the Talkcon language learning platform backend.

## Base URL

```
https://your-domain.com/api/v1
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {token}
```

## Data Models

### User

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "type": "student|teacher|admin",
  "avatar": "string|null",
  "status": "active|suspended",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Student (extends User)

```json
{
  "learning_languages": ["string"],
  "native_language": "string",
  "level": { "language": "level" },
  "completed_lessons": "number",
  "hours_learned": "number",
  "wallet_balance": "number"
}
```

### Teacher (extends User)

```json
{
  "languages": ["string"],
  "native_language": "string",
  "rating": "number",
  "review_count": "number",
  "price": "number",
  "currency": "string",
  "availability": ["string"],
  "specialties": ["string"],
  "experience": "number",
  "description": "string",
  "video": "string",
  "is_online": "boolean",
  "response_time": "string",
  "completed_lessons": "number",
  "badges": ["string"],
  "country": "string",
  "timezone": "string",
  "status": "pending|approved|rejected",
  "earnings": "number",
  "meeting_platforms": {
    "zoom": "string|null",
    "google_meet": "string|null",
    "skype": "string|null",
    "voov": "string|null",
    "preferred_platform": "string|null"
  }
}
```

## API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset

### Users

- `GET /users` - Get all users (admin only)
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user (admin only)
- `GET /users/{id}/transactions` - Get user wallet transactions

### Teachers

- `GET /teachers` - Get all approved teachers
- `GET /teachers/{id}` - Get teacher by ID
- `POST /teachers/apply` - Submit teacher application
- `GET /teachers/applications` - Get teacher applications (admin only)
- `PUT /teachers/{id}/approve` - Approve teacher (admin only)
- `PUT /teachers/{id}/reject` - Reject teacher (admin only)
- `PUT /teachers/{id}/meeting-platforms` - Update meeting platforms

### Lessons

- `GET /lessons` - Get lessons
- `POST /lessons` - Create lesson
- `GET /lessons/{id}` - Get lesson by ID
- `PUT /lessons/{id}` - Update lesson
- `DELETE /lessons/{id}` - Cancel lesson
- `GET /lessons/{id}/meeting-info` - Get lesson meeting information

### Bookings

- `POST /bookings` - Create booking
- `GET /bookings` - Get user bookings
- `PUT /bookings/{id}/confirm` - Confirm booking
- `PUT /bookings/{id}/cancel` - Cancel booking

### Payments & Wallet

- `GET /wallet/balance` - Get wallet balance
- `POST /wallet/recharge` - Recharge wallet
- `GET /wallet/transactions` - Get wallet transactions
- `POST /payments/lesson` - Process lesson payment

### Payouts (Teachers)

- `POST /payouts/request` - Request payout
- `GET /payouts` - Get payout requests
- `PUT /payouts/{id}/approve` - Approve payout (admin only)
- `PUT /payouts/{id}/reject` - Reject payout (admin only)

### Community

- `GET /community/posts` - Get community posts
- `POST /community/posts` - Create post
- `GET /community/events` - Get events
- `POST /community/events` - Create event

### Admin

- `GET /admin/stats` - Get platform statistics
- `GET /admin/activities` - Get recent activities
- `GET /admin/users` - Get users with filters
- `GET /admin/teachers` - Get teachers with filters

## Request/Response Examples

### Login Request

```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "name": "John Doe",
      "email": "user@example.com",
      "type": "student"
    },
    "token": "jwt_token_here"
  }
}
```

### Teacher Registration Request

```json
POST /teachers/apply
{
  "first_name": "Maria",
  "last_name": "Garcia",
  "email": "maria@example.com",
  "password": "password123",
  "languages": ["Spanish", "English"],
  "native_language": "Spanish",
  "hourly_rate": 25,
  "experience": 5,
  "country": "Spain",
  "timezone": "Europe/Madrid",
  "specialties": ["Grammar", "Conversation"],
  "description": "Experienced Spanish teacher...",
  "intro_video": "https://youtube.com/watch?v=..."
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error
