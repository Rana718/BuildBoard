# Backend - Project Bidding System

A Node.js + Express.js backend for the Seller-Buyer Project Bidding and Management System.

## Features

- **Authentication**: JWT-based login/signup with role-based access (BUYER/SELLER)
- **Project Management**: Create, view, update projects with status tracking
- **Bidding System**: Sellers can place bids on projects
- **File Handling**: Integration with frontend file upload system
- **Email Notifications**: Automated emails for project updates
- **Reviews**: Rating and feedback system for completed projects

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcryptjs
- **Email**: Nodemailer
- **Validation**: Zod

## Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Environment setup**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database setup**:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

4. **Development**:
```bash
npm run dev
```

5. **Production**:
```bash
npm run build
npm start
```

## API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Projects
- `POST /api/projects/create` - Create project (Buyer)
- `GET /api/projects` - Get projects (filtered by role)
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/status/:id` - Update project status
- `POST /api/projects/select-seller/:id` - Select seller (Buyer)
- `POST /api/projects/complete/:id` - Complete project (Seller)
- `POST /api/projects/deliver/:id` - Upload deliverable (Seller)

### Bids
- `POST /api/bids/place` - Place bid (Seller)
- `GET /api/bids/:projectId` - Get project bids
- `PUT /api/bids/:bidId` - Update bid (Seller)
- `DELETE /api/bids/:bidId` - Delete bid (Seller)

### Reviews
- `POST /api/reviews/:projectId` - Create review (Buyer)
- `GET /api/reviews/:projectId` - Get project review
- `GET /api/reviews/seller/:sellerId` - Get seller reviews
- `PUT /api/reviews/:projectId` - Update review (Buyer)

### Upload
- `POST /api/upload` - Handle file URL (placeholder)

## Database Schema

### User
- Authentication and profile information
- Role-based access (BUYER/SELLER)
- Profile image support

### Project
- Project details and status tracking
- Budget and deadline management
- Buyer-seller relationships

### Bid
- Seller proposals for projects
- Pricing and timeline estimates
- Unique constraint per project-seller

### Deliverable
- File uploads for project completion
- Linked to projects

### Review
- Rating and feedback system
- One review per completed project

## Environment Variables

See `.env.example` for required configuration:

- **DATABASE_URL**: PostgreSQL connection string
- **JWT_SECRET**: Secret key for JWT tokens
- **SMTP_***: Email configuration for notifications
- **FRONTEND_URL**: Frontend URL for CORS

## Deployment

### DigitalOcean App Platform
1. Connect your repository
2. Set environment variables
3. Configure build command: `npm run build`
4. Configure run command: `npm start`

### Render
1. Connect your repository
2. Set environment variables
3. Build command: `npm install && npm run build`
4. Start command: `npm start`

## Development Notes

- Uses TypeScript for type safety
- Prisma for database operations
- Zod for request validation
- JWT for stateless authentication
- Role-based access control
- Email notifications for key events
- Error handling and logging
