# BuildBoard - Project Management Platform

A modern, full-stack web application that connects buyers with sellers for project-based work. Built with a sleek dark theme and intuitive user experience, BuildBoard streamlines the entire project lifecycle from bidding to completion.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure JWT-based login/signup with role-based access (Buyer/Seller)
- **Project Management**: Create, view, update projects with comprehensive status tracking
- **Bidding System**: Competitive bidding platform with detailed proposals
- **File Upload**: Cloudinary integration for profile images, project images, and deliverables
- **Email Notifications**: Automated SMTP notifications for project updates and milestones
- **Review System**: 5-star rating and feedback system for completed projects

### User Roles

#### Buyers
- Post detailed project requirements with rich descriptions
- Receive and review competitive bids from verified sellers
- Select the best seller based on proposals and ratings
- Track project progress with real-time updates
- Leave comprehensive reviews and ratings

#### Sellers
- Browse curated projects matching their expertise
- Submit compelling proposals with portfolios and timelines
- Upload deliverables with milestone tracking
- Build reputation through client reviews and ratings

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.3.3 with App Router
- **Styling**: Tailwind CSS v4 with custom dark theme
- **UI Components**: shadcn/ui with Radix UI primitives
- **State Management**: Zustand for authentication
- **Forms**: React Hook Form with Zod validation
- **File Upload**: Cloudinary integration with drag-and-drop
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with modern middleware
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcryptjs hashing
- **Email**: Nodemailer with SMTP
- **Validation**: Zod schemas
- **File Handling**: Cloudinary integration

## 🎨 Design Features

### Dark Theme
- **Modern Dark UI**: Carefully crafted dark theme with high contrast
- **Gradient Backgrounds**: Subtle gradients for visual depth
- **Smooth Animations**: CSS transitions and keyframe animations
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Accessibility**: WCAG compliant with proper focus states

### Enhanced UX
- **Loading States**: Shimmer effects and skeleton screens
- **Hover Effects**: Interactive elements with smooth transitions
- **Status Indicators**: Color-coded project status badges
- **Card Hover**: Subtle elevation and shadow effects
- **Button Interactions**: Scale and translate animations

## 📁 Project Structure

```
BuildBoard/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages and layouts
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   └── profile/    # Profile-specific components
│   │   ├── lib/            # Utilities and API clients
│   │   ├── hooks/          # Custom React hooks
│   │   └── middleware.ts   # Next.js middleware
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── lib/           # Utilities and configurations
│   │   ├── middleware/    # Authentication middleware
│   │   └── types/         # TypeScript definitions
│   ├── prisma/            # Database schema and migrations
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database
- Cloudinary account (for file uploads)
- SMTP email service (for notifications)

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
bun install
# or npm install
```

3. **Environment setup**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Database setup**:
```bash
# Generate Prisma client
bunx prisma generate

# Push schema to database
bunx prisma db push
```

5. **Start development server**:
```bash
bun run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
bun install
# or npm install
```

3. **Environment setup**:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start development server**:
```bash
bun run dev
```

The frontend will run on `http://localhost:3000`

## 🔧 Environment Variables

### Backend (.env)
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

### Frontend (.env.local)
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

## 📊 Database Schema

### Core Models
- **User**: Authentication, profiles, and rating information
- **Project**: Project details with status and deadline tracking
- **Bid**: Seller proposals with pricing and timelines
- **Deliverable**: File uploads for project completion
- **Review**: Rating and feedback system with timestamps

### Key Relationships
- Users can be buyers or sellers (role-based access)
- Projects belong to buyers and can be assigned to sellers
- Bids connect sellers to specific projects
- Reviews link completed projects with buyer feedback
- Deliverables track file submissions per project

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration with validation
- `POST /api/auth/login` - User login with JWT generation
- `GET /api/auth/me` - Get current authenticated user
- `PUT /api/auth/profile` - Update user profile information

### Projects
- `POST /api/projects/create` - Create new project (Buyer only)
- `GET /api/projects` - Get projects with role-based filtering
- `GET /api/projects/:id` - Get single project with details
- `POST /api/projects/select-seller/:id` - Select seller for project
- `POST /api/projects/complete/:id` - Mark project as complete
- `POST /api/projects/deliver/:id` - Upload project deliverable

### Bids
- `POST /api/bids/place` - Place bid on project (Seller only)
- `GET /api/bids/:projectId` - Get all bids for project

### Reviews
- `POST /api/reviews/:projectId` - Create review for completed project
- `GET /api/reviews/seller/:sellerId` - Get seller reviews and ratings

### Profile
- `GET /api/profile/:userId` - Get user profile with statistics
- `PUT /api/profile/:userId` - Update user profile information

## 🎯 Key Features Walkthrough

### Project Lifecycle
1. **Buyer posts project** with detailed requirements and budget
2. **Sellers browse and bid** with competitive proposals
3. **Buyer selects seller** from submitted bids
4. **Project status updates** to "In Progress"
5. **Seller uploads deliverables** and marks project complete
6. **Buyer reviews work** and leaves rating/feedback

### Enhanced UI/UX
- **Dark Theme**: Modern dark interface with carefully chosen colors
- **Smooth Animations**: CSS transitions for all interactive elements
- **Loading States**: Skeleton screens and shimmer effects
- **Responsive Design**: Mobile-first with tablet and desktop optimization
- **Status Indicators**: Color-coded badges for project status

### File Upload System
- **Cloudinary Integration**: Reliable cloud storage for all files
- **Drag-and-Drop**: Intuitive file upload interface
- **Progress Indicators**: Real-time upload progress
- **File Validation**: Type and size restrictions
- **Preview Support**: Image previews before upload

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Buyer/Seller permission system
- **Input Validation**: Zod schemas for all API endpoints
- **Password Security**: bcryptjs hashing with salt
- **CORS Protection**: Configured for production security
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Configure environment variables in dashboard
3. Enable automatic deployments on push

### Backend (Railway/Render)
1. Create new service and connect repository
2. Configure environment variables
3. Set build and start commands:
   - Build: `bun install && bun run build`
   - Start: `bun start`

## 🎨 Styling Guide

### Color Scheme
- **Background**: Deep dark tones for comfortable viewing
- **Primary**: Blue accent for interactive elements
- **Secondary**: Muted colors for supporting content
- **Status Colors**: Green (success), Yellow (pending), Red (error)

### Typography
- **Headings**: Bold weights with gradient text effects
- **Body**: Readable font sizes with proper line height
- **Code**: Monospace font for technical content

### Components
- **Cards**: Subtle borders with hover effects
- **Buttons**: Scale animations with color transitions
- **Forms**: Focus states with ring effects
- **Navigation**: Active states with background highlights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation for setup instructions
- Review the API documentation for endpoint details

---

Built with ❤️ using Next.js, Express.js, PostgreSQL, and modern web technologies.
