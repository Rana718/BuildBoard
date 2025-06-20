'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '@/lib/api';
import { Eye, EyeOff, User, Mail, Lock, UserCheck } from 'lucide-react';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  role: z.enum(['BUYER', 'SELLER'], {
    required_error: 'Please select your role',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await authAPI.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      toast({
        title: 'Account created successfully!',
        description: 'Please check your email to verify your account.',
      });

      router.push('/auth/login');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'An error occurred during registration',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              BuildBoard
            </h1>
          </Link>
          <h2 className="text-2xl font-semibold text-foreground">Create Account</h2>
          <p className="text-muted-foreground">
            Join our community of buyers and sellers
          </p>
        </div>

        {/* Registration Form */}
        <Card className="bg-card/80 backdrop-blur-sm border-2 border-border/50 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl text-card-foreground flex items-center justify-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserCheck className="w-5 h-5 text-primary" />
              </div>
              Sign Up
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill in your details to get started
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Full Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  {...register('name')}
                  className={`h-11 bg-background/80 border-2 border-input text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 ${errors.name ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''
                    }`}
                />
                {errors.name && (
                  <p className="text-destructive text-sm font-medium">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  {...register('email')}
                  className={`h-11 bg-background/80 border-2 border-input text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 ${errors.email ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''
                    }`}
                />
                {errors.email && (
                  <p className="text-destructive text-sm font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-card-foreground">
                  I want to *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedRole === 'BUYER'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                    }`}>
                    <input
                      type="radio"
                      value="BUYER"
                      {...register('role')}
                      className="sr-only"
                    />
                    <div className="text-2xl mb-2">🛒</div>
                    <span className="font-medium">Buy Services</span>
                    <span className="text-xs text-muted-foreground mt-1 text-center">
                      Post projects and hire talent
                    </span>
                  </label>

                  <label className={`relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedRole === 'SELLER'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                    }`}>
                    <input
                      type="radio"
                      value="SELLER"
                      {...register('role')}
                      className="sr-only"
                    />
                    <div className="text-2xl mb-2">💼</div>
                    <span className="font-medium">Sell Services</span>
                    <span className="text-xs text-muted-foreground mt-1 text-center">
                      Offer your skills and get hired
                    </span>
                  </label>
                </div>
                {errors.role && (
                  <p className="text-destructive text-sm font-medium">{errors.role.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Password *
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    {...register('password')}
                    className={`h-11 bg-background/80 border-2 border-input text-foreground placeholder:text-muted-foreground pr-10 transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 ${errors.password ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-sm font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Confirm Password *
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    {...register('confirmPassword')}
                    className={`h-11 bg-background/80 border-2 border-input text-foreground placeholder:text-muted-foreground pr-10 transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 ${errors.confirmPassword ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-sm font-medium">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Terms */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}