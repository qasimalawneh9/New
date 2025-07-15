# Frontend-Backend Separation Guide

## Overview

This document explains how the frontend code is organized to make it easy to develop a separate Laravel backend while keeping the React frontend clean and maintainable.

## Current Structure

The frontend has been organized into clear layers that separate concerns:

### 1. **API Service Layer** (`client/services/`)

All backend communication is centralized in service files:

- `api.service.ts` - Main API client with all endpoints
- Each service maps directly to Laravel API endpoints
- Consistent error handling and response formatting
- Token management for authentication

### 2. **Type Definitions** (`client/types/`)

- `laravel-api.ts` - TypeScript interfaces matching Laravel models
- Clear data contracts between frontend and backend
- API request/response types

### 3. **UI Components** (`client/components/`)

Separated into layers:

- **Layout**: Page layouts and navigation
- **Common**: Reusable UI components
- **UI**: Base design system components

### 4. **Business Logic** (`client/lib/`)

- `constants.ts` - Configuration values
- `utils.ts` - Helper functions
- `api.ts` - Simplified API wrapper (for local development)

## For Laravel Backend Development

### What You Need From Frontend

1. **API Specification** (`docs/api-specification.md`)

   - Complete list of endpoints
   - Request/response formats
   - Authentication requirements

2. **Database Schema** (`docs/database-schema.sql`)

   - Complete MySQL schema
   - All tables and relationships
   - Indexes and constraints

3. **Data Types** (`client/types/laravel-api.ts`)

   - TypeScript interfaces for all models
   - Request/response types
   - Filter and pagination types

4. **API Service Layer** (`client/services/api.service.ts`)
   - Frontend implementation reference
   - Expected request/response formats

### What You Can Ignore

1. **Current Database Simulation** (`client/lib/database.ts`)

   - This is only for frontend development
   - Will be replaced by Laravel API calls

2. **Demo Data** (`client/lib/demo-data.ts`)

   - Sample data for development
   - Not needed for backend

3. **Local Storage Logic**
   - Authentication context using localStorage
   - Will use proper JWT tokens from Laravel

## Migration Steps

### Step 1: Set Up Laravel Backend

Follow the `docs/laravel-implementation-guide.md` to:

1. Create Laravel project
2. Set up database using provided schema
3. Create models and relationships
4. Implement API endpoints

### Step 2: Update Frontend Configuration

1. Update environment variables:

```env
# .env.local
VITE_API_URL=http://localhost:8000/api/v1
```

2. Replace database service imports:

```typescript
// Before (local development)
import { db } from "@/lib/database";

// After (Laravel backend)
import { authApi, usersApi, teachersApi } from "@/services/api.service";
```

### Step 3: Update Components

Replace local database calls with API calls:

```typescript
// Before
const users = db.getUsers();

// After
const { data: users, error } = await handleApiResponse(usersApi.getAll());
```

### Step 4: Update Authentication

Replace local auth with Laravel authentication:

```typescript
// In AuthContext.tsx
const login = async (email: string, password: string) => {
  const { data, error } = await handleApiResponse(
    authApi.login(email, password),
  );

  if (data) {
    apiClient.setToken(data.token);
    setUser(data.user);
    return true;
  }

  return false;
};
```

## File Organization for Backend Development

### Essential Files for Backend Reference:

```
docs/
├── api-specification.md      # Complete API documentation
├── database-schema.sql       # MySQL database schema
├── laravel-implementation-guide.md  # Step-by-step backend guide
└── frontend-backend-separation.md   # This file

client/services/
└── api.service.ts           # Complete API client implementation

client/types/
└── laravel-api.ts          # All TypeScript interfaces
```

### Files You Can Skip:

```
client/lib/
├── database.ts             # Local simulation only
└── demo-data.ts           # Sample data only

client/contexts/
└── AuthContext.tsx        # Contains local auth logic
```

## Environment Setup

### Development Environment

1. **Frontend** (React + Vite)

   ```bash
   npm run dev  # Runs on http://localhost:3000
   ```

2. **Backend** (Laravel)
   ```bash
   php artisan serve  # Runs on http://localhost:8000
   ```

### Environment Variables

**Frontend** (`.env.local`):

```env
VITE_API_URL=http://localhost:8000/api/v1
```

**Backend** (`.env`):

```env
FRONTEND_URL=http://localhost:3000
```

## API Integration Examples

### Authentication

```typescript
// Login
const response = await authApi.login(email, password);

// Register
const response = await authApi.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  password_confirmation: "password123",
  type: "student",
});
```

### Data Fetching

```typescript
// Get teachers
const teachers = await teachersApi.getAll();

// Get user lessons
const lessons = await lessonsApi.getAll({ student_id: userId });

// Create booking
const booking = await bookingsApi.create({
  teacher_id: 1,
  date: "2024-02-15",
  time: "14:00",
  duration: 60,
  language: "Spanish",
});
```

## Benefits of This Separation

1. **Clean Architecture**: Clear separation between UI and data layers
2. **Type Safety**: TypeScript interfaces ensure consistency
3. **Easy Migration**: Simple to switch from local to Laravel backend
4. **Maintainable**: Changes to backend don't break frontend structure
5. **Testable**: Each layer can be tested independently

## Next Steps

1. Review the API specification and database schema
2. Set up Laravel backend following the implementation guide
3. Update frontend environment variables
4. Replace local database calls with API service calls
5. Test integration between frontend and backend

The frontend is now organized to make backend development straightforward and maintainable!
