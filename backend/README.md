# BuildBoard Backend API

<div align="center">
  <h3>🚀 Node.js Express API with TypeScript, PostgreSQL & Redis</h3>
  <p>Robust backend service powering the BuildBoard project management platform</p>
  
  ![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
  ![Express](https://img.shields.io/badge/Express-4.18-black?style=for-the-badge&logo=express)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?style=for-the-badge&logo=postgresql)
  ![Redis](https://img.shields.io/badge/Redis-Latest-red?style=for-the-badge&logo=redis)
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [🏗️ Architecture](#️-architecture)
- [🛠 Tech Stack](#-tech-stack)
- [📊 Database Schema](#-database-schema)
- [🚦 Getting Started](#-getting-started)
- [🔧 Configuration](#-configuration)
- [🔗 API Endpoints](#-api-endpoints)
- [🔒 Authentication](#-authentication)
- [📧 Email System](#-email-system)
- [⚡ Background Jobs](#-background-jobs)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)

---

## Overview

The BuildBoard backend is a robust Node.js API built with Express.js and TypeScript. It provides a comprehensive set of RESTful endpoints for managing users, projects, bids, reviews, and notifications. The architecture emphasizes security, scalability, and maintainability with modern development practices.

### 🎯 Key Features

- **RESTful API**: Clean, consistent API design following REST principles
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Authentication**: JWT-based authentication with role-based access control
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Background Jobs**: Redis-powered queue system for email processing
- **Validation**: Comprehensive input validation using Zod schemas
- **Security**: Multiple security layers including CORS, input sanitization, and password hashing
- **Email Service**: Automated email notifications with template system
- **Error Handling**: Centralized error handling with detailed logging

---

## 🏗️ Architecture

### System Components
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Routes    │    │   Middleware    │    │   Services      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • auth.ts       │    │ • auth.ts       │    │ • emailQueue.ts │
│ • projects.ts   │◄──►│ • validation    │◄──►│ • worker.ts     │
│ • bids.ts       │    │ • error handler │    │ • email.ts      │
│ • reviews.ts    │    │ • cors          │    └─────────────────┘
│ • profile.ts    │    │ • rate limiting │
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Database      │    │   External      │
├─────────────────┤    ├─────────────────┤
│ • PostgreSQL    │    │ • Redis Queue   │
│ • Prisma ORM    │    │ • SMTP Email    │
│ • Migrations    │    │ • Cloudinary    │
└─────────────────┘    └─────────────────┘
```

### Request Flow
1. **HTTP Request** → Express.js Router
2. **Authentication** → JWT Middleware Verification
3. **Validation** → Zod Schema Validation
4. **Authorization** → Role-based Access Control
5. **Business Logic** → Route Handler Processing
6. **Database** → Prisma ORM Operations
7. **Background Jobs** → Queue Email Notifications
8. **Response** → JSON API Response

---

## 🛠 Tech Stack

### Core Technologies

| Technology | Version | Purpose | Features |
|------------|---------|---------|----------|
| **Node.js** | 18+ | Runtime Environment | JavaScript runtime, NPM ecosystem |
| **TypeScript** | 5.0+ | Type Safety | Static typing, IntelliSense, Compile-time checks |
| **Express.js** | 4.18.2 | Web Framework | Middleware, Routing, HTTP utilities |
| **Prisma** | 6.9.0 | Database ORM | Type-safe queries, Migrations, Schema management |
| **PostgreSQL** | Latest | Database | ACID compliance, JSON support, Performance |

### Authentication & Security

| Technology | Version | Purpose |
|------------|---------|---------|
| **jsonwebtoken** | 9.0.2 | JWT Authentication |
| **bcryptjs** | 2.4.3 | Password Hashing |
| **cors** | 2.8.5 | Cross-Origin Requests |
| **zod** | 3.22.4 | Input Validation |

### Background Processing

| Technology | Version | Purpose |
|------------|---------|---------|
| **BullMQ** | 5.54.3 | Job Queue System |
| **ioredis** | 5.6.1 | Redis Client |
| **nodemailer** | 6.9.8 | Email Service |

### Development Tools

| Tool | Purpose |
|------|---------|
| **tsx** | TypeScript execution with hot reload |
| **prisma** | Database toolkit and CLI |
| **dotenv** | Environment variable management |

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

### Database Models

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

  // Relations
  projectsAsBuyer  Project[] @relation("BuyerProjects")
  projectsAsSeller Project[] @relation("SellerProjects")
  bids             Bid[]
  reviewsGiven     Review[]  @relation("BuyerReviews")
  reviewsReceived  Review[]  @relation("SellerReviews")
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

  // Relations
  buyer        User          @relation("BuyerProjects", fields: [buyerId], references: [id])
  seller       User?         @relation("SellerProjects", fields: [sellerId], references: [id])
  bids         Bid[]
  deliverables Deliverable[]
  reviews      Review[]
}
```

### Enums
- **Role**: `BUYER`, `SELLER`
- **ProjectStatus**: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** (recommended)
- **PostgreSQL** database server
- **Redis** server (for background jobs)
- **SMTP** email service account

### Installation

1. **Clone and Navigate**
```bash
git clone <repository-url>
cd buildboard/backend
```

2. **Install Dependencies**
```bash
# Using Bun (recommended)
bun install

# Using npm
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Database Setup**
```bash
# Generate Prisma client
bunx prisma generate

# Push schema to database
bunx prisma db push

# Optional: Seed database
bunx prisma db seed
```

5. **Start Development Server**
```bash
# API server
bun run dev

# Background worker (separate terminal)
bun run worker
```

### Development URLs
- **API Server**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health
- **Prisma Studio**: `bunx prisma studio`

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

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

### Database Configuration

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
1. Install PostgreSQL and create database
2. Install Redis server
3. Update `DATABASE_URL` and `REDIS_URL` in `.env`

---

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)

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

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "clx1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "BUYER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "clx1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "BUYER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET `/api/auth/me` 🔒
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Project Routes (`/api/projects`) 🔒

#### POST `/api/projects/create`
Create a new project (Buyer only).

**Request Body:**
```json
{
  "title": "Build a Modern E-commerce Website",
  "description": "Need a responsive e-commerce website with payment integration...",
  "budgetRange": "$2000-$5000",
  "deadline": "2024-12-31T23:59:59.000Z",
  "imageUrl": "https://example.com/project-image.jpg" // optional
}
```

#### GET `/api/projects`
Get projects with filtering and pagination.

**Query Parameters:**
- `status`: Filter by project status (`PENDING`, `IN_PROGRESS`, `COMPLETED`)
- `role`: Context-based filtering (`buyer`, `seller`)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### GET `/api/projects/:id`
Get detailed project information including bids.

#### POST `/api/projects/select-seller/:id`
Select a seller for the project (Buyer only).

**Request Body:**
```json
{
  "sellerId": "clx0987654321"
}
```

### Bidding Routes (`/api/bids`) 🔒

#### POST `/api/bids/place`
Place a bid on a project (Seller only).

**Request Body:**
```json
{
  "projectId": "clx1234567890",
  "bidAmount": 3500.00,
  "estimatedCompletionTime": "3 weeks",
  "message": "I have 5+ years of experience in e-commerce development..."
}
```

#### GET `/api/bids/:projectId`
Get all bids for a specific project.

### Review Routes (`/api/reviews`) 🔒

#### POST `/api/reviews/:projectId`
Create a review for completed project (Buyer only).

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent work! Delivered on time and exceeded expectations."
}
```

#### GET `/api/reviews/seller/:sellerId`
Get reviews for a specific seller with pagination.

### Profile Routes (`/api/profile`) 🔒

#### GET `/api/profile/:userId`
Get user profile with statistics.

**Response:**
```json
{
  "user": {
    "id": "clx1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "SELLER",
    "bio": "Full-stack developer with 5+ years experience",
    "skills": ["React", "Node.js", "PostgreSQL"],
    "averageRating": 4.8,
    "totalReviews": 25
  },
  "stats": {
    "totalProjects": 30,
    "completedProjects": 28,
    "totalEarnings": 45000.00
  }
}
```

### Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

---

## 🔒 Authentication

### JWT Implementation

The API uses JSON Web Tokens (JWT) for stateless authentication:

```typescript
// Token Generation
const token = jwt.sign(
  { 
    userId: user.id, 
    email: user.email, 
    role: user.role 
  },
  process.env.JWT_SECRET!,
  { expiresIn: '7d' }
);
```

### Authentication Middleware

```typescript
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};
```

### Role-Based Access Control

```typescript
export const requireRole = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions' 
      });
    }
    next();
  };
};
```

### Password Security

Passwords are hashed using bcryptjs with salt rounds:

```typescript
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

---

## 📧 Email System

### Email Service Architecture

The email system uses a queue-based approach for reliable delivery:

```typescript
// Email Queue Service
export class EmailQueueService {
  static async addEmailJob<T extends EmailJobTypes>(
    jobType: T,
    data: QueueJobData[T],
    options?: {
      delay?: number;
      priority?: number;
      attempts?: number;
    }
  ) {
    const job = await emailQueue.add(jobType, data, {
      delay: options?.delay || 0,
      priority: options?.priority || 0,
      attempts: options?.attempts || 3,
    });
    return job;
  }
}
```

### Email Templates

#### Welcome Email
```typescript
export const sendWelcomeEmail = async (userEmail: string, userName: string) => {
  const subject = `Welcome to BuildBoard, ${userName}!`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to BuildBoard!</h2>
      <p>Hi ${userName},</p>
      <p>Thank you for joining BuildBoard, the modern platform connecting buyers with skilled sellers.</p>
      <p>Get started by exploring projects or posting your first project!</p>
    </div>
  `;
  return sendEmail(userEmail, subject, html);
};
```

#### Seller Selection Email
```typescript
export const sendSellerSelectionEmail = async (
  sellerEmail: string,
  sellerName: string,
  projectTitle: string,
  buyerName: string
) => {
  const subject = `🎉 You've been selected for project: ${projectTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Congratulations! You've been selected!</h2>
      <p>Hi ${sellerName},</p>
      <p>Great news! You have been selected to work on "${projectTitle}" by ${buyerName}.</p>
      <p>The project status has been updated to "In Progress". Please log in to view details.</p>
    </div>
  `;
  return sendEmail(sellerEmail, subject, html);
};
```

---

## ⚡ Background Jobs

### Queue System with BullMQ

The application uses BullMQ with Redis for background job processing:

```typescript
// Queue Configuration
export const emailQueue = new Queue('email-queue', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: true,
  },
});
```

### Worker Implementation

```typescript
// Email Worker
export const emailWorker = new Worker('email-queue', async (job: Job) => {
  const { name, data } = job;
  
  console.log(`📧 Processing email job: ${name} (ID: ${job.id})`);
  
  try {
    switch (name as EmailJobTypes) {
      case 'welcome-email':
        await sendWelcomeEmail(data.userEmail, data.userName);
        break;
      case 'seller-selection-email':
        await sendSellerSelectionEmail(
          data.sellerEmail,
          data.sellerName,
          data.projectTitle,
          data.buyerName
        );
        break;
      // ... other email types
    }
    
    console.log(`✅ Email job completed: ${name}`);
  } catch (error) {
    console.error(`❌ Email job failed: ${name}`, error);
    throw error;
  }
}, {
  connection: redis,
  concurrency: 5,
});
```

### Job Types

```typescript
export type EmailJobTypes = 
  | 'welcome-email'
  | 'seller-selection-email'
  | 'bid-notification-email'
  | 'project-completed-email'
  | 'send-email';

export interface QueueJobData {
  'welcome-email': {
    userEmail: string;
    userName: string;
  };
  'seller-selection-email': {
    sellerEmail: string;
    sellerName: string;
    projectTitle: string;
    buyerName: string;
  };
  // ... other job data types
}
```

---

## 🧪 Testing

### Test Structure

```bash
backend/
├── src/
│   ├── __tests__/
│   │   ├── unit/
│   │   │   ├── auth.test.ts
│   │   │   ├── projects.test.ts
│   │   │   └── validation.test.ts
│   │   ├── integration/
│   │   │   ├── api.test.ts
│   │   │   └── database.test.ts
│   │   └── fixtures/
│   │       └── testData.ts
│   └── ...
```

### Running Tests

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# All tests
npm test

# Test coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Examples

#### Unit Test Example
```typescript
// auth.test.ts
describe('Authentication', () => {
  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(await comparePassword(password, hash)).toBe(true);
    });
  });
});
```

#### Integration Test Example
```typescript
// api.test.ts
describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'BUYER'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.token).toBeDefined();
  });
});
```

---

## 🚀 Deployment

### Production Environment

#### Environment Variables
```env
NODE_ENV=production
PORT=5000
DATABASE_URL="postgresql://user:pass@host:5432/db"
REDIS_URL="redis://host:6379"
JWT_SECRET="production-secret-key-minimum-32-characters"
FRONTEND_URL="https://yourdomain.com"

# Production Email
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
SMTP_FROM="BuildBoard <noreply@yourdomain.com>"
```

#### Build and Start
```bash
# Install production dependencies
npm ci --only=production

# Build TypeScript
npm run build

# Run database migrations
npx prisma migrate deploy

# Start application
npm start

# Start worker process
npm run worker:build
```

### Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://buildboard:password@postgres:5432/buildboard_db
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  worker:
    build: .
    command: npm run worker:build
    environment:
      DATABASE_URL: postgresql://buildboard:password@postgres:5432/buildboard_db
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: buildboard_db
      POSTGRES_USER: buildboard
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  postgres_data:
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented
- [ ] Health checks configured
- [ ] Worker processes running
- [ ] Email service tested

---

<div align="center">
  <h3>🚀 Built with Modern Backend Technologies</h3>
  <p>
    <strong>BuildBoard Backend</strong> - Robust, Scalable, and Secure
  </p>
</div>
