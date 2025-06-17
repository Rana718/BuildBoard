# Project Bidding and Management System

A full-stack web application that connects buyers with sellers for project-based work. Buyers can post projects, receive bids from sellers, and manage the entire project lifecycle from bidding to completion.

## 🚀 Features

### Core Functionality
- **User Authentication**: JWT-based login/signup with role-based access (Buyer/Seller)
- **Project Management**: Create, view, update projects with status tracking
- **Bidding System**: Sellers can place competitive bids on projects
- **File Upload**: Cloudinary integration for profile images, project images, and deliverables
- **Email Notifications**: Automated emails for project updates and milestones
- **Review System**: Rating and feedback system for completed projects

### User Roles

#### Buyers
- Post detailed project requirements
- Receive and review bids from sellers
- Select the best seller for their project
- Track project progress and deliverables
- Leave reviews and ratings

#### Sellers
- Browse available projects
- Submit competitive proposals with pricing and timelines
- Upload deliverables and manage project completion
- Build reputation through reviews

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.3.3 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui with Radix UI primitives
- **State Management**: Zustand for authentication
- **Forms**: React Hook Form with Zod validation
- **File Upload**: Cloudinary integration
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **Email**: Nodemailer
- **Validation**: Zod
- **File Handling**: Integration with frontend upload system

## 📁 Project Structure

```
webbuy/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/            # Utilities and API clients
│   │   └── hooks/          # Custom React hooks
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── lib/           # Utilities and configurations
│   │   └── index.ts       # Server entry point
│   ├── prisma/            # Database schema and migrations
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
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
npm install
```

3. **Environment setup**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Database setup**:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

5. **Start development server**:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Environment setup**:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start development server**:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/webbuy_db"
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
- **User**: Authentication and profile information
- **Project**: Project details and status tracking
- **Bid**: Seller proposals for projects
- **Deliverable**: File uploads for project completion
- **Review**: Rating and feedback system

### Relationships
- Users can be buyers or sellers (role-based)
- Projects belong to buyers and can be assigned to sellers
- Bids connect sellers to projects
- Reviews link completed projects with feedback

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Projects
- `POST /api/projects/create` - Create project (Buyer)
- `GET /api/projects` - Get projects (filtered by role)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects/select-seller/:id` - Select seller (Buyer)
- `POST /api/projects/complete/:id` - Complete project (Seller)
- `POST /api/projects/deliver/:id` - Upload deliverable (Seller)

### Bids
- `POST /api/bids/place` - Place bid (Seller)
- `GET /api/bids/:projectId` - Get project bids

### Reviews
- `POST /api/reviews/:projectId` - Create review (Buyer)
- `GET /api/reviews/seller/:sellerId` - Get seller reviews

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (DigitalOcean/Render)
1. Create a new app and connect your repository
2. Set environment variables
3. Configure build and start commands:
   - Build: `npm install && npm run build`
   - Start: `npm start`

## 🎯 Key Features Walkthrough

### Project Lifecycle
1. **Buyer posts project** with requirements and budget
2. **Sellers browse and bid** on projects with proposals
3. **Buyer selects seller** from submitted bids
4. **Project moves to "In Progress"** status
5. **Seller uploads deliverables** and marks complete
6. **Buyer reviews deliverables** and leaves feedback

### File Upload System
- Uses Cloudinary for reliable file storage
- Supports profile images, project images, and deliverables
- Frontend handles upload, backend stores URLs
- Drag-and-drop interface with progress indicators

### Email Notifications
- Seller selection notifications
- Project completion alerts
- Automated SMTP delivery
- HTML email templates

## 🔒 Security Features

- JWT-based authentication with secure token storage
- Role-based access control (RBAC)
- Input validation with Zod schemas
- Password hashing with bcryptjs
- CORS configuration for API security
- Environment variable protection

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
- Check the documentation in individual README files
- Review the API documentation for endpoint details

---

Built with ❤️ using Next.js, Express.js, and PostgreSQL
