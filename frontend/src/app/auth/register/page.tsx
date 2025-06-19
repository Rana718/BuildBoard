'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { FileUpload } from '@/components/FileUpload';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['BUYER', 'SELLER'], { required_error: 'Please select a role' }),
  profileImageUrl: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const submitData = {
        ...data,
        profileImageUrl: profileImage || undefined,
      };

      const response = await authAPI.register(submitData);
      const { user, token } = response.data;

      login(user, token);
      toast({
        title: 'Registration successful',
        description: `Welcome to the platform, ${user.name}!`,
      });

      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'An error occurred',
        variant:'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setProfileImage(url);
    setValue('profileImageUrl', url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">BuildBoard</h1>
          <p className="text-muted-foreground">Project Management Platform</p>
        </div>

        <Card className="border-border bg-card shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-card-foreground">Create Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Join our platform as a buyer or seller
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Profile Picture (Optional)
                </label>
                <FileUpload
                  onUpload={handleImageUpload}
                  accept="image/*"
                  maxSize={2 * 1024 * 1024} // 2MB
                  className="mb-4"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-card-foreground">
                  Full Name
                </label>
                <Input
                  id="name"
                  {...register('name')}
                  className={`bg-background border-input text-foreground placeholder:text-muted-foreground ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''
                    }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-destructive text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-card-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`bg-background border-input text-foreground placeholder:text-muted-foreground ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''
                    }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-medium text-card-foreground">
                  I want to
                </label>
                <select
                  id="role"
                  {...register('role')}
                  className={`w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${errors.role ? 'border-destructive focus:ring-destructive' : ''
                    }`}
                >
                  <option value="" className="text-muted-foreground">Select your role</option>
                  <option value="BUYER" className="text-foreground">Post projects and hire sellers</option>
                  <option value="SELLER" className="text-foreground">Find projects and submit bids</option>
                </select>
                {errors.role && (
                  <p className="text-destructive text-sm">{errors.role.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-card-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  className={`bg-background border-input text-foreground placeholder:text-muted-foreground ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''
                    }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-card-foreground">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className={`bg-background border-input text-foreground placeholder:text-muted-foreground ${errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''
                    }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}