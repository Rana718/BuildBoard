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

