# BuildBoard Frontend

<div align="center">
  <h3>🎨 Modern Next.js Frontend with Dark Theme & Responsive Design</h3>
  <p>Beautiful, fast, and user-friendly interface for the BuildBoard platform</p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)
  ![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
  ![Tailwind](https://img.shields.io/badge/Tailwind-4.0-cyan?style=for-the-badge&logo=tailwindcss)
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [🎨 Design System](#-design-system)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚦 Getting Started](#-getting-started)
- [🔧 Configuration](#-configuration)
- [🎯 Features](#-features)
- [📱 Responsive Design](#-responsive-design)
- [♿ Accessibility](#-accessibility)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)

---

## Overview

The BuildBoard frontend is a modern, responsive web application built with Next.js 15 and React 19. It features a beautiful dark theme, smooth animations, and an intuitive user interface that provides an exceptional user experience for both buyers and sellers on the platform.

### 🎯 Key Features

- **Modern UI/UX**: Beautiful dark theme with carefully crafted design
- **Responsive Design**: Mobile-first approach with seamless cross-device experience
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Performance**: Optimized with Next.js App Router and modern React features
- **State Management**: Zustand for lightweight and efficient state management
- **Form Handling**: React Hook Form with Zod validation for robust form management
- **File Upload**: Drag-and-drop file upload with Cloudinary integration
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

---



## 🛠 Tech Stack

### Core Technologies

| Technology | Version | Purpose | Features |
|------------|---------|---------|----------|
| **Next.js** | 15.3.3 | React Framework | App Router, SSR, Image Optimization |
| **React** | 19.1.0 | UI Library | Hooks, Suspense, Concurrent Features |
| **TypeScript** | 5.0+ | Type Safety | Static typing, IntelliSense |
| **Tailwind CSS** | 4.0 | Styling | Utility-first, Dark theme |

### UI & Components

| Technology | Version | Purpose |
|------------|---------|---------|
| **shadcn/ui** | Latest | UI Components |
| **Radix UI** | Latest | Headless UI Primitives |
| **Lucide React** | 0.516.0 | Icon Library |
| **React Dropzone** | 14.3.8 | File Upload |

### State & Forms

| Technology | Version | Purpose |
|------------|---------|---------|
| **Zustand** | 5.0.5 | State Management |
| **React Hook Form** | 7.58.1 | Form Management |
| **Zod** | 3.25.67 | Schema Validation |

### Utilities & Services

| Technology | Version | Purpose |
|------------|---------|---------|
| **Axios** | 1.10.0 | HTTP Client |
| **Date-fns** | 4.1.0 | Date Utilities |
| **Cloudinary** | 2.6.1 | File Storage |
| **Sonner** | 2.0.5 | Toast Notifications |

---

## 📁 Project Structure

```
frontend/
├── 📁 src/
│   ├── 📁 app/                     # Next.js App Router
│   │   ├── 📁 (Protected)/        # Protected Routes Group
│   │   │   ├── 📁 dashboard/       # Dashboard Pages
│   │   │   │   └── page.tsx        # Main dashboard
│   │   │   ├── 📁 projects/        # Project Management
│   │   │   │   ├── page.tsx        # Projects list
│   │   │   │   ├── create/         # Create project
│   │   │   │   └── [id]/           # Project details
│   │   │   ├── 📁 profile/         # User Profile
│   │   │   │   ├── page.tsx        # Profile view
│   │   │   │   └── edit/           # Edit profile
│   │   │   └── layout.tsx          # Protected layout
│   │   ├── 📁 auth/                # Authentication Pages
│   │   │   ├── 📁 login/           # Login page
│   │   │   │   └── page.tsx
│   │   │   └── 📁 register/        # Registration page
│   │   │       └── page.tsx
│   │   ├── 📁 api/                 # API Routes (if needed)
│   │   ├── globals.css             # Global Styles
│   │   ├── layout.tsx              # Root Layout
│   │   └── page.tsx                # Landing Page
│   ├── 📁 components/              # Reusable Components
│   │   ├── 📁 ui/                  # shadcn/ui Components
│   │   │   ├── button.tsx          # Button component
│   │   │   ├── card.tsx            # Card component
│   │   │   ├── input.tsx           # Input component
│   │   │   ├── dialog.tsx          # Modal component
│   │   │   └── ...                 # Other UI components
│   │   ├── 📁 profile/             # Profile Components
│   │   │   ├── ProfileCard.tsx     # Profile display
│   │   │   ├── ProfileForm.tsx     # Profile editing
│   │   │   └── ProfileStats.tsx    # Statistics display
│   │   ├── FileUpload.tsx          # File upload component
│   │   ├── ProjectCard.tsx         # Project display card
│   │   ├── BidCard.tsx             # Bid display card
│   │   └── Navigation.tsx          # Navigation component
│   ├── 📁 lib/                     # Utilities & Configuration
│   │   ├── auth.ts                 # Authentication store
│   │   ├── api.ts                  # API client configuration
│   │   ├── utils.ts                # Utility functions
│   │   ├── validations.ts          # Zod schemas
│   │   └── constants.ts            # App constants
│   ├── 📁 hooks/                   # Custom React Hooks
│   │   ├── useAuth.ts              # Authentication hook
│   │   ├── useProjects.ts          # Projects data hook
│   │   ├── useBids.ts              # Bids data hook
│   │   └── useFileUpload.ts        # File upload hook
│   ├── 📁 types/                   # TypeScript Definitions
│   │   ├── auth.ts                 # Authentication types
│   │   ├── project.ts              # Project types
│   │   ├── bid.ts                  # Bid types
│   │   └── api.ts                  # API response types
│   └── middleware.ts               # Next.js Middleware
├── 📁 public/                      # Static Assets
│   ├── favicon.ico                 # Favicon
│   ├── logo.png                    # App logo
│   └── images/                     # Static images
├── 📄 package.json                 # Dependencies & Scripts
├── 📄 tailwind.config.js           # Tailwind Configuration
├── 📄 next.config.ts               # Next.js Configuration
├── 📄 tsconfig.json                # TypeScript Configuration
├── 📄 components.json              # shadcn/ui Configuration
└── 📄 README.md                    # This file
```

### Key Directories Explained

#### App Router Structure (`src/app/`)
- **Route Groups**: `(Protected)` for authenticated routes
- **Dynamic Routes**: `[id]` for parameterized pages
- **Nested Layouts**: Layout components for different sections
- **Loading & Error**: Special files for loading and error states

#### Components (`src/components/`)
- **UI Components**: Reusable shadcn/ui components
- **Feature Components**: Domain-specific components
- **Compound Components**: Complex components with multiple parts

#### Utilities (`src/lib/`)
- **API Client**: Axios configuration with interceptors
- **Authentication**: Zustand store for auth state
- **Validations**: Zod schemas for form validation
- **Utils**: Helper functions and utilities

---

## 🚦 Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** (recommended)
- **Backend API** running on http://localhost:5000
- **Cloudinary** account for file uploads

### Installation

1. **Navigate to Frontend Directory**
```bash
cd buildboard/frontend
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
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start Development Server**
```bash
# Using Bun
bun run dev

# Using npm
npm run dev
```

### Development URLs
- **Frontend**: http://localhost:3000


---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:5000/api"

# Optional: Analytics
NEXT_PUBLIC_GA_ID="your-google-analytics-id"
```

