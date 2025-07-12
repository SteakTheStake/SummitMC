# Summit Texture Pack Website

## Overview

This is a modern web application for the Summit Minecraft texture pack created by SteakTheStake. It's built as a single-page application showcasing the texture pack with download statistics, galleries, and community tools. The application uses a full-stack architecture with React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.
Font preference: Custom Pixelbasel font for headings and branding.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API endpoints under `/api` prefix
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: express-session with connect-pg-simple for PostgreSQL session store
- **Storage**: DatabaseStorage class implementing IStorage interface for data persistence

## Key Components

### Database Schema
- **Users**: Basic user authentication system
- **Downloads**: Download statistics tracking by resolution and platform
- **Versions**: Version management with changelog and download URLs
- **Screenshots**: Gallery images with categorization and metadata

### API Endpoints
- `GET /api/downloads/stats` - Retrieve download statistics
- `POST /api/downloads/increment` - Increment download counters
- `GET /api/versions` - Get all versions
- `GET /api/versions/latest` - Get latest version information
- `GET /api/screenshots` - Retrieve screenshots with optional category filtering
- `POST /api/screenshots` - Add new screenshots

### Frontend Features
- **Hero Section**: Dynamic statistics display and version information
- **Feature Showcase**: Highlighting texture pack benefits
- **Gallery**: Interactive image comparison sliders and categorized screenshots
- **Download Section**: Multi-platform download tracking with resolution options
- **Tools Section**: Community utilities and compatibility information

## Data Flow

1. **Initial Load**: Frontend fetches download statistics and latest version data
2. **User Interactions**: Download button clicks increment counters via API
3. **Gallery**: Screenshots are fetched and displayed with filtering capabilities
4. **Real-time Updates**: TanStack Query provides caching and background updates

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **UI Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with custom theme
- **Fonts**: Google Fonts (Orbitron and Inter)
- **Icons**: Lucide React icons

### Development Tools
- **Database Migrations**: Drizzle Kit for schema management
- **Type Safety**: TypeScript throughout the stack
- **Build Process**: Vite for frontend, esbuild for backend
- **Development**: tsx for TypeScript execution

## Deployment Strategy

### Production Build
- Frontend built with Vite to `dist/public`
- Backend bundled with esbuild to `dist/index.js`
- Static assets served from Express in production

### Environment Configuration
- `NODE_ENV` determines development vs production behavior
- `DATABASE_URL` required for PostgreSQL connection
- Vite development server proxies API requests to Express

### Development Workflow
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build both frontend and backend for production
- `npm run db:push` - Push database schema changes
- `npm start` - Run production build

The application is designed to be deployed on platforms like Replit, with automatic database provisioning and environment variable management.

## Recent Changes

### January 2025
- **Database Integration**: Migrated from in-memory storage to PostgreSQL database
  - Added `server/db.ts` with Neon database configuration
  - Implemented `DatabaseStorage` class replacing `MemStorage`
  - Seeded database with initial texture pack data
  - All API endpoints now use persistent database storage
- **Font Customization**: Integrated custom Pixelbasel font
  - Added user-uploaded TTF font file to `/public/fonts/`
  - Updated all headings and branding to use custom font
  - Maintains indie aesthetic with pixel-style typography
- **Design Simplification**: Replaced overwhelming design with clean, balanced aesthetic
  - Removed excessive animations and complex gradient effects
  - Simplified color scheme with consistent Minecraft-inspired colors
  - Updated all sections to use cleaner `minecraft-green`, `minecraft-blue`, `minecraft-gold` classes
  - Maintained glassmorphism effects but with subtler styling
  - Reduced visual noise while preserving professional appearance