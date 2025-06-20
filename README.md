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

### Core Models

#### User Model
```typescript
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

#### Project Model
```typescript
model Project {
  id          String        @id @default(cuid())
  title       String
  description String
  budgetRange String
  deadline    DateTime
  status      ProjectStatus @default(PENDING)
  imageUrl    String?
  buyerId     String
  sellerId    String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}
```

### Enums
- **Role**: `BUYER`, `SELLER`
- **ProjectStatus**: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`

---

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

### Database Setup

#### Using Docker (Recommended)
```bash
# PostgreSQL
docker run --name buildboard-postgres \
  -e POSTGRES_DB=buildboard_db \
  -e POSTGRES_USER=buildboard \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 -d postgres:15

# Redis
docker run --name buildboard-redis \
  -p 6379:6379 -d redis:7-alpine
```

#### Manual Installation
1. Install PostgreSQL and create a database
2. Install Redis server
3. Update connection strings in `.env`

---

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

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

---

## 🎨 UI/UX Features

### 🌙 Dark Theme Design
- **Modern Dark UI**: Carefully crafted dark theme with optimal contrast ratios
- **Gradient Backgrounds**: Subtle gradients creating visual depth and hierarchy
- **Color Palette**: Professional color scheme with primary blues and accent colors
- **Typography**: Clean, readable fonts with proper spacing and hierarchy

### ✨ Interactive Elements
- **Smooth Animations**: CSS transitions and keyframe animations for all interactions
- **Hover Effects**: Subtle hover states with scale, translate, and color transitions
- **Loading States**: Shimmer effects and skeleton screens during data loading
- **Button Interactions**: Scale and translate animations with visual feedback

### 📱 Responsive Design
- **Mobile-First**: Optimized for mobile devices with progressive enhancement
- **Breakpoint System**: Tailored layouts for mobile, tablet, and desktop
- **Touch-Friendly**: Appropriate touch targets and gesture support
- **Cross-Browser**: Compatible with all modern browsers

### ♿ Accessibility Features
- **WCAG Compliance**: Meets Web Content Accessibility Guidelines
- **Keyboard Navigation**: Full keyboard navigation support
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators and logical tab order
- **Color Contrast**: High contrast ratios for text and interactive elements

### 🎯 Status Indicators
- **Color-Coded Badges**: Visual project status indicators
- **Progress Tracking**: Visual progress bars and completion states
- **Real-Time Updates**: Live status changes without page refresh
- **Notification System**: Toast notifications for user actions

---

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

### Key Directories Explained

#### Frontend Structure
- **`app/`**: Next.js App Router with file-based routing
- **`components/ui/`**: Reusable UI components from shadcn/ui
- **`lib/`**: Utility functions, API clients, and configurations
- **`hooks/`**: Custom React hooks for shared logic

#### Backend Structure
- **`routes/`**: Express.js route handlers organized by feature
- **`services/`**: Background job processing and external services
- **`middleware/`**: Express middleware for authentication and validation
- **`prisma/`**: Database schema and migration files

---

## 🔒 Security

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication with secure token generation
- **Password Security**: bcryptjs hashing with salt rounds for password storage
- **Role-Based Access**: Granular permissions for Buyer and Seller roles
- **Token Expiration**: Configurable token expiration and refresh mechanisms
- **Session Management**: Secure session handling with httpOnly cookies

### Data Protection
- **Input Validation**: Comprehensive validation using Zod schemas
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **XSS Protection**: Input sanitization and output encoding
- **CORS Configuration**: Properly configured cross-origin resource sharing
- **Rate Limiting**: API rate limiting to prevent abuse (recommended for production)

### Environment Security
- **Environment Variables**: Sensitive data stored in environment variables
- **Secret Management**: Secure handling of API keys and secrets
- **Database Security**: Connection string encryption and access controls
- **File Upload Security**: Cloudinary integration with secure upload policies

### Production Security Checklist
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure secure headers (helmet.js)
- [ ] Implement rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security audits
- [ ] Database backup and recovery
- [ ] Environment variable encryption

---

## 📈 Performance

### Frontend Optimization
- **Next.js Optimizations**: Built-in performance optimizations
  - Automatic code splitting
  - Image optimization with next/image
  - Static site generation (SSG) where applicable
  - Server-side rendering (SSR) for dynamic content
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Caching Strategy**: Browser caching and CDN integration
- **Lazy Loading**: Component and route-based lazy loading

### Backend Performance
- **Database Optimization**: 
  - Prisma query optimization
  - Database indexing on frequently queried fields
  - Connection pooling for database connections
- **Caching Layer**: Redis caching for frequently accessed data
- **Background Jobs**: Asynchronous processing with BullMQ
- **API Optimization**: Efficient query patterns and response compression

### Monitoring & Analytics
- **Performance Metrics**: Response time and throughput monitoring
- **Error Tracking**: Comprehensive error logging and tracking
- **Database Monitoring**: Query performance and optimization
- **Queue Monitoring**: Background job processing metrics

### Scalability Considerations
- **Horizontal Scaling**: Stateless architecture for easy scaling
- **Database Scaling**: Read replicas and sharding strategies
- **CDN Integration**: Global content delivery for static assets
- **Load Balancing**: Multiple server instances with load distribution

---

## 🚀 Deployment

### Production Environment Setup

#### Prerequisites
- **Server**: VPS or cloud instance (AWS, DigitalOcean, etc.)
- **Domain**: Custom domain with SSL certificate
- **Database**: PostgreSQL (managed service recommended)
- **Redis**: Redis instance for background jobs
- **Email**: Production SMTP service (SendGrid, AWS SES)
- **Storage**: Cloudinary or AWS S3 for file storage

### Deployment Options

#### Option 1: Traditional VPS Deployment

**1. Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Redis
sudo apt install redis-server
```

**2. Application Deployment**
```bash
# Clone repository
git clone https://github.com/yourusername/buildboard.git
cd buildboard

# Backend deployment
cd backend
npm install --production
npm run build
pm2 start dist/index.js --name "buildboard-api"

# Frontend deployment
cd ../frontend
npm install
npm run build
pm2 start npm --name "buildboard-web" -- start

# Worker process
cd ../backend
pm2 start dist/services/worker-start.js --name "buildboard-worker"
```

**3. Nginx Configuration**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Option 2: Docker Deployment

**1. Docker Compose Configuration**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: buildboard_db
      POSTGRES_USER: buildboard
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://buildboard:${DB_PASSWORD}@postgres:5432/buildboard_db
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "5000:5000"
    depends_on:
      - postgres
      - redis

  worker:
    build: ./backend
    command: node dist/services/worker-start.js
    environment:
      DATABASE_URL: postgresql://buildboard:${DB_PASSWORD}@postgres:5432/buildboard_db
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: https://yourdomain.com/api
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

**2. Docker Build Files**

Backend Dockerfile:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["node", "dist/index.js"]
```

Frontend Dockerfile:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Option 3: Cloud Platform Deployment

**Vercel (Frontend) + Railway/Render (Backend)**

1. **Frontend on Vercel**:
   - Connect GitHub repository
   - Configure environment variables
   - Automatic deployments on push

2. **Backend on Railway/Render**:
   - Connect GitHub repository
   - Configure environment variables
   - Set build and start commands

### Environment Variables for Production

```env
# Production Backend (.env)
NODE_ENV=production
PORT=5000
DATABASE_URL="postgresql://user:pass@host:5432/db"
REDIS_URL="redis://host:6379"
JWT_SECRET="production-secret-key-minimum-32-characters"
FRONTEND_URL="https://yourdomain.com"

# Email Configuration
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
SMTP_FROM="BuildBoard <noreply@yourdomain.com>"

# Production Frontend (.env.local)
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-production-cloud"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your-production-key"
CLOUDINARY_API_SECRET="your-production-secret"
```

### Post-Deployment Checklist

- [ ] SSL certificate installed and configured
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Email service tested
- [ ] File upload functionality tested
- [ ] Background jobs processing
- [ ] Monitoring and logging configured
- [ ] Backup strategy implemented
- [ ] Performance testing completed
- [ ] Security headers configured

---

## 🤝 Contributing

We welcome contributions to BuildBoard! Please follow these guidelines:

### Development Workflow

1. **Fork the Repository**
   ```bash
   git fork https://github.com/yourusername/buildboard.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

4. **Commit Your Changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```

5. **Push to Your Branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Ensure all tests pass

### Code Style Guidelines

#### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

#### React Components
- Use functional components with hooks
- Implement proper prop types with TypeScript
- Follow the single responsibility principle
- Use custom hooks for shared logic

#### API Development
- Follow RESTful conventions
- Implement proper error handling
- Use Zod for input validation
- Add comprehensive API documentation

### Testing Guidelines

#### Frontend Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

#### Backend Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run all tests
npm run test:all
```

### Issue Reporting

When reporting issues, please include:
- **Environment**: OS, Node.js version, browser
- **Steps to Reproduce**: Clear step-by-step instructions
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Error Messages**: Full error messages and stack traces

### Feature Requests

For feature requests, please provide:
- **Use Case**: Why is this feature needed?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other solutions considered
- **Additional Context**: Any other relevant information

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

- ✅ **Commercial Use**: Use for commercial purposes
- ✅ **Modification**: Modify the source code
- ✅ **Distribution**: Distribute the software
- ✅ **Private Use**: Use privately
- ❌ **Liability**: No liability for damages
- ❌ **Warranty**: No warranty provided

---

## 🆘 Support & Community

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

### Community

- **Discord**: [Join our Discord server](https://discord.gg/buildboard) (if available)
- **Twitter**: [@BuildBoard](https://twitter.com/buildboard) (if available)
- **Email**: support@buildboard.com (if available)

### Acknowledgments

- **Next.js Team**: For the amazing React framework
- **Prisma Team**: For the excellent database toolkit
- **shadcn**: For the beautiful UI components
- **Vercel**: For the deployment platform
- **All Contributors**: Thank you for your contributions!

---

<div align="center">
  <h3>🚀 Built with ❤️ using Modern Web Technologies</h3>
  <p>
    <strong>BuildBoard</strong> - Connecting Buyers with Skilled Sellers
  </p>
  <p>
    <a href="#overview">Overview</a> •
    <a href="#-features">Features</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-api-documentation">API Docs</a> •
    <a href="#-deployment">Deployment</a>
  </p>
</div>
