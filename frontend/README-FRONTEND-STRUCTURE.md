# Talkcon Frontend Structure

## 📁 Project Overview

This React frontend is organized for easy Laravel backend development. The code is separated into clear layers that make it simple to extract what you need for backend development.

## 🏗️ Folder Structure

```
client/
├── components/           # UI Components
│   ├── common/          # Reusable components (Modal, Form, Loading)
│   ├── layout/          # Page layouts (PageLayout, DashboardLayout)
│   ├── ui/              # Base design system components
│   └── index.ts         # Export all components
│
├── pages/               # Page components
│   ├── Login.tsx        # Login page
│   ├── Dashboard.tsx    # Student dashboard
│   ├── TeacherDashboard.tsx  # Teacher dashboard
│   ├── AdminDashboard.tsx    # Admin dashboard
│   └── ...              # Other pages
│
├── services/            # 🚀 API Layer for Laravel
│   └── api.service.ts   # Complete API client
│
├── types/               # 🚀 TypeScript Types
│   ├── common.ts        # UI component types
│   └── laravel-api.ts   # Backend data types
│
├── lib/                 # Utilities
│   ├── constants.ts     # Configuration values
│   ├── utils.ts         # Helper functions
│   ├── database.ts      # LOCAL ONLY (ignore for backend)
│   └── demo-data.ts     # LOCAL ONLY (ignore for backend)
│
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Authentication (has local logic)
│   └── LanguageContext.tsx  # Internationalization
│
├── hooks/               # Custom hooks
│   └── useCommon.ts     # Shared hook utilities
│
├── router/              # Routing
│   ├── routes.tsx       # Route definitions
│   └── AppRouter.tsx    # Router component
│
├── providers/           # Context providers
│   └── AppProviders.tsx # All providers wrapper
│
└── config/              # Configuration
    └── components.ts    # Component configurations

docs/                    # 🚀 Backend Documentation
├── api-specification.md        # Complete API docs
├── database-schema.sql         # MySQL schema
├── laravel-implementation-guide.md  # Backend setup
└── frontend-backend-separation.md  # Integration guide
```

## 🚀 Key Files for Laravel Backend Development

### Essential Files (USE THESE):

1. **`docs/api-specification.md`** - Complete API documentation
2. **`docs/database-schema.sql`** - MySQL database schema
3. **`docs/laravel-implementation-guide.md`** - Step-by-step backend setup
4. **`client/services/api.service.ts`** - Frontend API client reference
5. **`client/types/laravel-api.ts`** - All data type definitions

### Files to Ignore (LOCAL DEVELOPMENT ONLY):

1. **`client/lib/database.ts`** - Local data simulation
2. **`client/lib/demo-data.ts`** - Sample data
3. **`client/contexts/AuthContext.tsx`** - Contains localStorage logic

## 🔧 Quick Start for Backend Development

### 1. Review the Documentation

```bash
# Read these files in order:
docs/api-specification.md
docs/database-schema.sql
docs/laravel-implementation-guide.md
```

### 2. Set Up Laravel Backend

```bash
composer create-project laravel/laravel talkcon-backend
# Follow docs/laravel-implementation-guide.md
```

### 3. Connect Frontend to Laravel

```bash
# Update environment variables
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env.local
```

## 📝 API Integration Example

The frontend is ready to connect to Laravel. Here's how:

```typescript
// Before (local development)
import { db } from "@/lib/database";
const users = db.getUsers();

// After (Laravel backend)
import { usersApi } from "@/services/api.service";
const { data: users } = await usersApi.getAll();
```

## 🎯 What Each File Does

### API Service Layer (`client/services/api.service.ts`)

- Complete API client for all endpoints
- Authentication token management
- Error handling
- Request/response formatting

### Data Types (`client/types/laravel-api.ts`)

- TypeScript interfaces for all models
- API request/response types
- Database relationship types

### Components (`client/components/`)

- **Common**: Reusable UI components (Modal, Form, Loading)
- **Layout**: Page layouts and navigation
- **UI**: Base design system components

### Pages (`client/pages/`)

- Complete page components
- Dashboard implementations
- Authentication pages

## 🔄 Migration Path

1. **Set up Laravel backend** using the provided documentation
2. **Update environment variables** to point to Laravel API
3. **Replace local database calls** with API service calls
4. **Test the integration** between frontend and backend

## 💡 Benefits of This Structure

- **Clean Separation**: UI and data layers are separate
- **Type Safety**: TypeScript ensures consistency
- **Easy Migration**: Simple to switch from local to Laravel
- **Documentation**: Complete API and database documentation
- **Maintainable**: Changes don't break the structure

## 🚀 Ready for Production

The frontend code is organized and documented to make Laravel backend development straightforward. All the tools and documentation you need are provided!

For detailed backend setup, see: `docs/laravel-implementation-guide.md`
