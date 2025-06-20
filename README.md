# BuildBoard - Project Management Platform

<div align="center">
  <h3>🚀 A Modern Full-Stack Platform Connecting Buyers with Skilled Sellers</h3>
  <p>Built with cutting-edge technologies and a focus on user experience, security, and scalability</p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?style=for-the-badge&logo=postgresql)
  ![Redis](https://img.shields.io/badge/Redis-Latest-red?style=for-the-badge&logo=redis)
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠 Tech Stack](#-tech-stack)
- [📊 Database Schema](#-database-schema)
- [🚦 Getting Started](#-getting-started)
- [🔧 Configuration](#-configuration)
- [🔗 API Documentation](#-api-documentation)
- [🎨 UI/UX Features](#-uiux-features)
- [🔒 Security](#-security)
- [📈 Performance](#-performance)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

---

## Overview

**BuildBoard** is a comprehensive project management platform that revolutionizes how buyers and sellers collaborate on project-based work. With its modern dark theme, intuitive interface, and robust feature set, BuildBoard streamlines the entire project lifecycle from initial posting to final delivery and review.

### 🎯 Key Highlights

- **Modern Architecture**: Built with Next.js 15, Express.js, and PostgreSQL
- **Real-time Features**: Background job processing with Redis and BullMQ
- **Secure & Scalable**: JWT authentication, role-based access, and production-ready
- **Rich UI/UX**: Dark theme, responsive design, and smooth animations
- **Comprehensive**: End-to-end project management with notifications and reviews

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Secure Registration/Login**: JWT-based authentication with bcryptjs hashing
- **Role-Based Access**: Distinct Buyer and Seller roles with appropriate permissions
- **Profile Management**: Comprehensive user profiles with images and bio
- **Session Management**: Persistent authentication with secure token handling

### 📋 Project Management
- **Project Creation**: Rich project posting with descriptions, budgets, and deadlines
- **Status Tracking**: Real-time project status updates (Pending → In Progress → Completed)
- **File Management**: Cloudinary integration for images and deliverables
- **Search & Filter**: Advanced project discovery and filtering capabilities

### 💰 Bidding System
- **Competitive Bidding**: Sellers can submit detailed proposals with pricing
- **Bid Management**: Update, delete, and track bid status
- **Seller Selection**: Buyers can review and select the best proposals
- **Proposal Details**: Include estimated completion time and detailed messages

### 📧 Notification System
- **Email Automation**: Background email processing with BullMQ
- **Event-Driven**: Notifications for bid submissions, selections, and completions
- **Template System**: Professional email templates for all interactions
- **Queue Management**: Reliable delivery with retry mechanisms

### ⭐ Review & Rating System
- **5-Star Ratings**: Comprehensive rating system for completed projects
- **Detailed Reviews**: Text-based feedback and testimonials
- **Reputation Building**: Aggregate ratings and review counts
- **Trust Indicators**: Build seller credibility through verified reviews

### 👥 User Roles & Capabilities

#### 🛒 Buyers
- Post detailed project requirements with rich descriptions
- Set budgets, deadlines, and project specifications
- Review and compare competitive bids from sellers
- Select sellers based on proposals, ratings, and portfolios
- Track project progress with real-time status updates
- Receive deliverables and provide feedback
- Leave comprehensive reviews and ratings

#### 🔨 Sellers
- Browse and discover projects matching their expertise
- Submit compelling proposals with competitive pricing
- Showcase skills, experience, and previous work
- Manage multiple project bids and assignments
- Upload deliverables and project files
- Build reputation through client reviews and ratings
- Track earnings and project history

---

## 🏗️ Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│   (Express)     │◄──►│ (PostgreSQL)    │
│                 │    │                 │    │                 │
│ • React 19      │    │ • TypeScript    │    │ • Prisma ORM    │
│ • Tailwind CSS  │    │ • JWT Auth      │    │ • Migrations    │
│ • Zustand       │    │ • Zod Validation│    │ • Relationships │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Queue System  │    │  File Storage   │
                       │   (Redis/Bull)  │    │  (Cloudinary)   │
                       │                 │    │                 │
                       │ • Email Queue   │    │ • Image Upload  │
                       │ • Job Processing│    │ • File Delivery │
                       │ • Background    │    │ • CDN           │
                       └─────────────────┘    └─────────────────┘
```

### Request Flow
1. **Client Request** → Next.js Frontend
2. **API Call** → Express.js Backend
3. **Authentication** → JWT Middleware
4. **Validation** → Zod Schema Validation
5. **Database** → Prisma ORM → PostgreSQL
6. **Background Jobs** → BullMQ → Redis
7. **Response** → JSON API Response

---

## 🛠 Tech Stack

### 🎨 Frontend Technologies

| Technology | Version | Purpose | Features |
|------------|---------|---------|----------|
| **Next.js** | 15.3.3 | React Framework | App Router, SSR, API Routes |
| **React** | 19.1.0 | UI Library | Hooks, Context, Suspense |
| **TypeScript** | 5.0+ | Type Safety | Static typing, IntelliSense |
| **Tailwind CSS** | 4.0 | Styling | Utility-first, Dark theme |
| **shadcn/ui** | Latest | UI Components | Radix UI primitives |
| **Zustand** | 5.0.5 | State Management | Lightweight, TypeScript |
| **React Hook Form** | 7.58.1 | Form Management | Validation, Performance |
| **Zod** | 3.25.67 | Schema Validation | Type-safe validation |
| **Axios** | 1.10.0 | HTTP Client | Interceptors, Error handling |
| **Lucide React** | 0.516.0 | Icons | Modern icon library |
| **React Dropzone** | 14.3.8 | File Upload | Drag & drop interface |
| **Date-fns** | 4.1.0 | Date Utilities | Date formatting, manipulation |
| **Sonner** | 2.0.5 | Notifications | Toast notifications |

### ⚙️ Backend Technologies

| Technology | Version | Purpose | Features |
|------------|---------|---------|----------|
| **Node.js** | 18+ | Runtime | JavaScript runtime |
| **Express.js** | 4.18.2 | Web Framework | Middleware, Routing |
| **TypeScript** | 5.0+ | Type Safety | Static typing |
| **Prisma** | 6.9.0 | ORM | Type-safe database access |
| **PostgreSQL** | Latest | Database | Relational database |
| **Redis** | Latest | Cache/Queue | In-memory data store |
| **BullMQ** | 5.54.3 | Job Queue | Background job processing |
| **JWT** | 9.0.2 | Authentication | Stateless authentication |
| **bcryptjs** | 2.4.3 | Password Hashing | Secure password storage |
| **Nodemailer** | 6.9.8 | Email Service | SMTP email sending |
| **Zod** | 3.22.4 | Validation | Runtime type checking |
| **CORS** | 2.8.5 | Cross-Origin | Request handling |
| **dotenv** | 16.3.1 | Environment | Configuration management |

### 🔧 Development Tools

| Tool | Purpose | Features |
|------|---------|----------|
| **tsx** | TypeScript Execution | Hot reload, Development |
| **Bun** | Package Manager | Fast installs, Runtime |
| **ESLint** | Code Linting | Code quality, Standards |
| **Prettier** | Code Formatting | Consistent formatting |
| **Prisma Studio** | Database GUI | Visual database management |

### ☁️ External Services

| Service | Purpose | Integration |
|---------|---------|-------------|
| **Cloudinary** | File Storage | Image/file upload, CDN |
| **SMTP Provider** | Email Delivery | Gmail, SendGrid, etc. |
| **PostgreSQL** | Database | Local or cloud hosting |
| **Redis** | Cache/Queue | Local or cloud hosting |

---

## 📊 Database Schema

### Entity Relationship Diagram
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │     │   Project   │     │     Bid     │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │────►│ id (PK)     │◄────│ id (PK)     │
│ name        │     │ title       │     │ bidAmount   │
│ email       │     │ description │     │ message     │
│ password    │     │ budgetRange │     │ projectId   │
│ role        │     │ deadline    │     │ sellerId    │
│ profileImg  │     │ status      │     │ createdAt   │
│ bio         │     │ buyerId     │     └─────────────┘
│ skills[]    │     │ sellerId    │
│ avgRating   │     │ createdAt   │
│ totalReviews│     └─────────────┘
└─────────────┘            │
       │                   │
       │            ┌─────────────┐     ┌─────────────┐
       │            │ Deliverable │     │   Review    │
       │            ├─────────────┤     ├─────────────┤
       └───────────►│ id (PK)     │     │ id (PK)     │
                    │ fileUrl     │     │ rating      │
                    │ fileName    │     │ comment     │
                    │ fileSize    │     │ projectId   │
                    │ projectId   │     │ buyerId     │
                    │ uploadedAt  │     │ sellerId    │
                    └─────────────┘     │ createdAt   │
                                        └─────────────┘
```




## 🚦 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** 18+ or **Bun** (recommended)
- **PostgreSQL** database server
- **Redis** server (for background jobs)
- **Cloudinary** account (for file uploads)
- **SMTP** email service (Gmail, SendGrid, etc.)

### Quick Start

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/buildboard.git
cd buildboard
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
bun install
# or npm install

# Environment setup
cp .env.example .env
# Edit .env with your configuration (see Configuration section)

# Database setup
bunx prisma generate
bunx prisma db push

# Start development server
bun run dev
```

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
bun install
# or npm install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
bun run dev
```

#### 4. Start Background Worker (Optional)
```bash
cd backend
bun run worker
```

### Development URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api

---

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/buildboard_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"

# Redis Configuration (for background jobs)
REDIS_URL="redis://localhost:6379"

# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="BuildBoard <noreply@buildboard.com>"
```

### Frontend Environment Variables (.env.local)
```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```



## 🔗 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "BUYER" | "SELLER",
  "profileImageUrl": "https://example.com/image.jpg" // optional
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "BUYER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Project Endpoints

#### POST `/api/projects/create` 🔒
Create a new project (Buyer only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Build a Modern Website",
  "description": "Need a responsive website with modern design...",
  "budgetRange": "$1000-$5000",
  "deadline": "2024-12-31T23:59:59.000Z",
  "imageUrl": "https://example.com/project-image.jpg" // optional
}
```

#### GET `/api/projects` 🔒
Get all projects with filtering options.

**Query Parameters:**
- `status`: Filter by project status
- `role`: Filter by user role context
- `page`: Pagination page number
- `limit`: Items per page

#### GET `/api/projects/:id` 🔒
Get detailed project information including bids.

### Bidding Endpoints

#### POST `/api/bids/place` 🔒
Place a bid on a project (Seller only).

**Request Body:**
```json
{
  "projectId": "project_id",
  "bidAmount": 2500.00,
  "estimatedCompletionTime": "2 weeks",
  "message": "I have extensive experience in..."
}
```

#### GET `/api/bids/:projectId` 🔒
Get all bids for a specific project.

### Review Endpoints

#### POST `/api/reviews/:projectId` 🔒
Create a review for a completed project (Buyer only).

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent work, delivered on time!"
}
```

### Profile Endpoints

#### GET `/api/profile/:userId` 🔒
Get user profile with statistics.

#### PUT `/api/profile/:userId` 🔒
Update user profile information.

### Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "errors": ["Detailed error messages"], // for validation errors
  "code": "ERROR_CODE" // optional
}
```


## 📁 Project Structure

```
BuildBoard/
├── 📁 frontend/                    # Next.js Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 app/                # App Router (Next.js 13+)
│   │   │   ├── 📁 (Protected)/    # Protected routes group
│   │   │   │   ├── 📁 dashboard/  # Dashboard pages
│   │   │   │   ├── 📁 projects/   # Project management
│   │   │   │   ├── 📁 profile/    # User profile
│   │   │   │   └── layout.tsx     # Protected layout
│   │   │   ├── 📁 auth/           # Authentication pages
│   │   │   │   ├── 📁 login/      # Login page
│   │   │   │   └── 📁 register/   # Registration page
│   │   │   ├── 📁 api/            # API routes (if needed)
│   │   │   ├── globals.css        # Global styles
│   │   │   ├── layout.tsx         # Root layout
│   │   │   └── page.tsx           # Landing page
│   │   ├── 📁 components/         # Reusable Components
│   │   │   ├── 📁 ui/            # shadcn/ui components
│   │   │   ├── 📁 profile/       # Profile components
│   │   │   └── FileUpload.tsx    # File upload component
│   │   ├── 📁 lib/               # Utilities & Configuration
│   │   │   ├── auth.ts           # Authentication store
│   │   │   ├── api.ts            # API client
│   │   │   └── utils.ts          # Utility functions
│   │   ├── 📁 hooks/             # Custom React Hooks
│   │   ├── 📁 types/             # TypeScript definitions
│   │   └── middleware.ts         # Next.js middleware
│   ├── 📁 public/                # Static Assets
│   ├── package.json              # Dependencies & scripts
│   ├── tailwind.config.js        # Tailwind configuration
│   └── next.config.ts            # Next.js configuration
│
├── 📁 backend/                     # Node.js Backend API
│   ├── 📁 src/
│   │   ├── 📁 routes/            # API Route Handlers
│   │   │   ├── auth.ts           # Authentication routes
│   │   │   ├── projects.ts       # Project management
│   │   │   ├── bids.ts           # Bidding system
│   │   │   ├── reviews.ts        # Review system
│   │   │   └── profile.ts        # User profiles
│   │   ├── 📁 lib/               # Core Libraries
│   │   │   ├── auth.ts           # JWT utilities
│   │   │   ├── email.ts          # Email service
│   │   │   └── prisma.ts         # Database client
│   │   ├── 📁 middleware/        # Express Middleware
│   │   │   └── auth.ts           # Authentication middleware
│   │   ├── 📁 services/          # Background Services
│   │   │   ├── emailQueue.ts     # Email queue service
│   │   │   ├── worker.ts         # Background worker
│   │   │   └── worker-start.ts   # Worker startup
│   │   ├── 📁 config/            # Configuration
│   │   │   └── redis.config.ts   # Redis configuration
│   │   ├── 📁 types/             # TypeScript definitions
│   │   │   ├── express.d.ts      # Express extensions
│   │   │   └── queue.ts          # Queue job types
│   │   └── index.ts              # Application entry point
│   ├── 📁 prisma/                # Database Schema & Migrations
│   │   ├── 📁 migrations/        # Database migrations
│   │   └── schema.prisma         # Prisma schema
│   ├── package.json              # Dependencies & scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── .env.example              # Environment template
│   └── README.md                 # Backend documentation
│
├── 📄 README.md                   # Project documentation
├── 📄 .gitignore                 # Git ignore rules
└── 📄 LICENSE                    # Project license
```




