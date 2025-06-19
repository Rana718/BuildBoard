# BuildBoard Setup Guide

## Project Overview

BuildBoard is a modern, full-stack project management platform with a sleek dark theme that connects buyers with skilled sellers. The platform has been streamlined to focus on core functionality with an enhanced user experience.

## Key Features

### 1. Enhanced Dark Theme UI
- **Modern Dark Interface**: Carefully crafted dark theme with high contrast ratios
- **Gradient Backgrounds**: Subtle gradients for visual depth and modern aesthetics
- **Smooth Animations**: CSS transitions and keyframe animations for all interactions
- **Responsive Design**: Mobile-first approach with optimized breakpoints
- **Interactive Elements**: Hover effects, scale animations, and smooth transitions

### 2. Streamlined User Experience
- **Intuitive Navigation**: Clean navigation with active state indicators
- **Loading States**: Shimmer effects and skeleton screens for better UX
- **Status Indicators**: Color-coded project status badges
- **Card Interactions**: Hover effects with elevation and shadow changes
- **Form Enhancements**: Improved focus states and validation feedback

### 3. Core Platform Features
- **User Authentication**: Secure JWT-based authentication with role management
- **Project Management**: Complete project lifecycle from creation to completion
- **Bidding System**: Competitive bidding with detailed proposals
- **File Upload**: Cloudinary integration with drag-and-drop interface
- **Review System**: 5-star rating system with detailed feedback
- **Email Notifications**: Automated SMTP notifications for project updates

### 4. Enhanced Database Schema
- **User Profiles**: Comprehensive user information with skills and ratings
- **Project Tracking**: Detailed project status and deadline management
- **Bid Management**: Competitive bidding with seller proposals
- **File Handling**: Deliverable tracking with metadata
- **Review System**: Rating calculations with automatic updates

## Setup Instructions

### Prerequisites
- Node.js 18+ or Bun runtime
- PostgreSQL database
- Cloudinary account for file storage
- SMTP email service for notifications

### Backend Setup

1. **Install Dependencies**:
```bash
cd backend
bun install
```

2. **Environment Configuration**:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/buildboard_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="your-email@gmail.com"
```

3. **Database Setup**:
```bash
# Generate Prisma client
bunx prisma generate

# Push schema to database
bunx prisma db push

# Optional: Seed database with sample data
bunx prisma db seed
```

4. **Start Backend Server**:
```bash
bun run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Install Dependencies**:
```bash
cd frontend
bun install
```

2. **Environment Configuration**:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

3. **Start Frontend Server**:
```bash
bun run dev
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - User registration with role selection
- `POST /api/auth/login` - User authentication with JWT generation
- `GET /api/auth/me` - Get current authenticated user profile
- `PUT /api/auth/profile` - Update user profile information

### Project Management Endpoints
- `POST /api/projects/create` - Create new project (Buyer only)
- `GET /api/projects` - Get projects with role-based filtering
- `GET /api/projects/:id` - Get single project with full details
- `POST /api/projects/select-seller/:id` - Select seller for project
- `POST /api/projects/complete/:id` - Mark project as completed
- `POST /api/projects/deliver/:id` - Upload project deliverable

### Bidding System Endpoints
- `POST /api/bids/place` - Place bid on project (Seller only)
- `GET /api/bids/:projectId` - Get all bids for specific project

### Review System Endpoints
- `POST /api/reviews/:projectId` - Create review for completed project
- `GET /api/reviews/seller/:sellerId` - Get all reviews for seller

### Profile Management Endpoints
- `GET /api/profile/:userId` - Get user profile with statistics
- `PUT /api/profile/:userId` - Update user profile information

## Frontend Routes

### Public Routes
- `/` - Landing page with platform overview
- `/auth/login` - User login page
- `/auth/register` - User registration page

### Protected Routes
- `/dashboard` - User dashboard with project overview
- `/projects` - Project listing with filtering
- `/projects/create` - Create new project (Buyer only)
- `/projects/[id]` - Project details and management
- `/profile/[userId]` - User profile with statistics and reviews

## Database Schema

### User Model
```prisma
model User {
  id               String    @id @default(cuid())
  name             String
  email            String    @unique
  password         String
  role             Role      @default(BUYER)
  profileImageUrl  String?
  bio              String?
  skills           String[]  @default([])
  averageRating    Float     @default(0)
  totalReviews     Int       @default(0)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}
```

### Project Model
```prisma
model Project {
  id          String        @id @default(cuid())
  title       String
  description String
  budgetRange String
  deadline    DateTime
  status      ProjectStatus @default(PENDING)
  imageUrl    String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}
```

### Project Status Enum
```prisma
enum ProjectStatus {
  PENDING      // Awaiting bids
  IN_PROGRESS  // Seller assigned, work in progress
  COMPLETED    // Work completed
  CANCELLED    // Project cancelled
}
```

## Styling and Theme

### Dark Theme Implementation
- **CSS Variables**: Custom properties for consistent theming
- **Tailwind Configuration**: Extended color palette for dark mode
- **Component Styling**: Consistent styling across all components
- **Animation Classes**: Custom animation utilities for smooth interactions

### Key Design Elements
- **Color Scheme**: Deep backgrounds with high contrast text
- **Typography**: Gradient text effects for headings
- **Spacing**: Consistent spacing scale throughout the application
- **Borders**: Subtle borders with transparency for depth
- **Shadows**: Carefully crafted shadows for elevation

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Tablet and desktop optimizations
- **Grid Layouts**: Responsive grid systems
- **Navigation**: Adaptive navigation for different screen sizes

## Development Workflow

### Code Structure
- **Component Organization**: Logical component hierarchy
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Comprehensive error handling and validation
- **Performance**: Optimized rendering and data fetching

### Best Practices
- **Security**: JWT authentication with proper validation
- **Accessibility**: WCAG compliant components
- **SEO**: Optimized meta tags and structured data
- **Performance**: Code splitting and lazy loading

## Deployment

### Frontend Deployment (Vercel)
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Enable automatic deployments on main branch push

### Backend Deployment (Railway/Render)
1. Create new service and connect repository
2. Configure environment variables in service dashboard
3. Set build and start commands:
   - Build: `bun install && bun run build`
   - Start: `bun start`

### Database Deployment
1. Set up PostgreSQL database on cloud provider
2. Update DATABASE_URL in production environment
3. Run database migrations in production

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure PostgreSQL is running and accessible
2. **Environment Variables**: Verify all required variables are set
3. **Port Conflicts**: Check if ports 3000 and 5000 are available
4. **Cloudinary Setup**: Verify Cloudinary credentials are correct

### Development Tips
- Use `bun run dev` for faster development server startup
- Enable TypeScript strict mode for better type safety
- Use browser dev tools for debugging API calls
- Check server logs for backend error details

## Future Enhancements

### Planned Features
1. **Real-time Chat**: WebSocket-based communication between users
2. **Advanced Search**: Enhanced filtering and search capabilities
3. **Mobile App**: React Native implementation
4. **Notification System**: Push notifications for important updates
5. **Advanced Analytics**: Detailed performance metrics and insights

### Technical Improvements
1. **Caching**: Redis implementation for improved performance
2. **Testing**: Comprehensive test suite with Jest and Cypress
3. **Monitoring**: Application performance monitoring
4. **Documentation**: API documentation with OpenAPI/Swagger

---

Built with modern web technologies and best practices for a seamless user experience.
