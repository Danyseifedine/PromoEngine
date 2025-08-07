# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PromoEngine is a full-stack promotion management system with a Laravel backend API and React TypeScript frontend. The system manages promotional rules, products, customers, and categories with a rule-based promotion engine architecture.

## Architecture

### Backend (Laravel 11)
- **API-first architecture** using Laravel Sanctum for authentication
- **Domain Models**: Products, Categories, Customers, PromotionRules, Users
- **Database**: Mysql for development
- **Rule Engine**: PromotionRule model with conditions/actions JSON fields and salience-based stacking
- **Namespace**: `App\` with standard Laravel structure

### Frontend (React + TypeScript + Vite)
- **State Management**: Zustand stores (see `src/stores/`)
- **Routing**: React Router DOM v7
- **UI Framework**: Tailwind CSS with Radix UI components and Shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **API Communication**: Axios with centralized API configuration
- **Layout System**: Multiple layouts (Admin, Auth, Guest) in `src/layouts/`

## Development Commands

### Backend Development
```bash
cd backend

# Development server
php artisan serve

# Database operations
php artisan migrate
php artisan migrate:fresh --seed
php artisan db:seed

# Testing
vendor/bin/phpunit
php artisan test

# Code formatting
vendor/bin/pint

# Debug with Telescope (visit /telescope)
php artisan telescope:install
```

### Frontend Development
```bash
cd frontend

# Development server
npm run dev

# Build for production (TypeScript compilation + Vite build)
npm run build

# Linting
npm run lint

# Preview production build
npm run preview
```

## Key Development Patterns

### Backend
- **Models**: Located in `app/Models/` with standard Eloquent relationships
- **API Controllers**: RESTful controllers organized under `app/Http/Controllers/Api/V1/`
- **API Routing**: Versioned API routes in `routes/api.php` with `/api/` prefix
- **Authentication**: Uses Laravel Sanctum with Bearer token authentication
- **Authorization**: Admin routes protected by `auth:sanctum` middleware
- **Database**: SQLite for development, migrations follow Laravel timestamp naming
- **Debugging**: Laravel Telescope integrated for request monitoring and debugging

### Frontend
- **Component Architecture**: Reusable UI components in `src/components/ui/`, admin-specific components in `src/components/admin/`
- **Layout System**: Multiple layout components (AdminLayout, AuthLayout, GuestLayout) in `src/layouts/`
- **API Layer**: Centralized Axios client in `src/lib/api.ts` with automatic Bearer token injection
- **State Management**: Zustand stores for each domain (auth, categories, products, etc.)
- **Routing**: React Router DOM v7 with middleware components for route protection
- **Form Handling**: React Hook Form with Zod validation schemas
- **Styling**: Tailwind CSS with Radix UI primitives and Shadcn/ui components
- **Type Safety**: Full TypeScript with strict configuration

## API Structure

The backend follows RESTful conventions with these key endpoints:
- **Authentication**: `/api/auth/*` - login, register, logout, user profile
- **Admin Stats**: `/api/admin/stats` - dashboard statistics
- **User Management**: `/api/admin/users` - CRUD operations for users
- **Categories**: `/api/admin/categories` - full CRUD for product categories
- **Products**: `/api/admin/products` - full CRUD for products
- **Test Endpoint**: `/api/test` - API health check

All admin routes require `auth:sanctum` middleware and return JSON responses.

## Database Schema

Key entity relationships:
- **Products** belong to **Categories** (foreign key: `category_id`)
- **Customers** belong to **Users** (for customer profile data)
- **Users** have API tokens via Laravel Sanctum (`personal_access_tokens` table)
- **PromotionRules** are standalone entities with JSON `conditions` and `actions` fields

The promotion engine uses:
- **Salience**: Priority ordering for rule application
- **Stackable**: Whether rules can be combined
- **Validity Period**: `valid_from` and `valid_until` timestamps

## Testing & Code Quality

- **Backend Testing**: PHPUnit with Feature and Unit test directories
  - Run tests: `vendor/bin/phpunit` or `php artisan test`
  - Configuration in `phpunit.xml`
- **Backend Code Style**: Laravel Pint for PHP formatting
  - Run formatter: `vendor/bin/pint`
- **Frontend Testing**: No test framework configured yet
- **Frontend Linting**: ESLint with TypeScript rules
  - Run linter: `npm run lint`

## Environment Setup

- **Backend**: Requires `.env` file (copy from `.env.example`)
- **Frontend**: Uses `.env` for environment variables
- **Database**: SQLite file at `backend/database/database.sqlite`