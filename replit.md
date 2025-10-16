# Urban Tree Management System

## Overview

This is a comprehensive web application for managing urban trees planted in street planters (cazuelas). The system tracks tree inventory, locations, maintenance history, and generates analytical reports for municipal forestry management. Built with a modern full-stack architecture, it provides both desktop and mobile-optimized interfaces for field work.

**Primary Purpose:** Enable municipal workers and forestry departments to efficiently track, maintain, and report on urban tree populations, including planting dates, health status, maintenance schedules, and extraction records.

**Key Features:**
- Tree inventory management with species tracking and health status
- Location management for tree placement across neighborhoods
- Planter (cazuela) tracking with installation dates and conditions
- Maintenance history logging with cost tracking
- Extraction reason cataloging
- Dashboard with key metrics and recent activity
- Comprehensive reporting by neighborhood and maintenance type

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight client-side routing)
- **State Management:** TanStack Query (React Query) for server state
- **Forms:** React Hook Form with Zod validation
- **UI Components:** Radix UI primitives with custom Shadcn/UI implementation

**Design System:**
- Material Design 3 principles for data-intensive applications
- Custom theme using CSS variables for light/dark mode support
- Tailwind CSS for utility-first styling with custom configuration
- Typography: Inter (primary), JetBrains Mono (monospace for IDs/coordinates)
- Optimized for field use with large touch targets and high contrast

**Key Architectural Decisions:**
- **Component Library Choice:** Radix UI headless components provide accessibility and flexibility while maintaining design system consistency
- **Form Validation Strategy:** Zod schemas shared between client and server ensure type safety and validation consistency
- **Query Management:** React Query handles caching, refetching, and optimistic updates for seamless data synchronization

### Backend Architecture

**Runtime:** Node.js with Express.js
- **Language:** TypeScript with ES modules
- **API Pattern:** RESTful endpoints with consistent error handling
- **Development Server:** Vite middleware integration for HMR in development

**Database Strategy:**
- **ORM:** Drizzle ORM for type-safe database operations
- **Driver:** Neon serverless PostgreSQL connector
- **Schema Management:** Drizzle Kit for migrations
- **Database Design:** Relational model with UUID primary keys, foreign key relationships between trees, locations, planters, and maintenance records

**Key Architectural Decisions:**
- **Storage Abstraction:** `IStorage` interface pattern allows for potential database swapping without affecting business logic
- **Validation Layer:** Drizzle-Zod integration auto-generates Zod schemas from database schema definitions
- **Error Handling:** Centralized middleware captures and formats errors consistently
- **Logging Strategy:** Request/response logging in development with performance metrics

### Data Model

**Core Entities:**

1. **Ubicaciones (Locations)** - Geographic placement of trees
   - Address, neighborhood, optional GPS coordinates
   - Supports observation notes

2. **Cazuelas (Planters)** - Physical containers for trees
   - Material type, size classification
   - Installation date and current condition status

3. **Arboles (Trees)** - Central entity
   - Species identification
   - Planting date and health status (Vivo/Muerto/Extraído)
   - References to location and planter
   - Optional photo URL and observations

4. **Mantenimientos (Maintenance)** - Service history
   - Links to tree and maintenance type
   - Responsible party, cost tracking
   - Next maintenance scheduling
   - Optional extraction reason for removed trees

5. **TiposMantenimiento (Maintenance Types)** - Catalog
   - Type name, recommended frequency, description

6. **MotivosExtraccion (Extraction Reasons)** - Catalog
   - Standardized reasons for tree removal

**Relationships:**
- One location can have multiple planters
- One planter contains one tree (current design)
- One tree has multiple maintenance records
- Maintenance records reference type and optional extraction reason

### External Dependencies

**Database Service:**
- **Neon PostgreSQL:** Serverless PostgreSQL with connection pooling
- Used via `@neondatabase/serverless` driver
- DATABASE_URL environment variable required for connection

**UI Component Libraries:**
- **Radix UI:** Comprehensive set of unstyled, accessible component primitives
- **Lucide React:** Icon library for consistent iconography
- **date-fns:** Date manipulation and formatting
- **embla-carousel-react:** Carousel/slider functionality

**Development Tools:**
- **Vite:** Build tool and development server with HMR
- **Drizzle Kit:** Database schema management and migrations
- **ESBuild:** Production bundling for server code

**Styling Dependencies:**
- **Tailwind CSS:** Utility-first CSS framework
- **class-variance-authority:** Type-safe variant styling
- **tailwind-merge:** Intelligent Tailwind class merging

**Type Safety:**
- **Zod:** Runtime type validation
- **TypeScript:** Compile-time type checking
- Shared schema definitions between client and server via `@shared` alias

**Optional Integrations:**
- Design suggests potential for photo upload (tree images)
- GPS coordinate support for precise location mapping
- Session management infrastructure present (connect-pg-simple)