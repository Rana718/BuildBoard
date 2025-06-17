'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/FileUpload';
import { useToast } from '@/hooks/use-toast';
import { projectsAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth';

const createProjectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  budgetRange: z.string().min(1, 'Budget range is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  imageUrl: z.string().optional(),
});

type CreateProjectForm = z.infer<typeof createProjectSchema>;

export default function CreateProjectPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [projectImage, setProjectImage] = useState<string>('');
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
  });

  // Redirect if not a buyer
  if (user?.role !== 'BUYER') {
    router.push('/dashboard');
    return null;
  }

  const onSubmit = async (data: CreateProjectForm) => {
    setLoading(true);
    try {
      const submitData = {
        ...data,
        deadline: new Date(data.deadline).toISOString(),
        imageUrl: projectImage || undefined,
      };
      
      const response = await projectsAPI.create(submitData);
      
      toast({
        title: 'Project created successfully',
        description: 'Your project has been posted and is now accepting bids.',
      });
      
      router.push(`/projects/${response.data.project.id}`);
    } catch (error: any) {
      toast({
        title: 'Failed to create project',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setProjectImage(url);
    setValue('imageUrl', url);
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600 mt-2">
            Post your project details and start receiving bids from talented sellers.
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Provide clear and detailed information to attract the best sellers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title *
                </label>
                <Input
                  id="title"
                  placeholder="e.g., Build a responsive e-commerce website"
                  {...register('title')}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Description *
                </label>
                <Textarea
                  id="description"
                  rows={6}
                  placeholder="Describe your project requirements, goals, and any specific technologies or skills needed..."
                  {...register('description')}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="budgetRange" className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Range *
                </label>
                <select
                  id="budgetRange"
                  {...register('budgetRange')}
                  className={`w-full px-3 py-2 border rounded-md ${errors.budgetRange ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select budget range</option>
                  <option value="$100 - $500">$100 - $500</option>
                  <option value="$500 - $1,000">$500 - $1,000</option>
                  <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                  <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000+">$10,000+</option>
                </select>
                {errors.budgetRange && (
                  <p className="text-red-500 text-sm mt-1">{errors.budgetRange.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Deadline *
                </label>
                <Input
                  id="deadline"
                  type="date"
                  min={today}
                  {...register('deadline')}
                  className={errors.deadline ? 'border-red-500' : ''}
                />
                {errors.deadline && (
                  <p className="text-red-500 text-sm mt-1">{errors.deadline.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Image (Optional)
                </label>
                <FileUpload
                  onUpload={handleImageUpload}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add an image to help sellers better understand your project
                </p>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Creating Project...' : 'Create Project'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
