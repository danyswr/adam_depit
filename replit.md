# UKM Portfolio Platform

## Overview

A full-stack web application for managing and showcasing University Student Organization (UKM) portfolios. The platform allows students to discover, join, and manage various student organizations while providing administrators with tools to manage UKM data and registrations.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui with Radix UI primitives for consistent, accessible components
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Primary Backend**: Google Apps Script serving as the main API endpoint
- **Express Server**: Minimal Express.js server primarily for development and static file serving
- **Database**: Google Sheets as the primary data store
- **File Storage**: Google Drive for image and file uploads

### Authentication Strategy
- Client-side authentication state management
- Session persistence via localStorage
- Role-based access control (regular users vs admin)

## Key Components

### Data Layer
- **User Management**: User registration, authentication, and profile management
- **UKM Management**: CRUD operations for student organizations
- **Registration System**: User-to-UKM enrollment and management
- **File Upload**: Image handling for UKM profiles

### UI Components
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Component Library**: Comprehensive UI components using shadcn/ui
- **Accessibility**: ARIA-compliant components via Radix UI
- **Theming**: CSS custom properties for light/dark mode support

### Pages and Features
- **Home Page**: Landing page with UKM showcase and statistics
- **Portfolio Page**: Browse and filter UKMs
- **Dashboard**: User-specific UKM management and registrations
- **Admin Panel**: Administrative tools for UKM and user management

## Data Flow

1. **Client Requests**: Frontend makes API calls to Google Apps Script endpoint
2. **Google Apps Script**: Processes requests and interacts with Google Sheets
3. **Data Storage**: Google Sheets stores user data, UKM information, and registrations
4. **File Storage**: Google Drive stores uploaded images and files
5. **Response**: Data flows back through the same path to update the UI

## External Dependencies

### Core Technologies
- **Google Apps Script**: Primary backend API
- **Google Sheets**: Database for structured data
- **Google Drive**: File storage and image hosting
- **Neon Database**: PostgreSQL configured but not actively used (Google Sheets is primary)

### NPM Packages
- **React Ecosystem**: React 18+ with TypeScript support
- **UI Libraries**: Radix UI primitives, Lucide React icons
- **Data Fetching**: TanStack React Query for caching and state management
- **Validation**: Zod for schema validation and type safety
- **Styling**: Tailwind CSS with class-variance-authority for component variants

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement and fast builds
- **Express Server**: Serves frontend in development with proxy capabilities
- **Environment Variables**: DATABASE_URL for potential PostgreSQL integration

### Production Build
- **Static Frontend**: Built with Vite and served as static files
- **Backend**: Google Apps Script hosted on Google's infrastructure
- **CDN Integration**: Potential for serving static assets via CDN

### Configuration Management
- **TypeScript**: Strict type checking with path aliases
- **Build Tools**: ESBuild for server bundling, Vite for client bundling
- **Development Tools**: Replit integration with runtime error overlay

## Changelog
- June 28, 2025: Initial setup
- June 28, 2025: Fixed Google Sheets integration with updated schema and API structure
- June 28, 2025: Updated user authentication to use proper field names (namaMahasiswa, nomorWhatsapp, role)
- June 28, 2025: Created comprehensive Google Apps Script file for backend integration
- June 28, 2025: Successfully migrated from Replit Agent to standard Replit environment
- June 28, 2025: Fixed Google Apps Script connection - now receiving successful API responses
- June 28, 2025: Updated API structure to match Google Apps Script requirements (sheet/action pattern)
- June 28, 2025: Implemented role-based routing and access control system
- June 28, 2025: Fixed dashboard statistics to show real data instead of demo values
- June 28, 2025: Added admin restriction to only access UKMs they created
- June 28, 2025: Fixed Google Drive image display issues - images now load correctly in UKM cards
- June 28, 2025: Completed migration to standard Replit environment with all features working
- June 28, 2025: Resolved Google Drive image loading by switching to thumbnail API format
- June 28, 2025: Fixed member count display to show actual registrations from Google Sheets
- June 28, 2025: Successfully migrated from Replit Agent to standard Replit environment
- June 28, 2025: Enhanced admin panel with member management functionality
- June 28, 2025: Added UKMMembersModal component to view and manage UKM members
- June 28, 2025: Fixed admin UKM filtering to show only UKMs created by current admin
- June 28, 2025: Improved admin statistics to display real data from Google Sheets
- June 28, 2025: Migrated admin panel to card layout displaying images, names, descriptions and member counts
- June 28, 2025: Enhanced admin UKM management with better visual presentation similar to UKM cards
- June 28, 2025: Completed migration from Replit Agent to standard Replit environment
- June 28, 2025: Fixed admin panel UKM data display - now showing UKM data from Google Sheets correctly
- June 28, 2025: Added missing prestasi field to UKM edit form
- June 28, 2025: Fixed Google Drive image display in edit form by converting URLs to thumbnail format
- June 28, 2025: Enhanced UKM edit form to pre-fill existing data when editing UKMs

## Setup Instructions
To connect the website with Google Sheets:

1. **Copy Google Apps Script Code**: Use the updated code from `google-apps-script.gs` file
2. **Create Google Apps Script Project**: 
   - Go to script.google.com
   - Create new project
   - Paste the code from `google-apps-script.gs`
   - Update FOLDER_ID with your Google Drive folder ID
3. **Deploy as Web App**:
   - Click Deploy > New Deployment
   - Choose "Web app" as type
   - Set execute as "Me" and access to "Anyone"
   - Copy the web app URL (should match current API_URL)
4. **Create Spreadsheet Sheets**: The script will auto-create required sheets (Users, UKM, Daftar)

## Current Status
- Website is fully functional with demo data
- Google Apps Script connection partially working but needs spreadsheet setup
- All authentication and UKM flows implemented
- Error handling shows informative messages to users

## Troubleshooting
If you see "Cannot read properties of undefined (reading 'contents')" error:
1. Ensure the Google Apps Script is deployed as web app with "Anyone" access
2. Create or update the spreadsheet with required sheets
3. Verify FOLDER_ID in the script matches your Google Drive folder

## User Preferences

Preferred communication style: Simple, everyday language.