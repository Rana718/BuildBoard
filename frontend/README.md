# Frontend - Project Bidding System

A Next.js frontend application for the Seller-Buyer Project Bidding and Management System.

## Features

- **Modern UI**: Built with Next.js 15.3.3 and Tailwind CSS v4
- **Component Library**: shadcn/ui components with Radix UI primitives
- **Authentication**: JWT-based auth with persistent state management
- **File Upload**: Cloudinary integration with drag-and-drop interface
- **Responsive Design**: Mobile-first approach with dark mode support
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: Zustand for authentication state

## Tech Stack

- **Framework**: Next.js 15.3.3 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **File Upload**: Cloudinary + react-dropzone
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Project Structure

```
src/
├── app/                    # App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── projects/          # Project management pages
│   └── api/               # API routes (upload)
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── Layout.tsx        # Main layout component
│   └── FileUpload.tsx    # File upload component
├── lib/                  # Utilities and configurations
│   ├── api.ts           # API client and endpoints
│   ├── auth.ts          # Authentication store
│   ├── utils.ts         # Utility functions
│   └── cloudinary.ts    # Cloudinary configuration
└── hooks/               # Custom React hooks
    └── use-toast.ts     # Toast notification hook
```

## Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Environment setup**:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. **Development**:
```bash
npm run dev
```

4. **Build for production**:
```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file with:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

## Key Features

### Authentication System
- JWT-based authentication with persistent storage
- Role-based access (Buyer/Seller)
- Protected routes and conditional rendering
- Profile management with image upload

### Project Management
- Create projects with rich descriptions and images
- Browse and filter available projects
- Detailed project views with bidding interface
- Status tracking and progress management

### File Upload System
- Cloudinary integration for reliable storage
- Drag-and-drop interface with progress indicators
- Support for images and documents
- Automatic URL generation and storage

### Responsive Design
- Mobile-first approach
- Tailwind CSS v4 with custom theme
- Dark mode support
- Accessible UI components

## API Integration

The frontend communicates with the backend through a centralized API client:

```typescript
// Authentication
authAPI.login(credentials)
authAPI.register(userData)

// Projects
projectsAPI.create(projectData)
projectsAPI.getAll(filters)
projectsAPI.getById(id)

// Bids
bidsAPI.place(bidData)
bidsAPI.getByProject(projectId)

// Reviews
reviewsAPI.create(projectId, reviewData)
```

## Component Architecture

### Layout Component
- Navigation with user profile
- Role-based menu items
- Responsive sidebar
- Authentication state management

### UI Components
- Consistent design system with shadcn/ui
- Reusable form components
- Toast notifications
- Loading states and error handling

### File Upload Component
- Drag-and-drop interface
- File type and size validation
- Progress indicators
- Error handling and retry logic

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push

### Manual Deployment
1. Build the application: `npm run build`
2. Upload `out/` directory to your hosting provider
3. Configure environment variables
4. Set up custom domain and SSL

## Development Guidelines

### Code Style
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Consistent naming conventions
- Component composition over inheritance

### State Management
- Zustand for global state (authentication)
- React Hook Form for form state
- Server state managed by API calls
- Local state for UI interactions

### Error Handling
- Toast notifications for user feedback
- Graceful error boundaries
- Loading states for async operations
- Form validation with clear error messages

## Performance Optimizations

- Next.js App Router for optimal loading
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Efficient re-rendering with React patterns

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement approach
- Graceful degradation for older browsers
