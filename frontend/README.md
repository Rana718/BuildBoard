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

## 🎨 Design System

### Color Palette

#### Dark Theme Colors
```css
/* Primary Colors */
--background: 222.2 84% 4.9%        /* Deep dark background */
--foreground: 210 40% 98%           /* Light text */
--primary: 217.2 91.2% 59.8%        /* Blue accent */
--primary-foreground: 222.2 84% 4.9% /* Dark text on primary */

/* Secondary Colors */
--secondary: 217.2 32.6% 17.5%      /* Muted dark */
--secondary-foreground: 210 40% 98% /* Light text on secondary */
--muted: 217.2 32.6% 17.5%          /* Subtle backgrounds */
--muted-foreground: 215 20.2% 65.1% /* Muted text */

/* Accent Colors */
--accent: 217.2 32.6% 17.5%         /* Accent backgrounds */
--accent-foreground: 210 40% 98%    /* Text on accent */

/* Status Colors */
--success: 142.1 76.2% 36.3%        /* Green for success */
--warning: 47.9 95.8% 53.1%         /* Yellow for warnings */
--destructive: 0 84.2% 60.2%        /* Red for errors */
```

### Typography Scale

```css
/* Font Sizes */
--text-xs: 0.75rem      /* 12px */
--text-sm: 0.875rem     /* 14px */
--text-base: 1rem       /* 16px */
--text-lg: 1.125rem     /* 18px */
--text-xl: 1.25rem      /* 20px */
--text-2xl: 1.5rem      /* 24px */
--text-3xl: 1.875rem    /* 30px */
--text-4xl: 2.25rem     /* 36px */

/* Font Weights */
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Spacing System

```css
/* Spacing Scale (Tailwind-based) */
--space-1: 0.25rem      /* 4px */
--space-2: 0.5rem       /* 8px */
--space-3: 0.75rem      /* 12px */
--space-4: 1rem         /* 16px */
--space-6: 1.5rem       /* 24px */
--space-8: 2rem         /* 32px */
--space-12: 3rem        /* 48px */
--space-16: 4rem        /* 64px */
```

### Component Design Principles

#### Cards
- **Subtle borders** with `border-border` color
- **Rounded corners** with `rounded-lg` (8px)
- **Hover effects** with scale and shadow transitions
- **Dark backgrounds** with `bg-card` color

#### Buttons
- **Primary buttons** with gradient backgrounds
- **Scale animations** on hover (scale-105)
- **Focus states** with ring effects
- **Loading states** with spinner animations

#### Forms
- **Dark input backgrounds** with subtle borders
- **Focus states** with blue ring effects
- **Error states** with red borders and text
- **Validation feedback** with real-time updates

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
- **API Backend**: http://localhost:5000

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

### Next.js Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
```

### Tailwind Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // ... other color definitions
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

---

## 🎯 Features

### Authentication System

#### Login & Registration
- **Secure Forms**: React Hook Form with Zod validation
- **Real-time Validation**: Instant feedback on form inputs
- **Role Selection**: Choose between Buyer and Seller roles
- **Password Security**: Strong password requirements
- **Remember Me**: Persistent authentication with localStorage

```typescript
// Authentication Store (Zustand)
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        localStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (user) => set({ user }),
    }),
    { name: 'auth-storage' }
  )
);
```

### Project Management

#### Project Creation (Buyers)
- **Rich Text Editor**: Detailed project descriptions
- **Budget Range Selection**: Flexible budget options
- **Deadline Picker**: Calendar-based date selection
- **Image Upload**: Project visualization with Cloudinary
- **Draft Saving**: Auto-save functionality

#### Project Discovery (Sellers)
- **Advanced Filtering**: Filter by budget, deadline, category
- **Search Functionality**: Full-text search across projects
- **Sorting Options**: Sort by date, budget, deadline
- **Pagination**: Efficient loading of large project lists
- **Bookmark System**: Save interesting projects

### Bidding System

#### Bid Placement (Sellers)
```typescript
// Bid Form Component
const BidForm = ({ projectId }: { projectId: string }) => {
  const form = useForm<BidFormData>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      bidAmount: 0,
      estimatedCompletionTime: '',
      message: '',
    },
  });

  const onSubmit = async (data: BidFormData) => {
    try {
      await bidsAPI.place({ ...data, projectId });
      toast.success('Bid placed successfully!');
    } catch (error) {
      toast.error('Failed to place bid');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="bidAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bid Amount ($)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter your bid" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Other form fields */}
        <Button type="submit" className="w-full">
          Place Bid
        </Button>
      </form>
    </Form>
  );
};
```

#### Bid Management (Buyers)
- **Bid Comparison**: Side-by-side bid comparison
- **Seller Profiles**: View seller ratings and portfolios
- **Communication**: Direct messaging with bidders
- **Selection Process**: Easy seller selection workflow

### File Upload System

#### Cloudinary Integration
```typescript
// File Upload Hook
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File): Promise<string> => {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'buildboard_preset');

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setProgress(percentCompleted);
          },
        }
      );

      return response.data.secure_url;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { uploadFile, uploading, progress };
};
```

#### Drag & Drop Interface
- **Visual Feedback**: Drag overlay with visual cues
- **File Validation**: Type and size restrictions
- **Progress Indicators**: Real-time upload progress
- **Preview System**: Image previews before upload
- **Multiple Files**: Support for multiple file uploads

### Dashboard System

#### Buyer Dashboard
- **Project Overview**: Active, pending, and completed projects
- **Bid Management**: Review and manage incoming bids
- **Analytics**: Project performance metrics
- **Quick Actions**: Fast access to common tasks

#### Seller Dashboard
- **Project Discovery**: Recommended projects based on skills
- **Bid Tracking**: Monitor bid status and responses
- **Earnings Overview**: Revenue tracking and analytics
- **Portfolio Management**: Showcase completed work

---

## 📱 Responsive Design

### Mobile-First Approach

The application is built with a mobile-first approach, ensuring optimal experience across all devices:

#### Breakpoint System
```css
/* Tailwind CSS Breakpoints */
sm: 640px   /* Small devices (landscape phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (desktops) */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X Extra large devices */
```

#### Responsive Components
```typescript
// Responsive Grid Example
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {projects.map((project) => (
    <ProjectCard key={project.id} project={project} />
  ))}
</div>

// Responsive Navigation
<nav className="hidden md:flex md:space-x-8">
  <NavLink href="/dashboard">Dashboard</NavLink>
  <NavLink href="/projects">Projects</NavLink>
</nav>
<MobileMenu className="md:hidden" />
```

### Touch-Friendly Interface

#### Touch Targets
- **Minimum Size**: 44px × 44px touch targets
- **Adequate Spacing**: Sufficient space between interactive elements
- **Gesture Support**: Swipe gestures for mobile navigation
- **Haptic Feedback**: Visual feedback for touch interactions

#### Mobile Optimizations
- **Thumb-Friendly**: Important actions within thumb reach
- **Simplified Navigation**: Streamlined mobile navigation
- **Optimized Forms**: Mobile-friendly form inputs
- **Fast Loading**: Optimized images and lazy loading

---

## ♿ Accessibility

### WCAG 2.1 Compliance

The application follows Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards:

#### Keyboard Navigation
```typescript
// Keyboard Navigation Hook
export const useKeyboardNavigation = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          // Close modals/dropdowns
          break;
        case 'Tab':
          // Focus management
          break;
        case 'Enter':
        case ' ':
          // Activate buttons/links
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};
```

#### ARIA Labels and Roles
```typescript
// Accessible Button Component
const Button = ({ children, ...props }) => (
  <button
    role="button"
    aria-label={props['aria-label']}
    aria-describedby={props['aria-describedby']}
    className="focus:ring-2 focus:ring-primary focus:outline-none"
    {...props}
  >
    {children}
  </button>
);

// Accessible Form Field
const FormField = ({ label, error, children }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium" htmlFor={fieldId}>
      {label}
    </label>
    {children}
    {error && (
      <p role="alert" aria-live="polite" className="text-sm text-destructive">
        {error}
      </p>
    )}
  </div>
);
```

#### Color Contrast
- **High Contrast**: Minimum 4.5:1 ratio for normal text
- **Enhanced Contrast**: 7:1 ratio for important elements
- **Color Independence**: Information not conveyed by color alone
- **Focus Indicators**: Clear focus states for all interactive elements

#### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Alt Text**: Descriptive alt text for all images
- **Live Regions**: Dynamic content announcements
- **Skip Links**: Navigation shortcuts for screen readers

---

## 🧪 Testing

### Testing Strategy

#### Unit Testing
```typescript
// Component Test Example
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct styles', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });
});
```

#### Integration Testing
```typescript
// API Integration Test
import { render, screen, waitFor } from '@testing-library/react';
import { ProjectList } from '@/components/ProjectList';
import { projectsAPI } from '@/lib/api';

jest.mock('@/lib/api');
const mockedProjectsAPI = projectsAPI as jest.Mocked<typeof projectsAPI>;

describe('ProjectList Integration', () => {
  it('fetches and displays projects', async () => {
    const mockProjects = [
      { id: '1', title: 'Test Project', description: 'Test Description' }
    ];
    
    mockedProjectsAPI.getAll.mockResolvedValue({ data: mockProjects });
    
    render(<ProjectList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
  });
});
```

#### E2E Testing
```typescript
// Playwright E2E Test
import { test, expect } from '@playwright/test';

test('user can create a project', async ({ page }) => {
  // Login
  await page.goto('/auth/login');
  await page.fill('[data-testid=email]', 'buyer@example.com');
  await page.fill('[data-testid=password]', 'password123');
  await page.click('[data-testid=login-button]');

  // Navigate to create project
  await page.goto('/projects/create');
  
  // Fill project form
  await page.fill('[data-testid=project-title]', 'Test Project');
  await page.fill('[data-testid=project-description]', 'Test Description');
  await page.selectOption('[data-testid=budget-range]', '$1000-$5000');
  
  // Submit form
  await page.click('[data-testid=create-project-button]');
  
  // Verify success
  await expect(page.locator('[data-testid=success-message]')).toBeVisible();
});
```

### Running Tests

```bash
# Unit and Integration Tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E Tests
npm run test:e2e

# E2E Tests in headed mode
npm run test:e2e:headed
```

---

## 🚀 Deployment

### Production Build

#### Build Configuration
```bash
# Install dependencies
npm ci

# Build application
npm run build

# Start production server
npm start
```

#### Build Optimization
- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Remove unused code
- **Image Optimization**: Next.js automatic image optimization
- **Bundle Analysis**: Analyze bundle size with `@next/bundle-analyzer`

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Vercel Configuration:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

#### Netlify
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Environment Variables for Production

```env
# Production Environment Variables
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-production-cloud"
NEXT_PUBLIC_CLOUDINARY_API_KEY="your-production-key"
CLOUDINARY_API_SECRET="your-production-secret"

# Analytics (Optional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_HOTJAR_ID="your-hotjar-id"

# Monitoring (Optional)
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
```

### Performance Optimization

#### Core Web Vitals
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

#### Optimization Techniques
```typescript
// Image Optimization
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Hero Image"
  width={800}
  height={600}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Dynamic Imports
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false,
});

// Font Optimization
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Build process tested
- [ ] Performance optimized (Core Web Vitals)
- [ ] SEO meta tags implemented
- [ ] Error boundaries added
- [ ] Analytics tracking setup
- [ ] Security headers configured
- [ ] HTTPS/SSL certificate installed
- [ ] CDN configured for static assets
- [ ] Monitoring and logging setup

---

<div align="center">
  <h3>🎨 Built with Modern Frontend Technologies</h3>
  <p>
    <strong>BuildBoard Frontend</strong> - Beautiful, Fast, and Accessible
  </p>
  <p>
    <a href="#overview">Overview</a> •
    <a href="#-design-system">Design</a> •
    <a href="#-getting-started">Setup</a> •
    <a href="#-features">Features</a> •
    <a href="#-deployment">Deploy</a>
  </p>
</div>
```
