'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FileUpload } from '@/components/FileUpload';
import { useToast } from '@/hooks/use-toast';
import { projectsAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { CalendarIcon, DollarSign, FileText, Image, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const createProjectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  budgetRange: z.string().min(1, 'Budget range is required'),
  deadline: z.date({
    required_error: 'Please select a deadline date',
  }),
  imageUrl: z.string().optional(),
});

type CreateProjectForm = z.infer<typeof createProjectSchema>;

export default function CreateProjectPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [projectImage, setProjectImage] = useState<string>('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    control,
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
        deadline: data.deadline.toISOString(),
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-start">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Back Navigation */}
        <div className="flex">
          <Link href="/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </div>

        {/* Header - Centered */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Create New Project</h1>
          <p className="text-muted-foreground text-lg">
            Post your project details and start receiving bids from talented sellers.
          </p>
        </div>

        {/* Form Container - Centered */}
        <div className="flex flex-col items-center space-y-6">
          {/* Form Card */}
          <Card className="w-full max-w-2xl bg-card border-border shadow-lg">
            <CardHeader className="pb-6 text-center">
              <CardTitle className="text-2xl text-card-foreground flex items-center justify-center">
                <FileText className="w-6 h-6 mr-3 text-primary" />
                Project Details
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Provide clear and detailed information to attract the best sellers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-6 sm:px-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Project Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-card-foreground">
                    Project Title *
                  </label>
                  <Input
                    id="title"
                    placeholder="e.g., Build a responsive e-commerce website"
                    {...register('title')}
                    className={`bg-background border-input text-foreground placeholder:text-muted-foreground ${
                      errors.title ? 'border-destructive focus-visible:ring-destructive' : ''
                    }`}
                  />
                  {errors.title && (
                    <p className="text-destructive text-sm">{errors.title.message}</p>
                  )}
                </div>

                {/* Project Description */}
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-card-foreground">
                    Project Description *
                  </label>
                  <Textarea
                    id="description"
                    rows={6}
                    placeholder="Describe your project requirements, goals, and any specific technologies or skills needed..."
                    {...register('description')}
                    className={`bg-background border-input text-foreground placeholder:text-muted-foreground resize-none ${
                      errors.description ? 'border-destructive focus-visible:ring-destructive' : ''
                    }`}
                  />
                  {errors.description && (
                    <p className="text-destructive text-sm">{errors.description.message}</p>
                  )}
                </div>

                {/* Budget Range */}
                <div className="space-y-2">
                  <label htmlFor="budgetRange" className=" text-sm font-medium text-card-foreground flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-green-400" />
                    Budget Range *
                  </label>
                  <select
                    id="budgetRange"
                    {...register('budgetRange')}
                    className={`w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                      errors.budgetRange ? 'border-destructive focus:ring-destructive' : ''
                    }`}
                  >
                    <option value="" className="text-muted-foreground">Select budget range</option>
                    <option value="$100 - $500" className="text-foreground">$100 - $500</option>
                    <option value="$500 - $1,000" className="text-foreground">$500 - $1,000</option>
                    <option value="$1,000 - $2,500" className="text-foreground">$1,000 - $2,500</option>
                    <option value="$2,500 - $5,000" className="text-foreground">$2,500 - $5,000</option>
                    <option value="$5,000 - $10,000" className="text-foreground">$5,000 - $10,000</option>
                    <option value="$10,000+" className="text-foreground">$10,000+</option>
                  </select>
                  {errors.budgetRange && (
                    <p className="text-destructive text-sm">{errors.budgetRange.message}</p>
                  )}
                </div>

                {/* Project Deadline with Calendar */}
                <div className="space-y-2">
                  <label className=" text-sm font-medium text-card-foreground flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1 text-blue-400" />
                    Project Deadline *
                  </label>
                  <Controller
                    name="deadline"
                    control={control}
                    render={({ field }) => (
                      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-background border-input text-foreground hover:bg-accent hover:text-accent-foreground",
                              !field.value && "text-muted-foreground",
                              errors.deadline && "border-destructive focus-visible:ring-destructive"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a deadline date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setCalendarOpen(false);
                            }}
                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                            initialFocus
                            className="bg-background text-foreground"
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.deadline && (
                    <p className="text-destructive text-sm">{errors.deadline.message}</p>
                  )}
                </div>

                {/* Project Image */}
                <div className="space-y-2">
                  <label className=" text-sm font-medium text-card-foreground flex items-center">
                    <Image className="w-4 h-4 mr-1 text-purple-400" />
                    Project Image (Optional)
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 bg-background/50">
                    <FileUpload
                      onUpload={handleImageUpload}
                      accept="image/*"
                      maxSize={5 * 1024 * 1024} // 5MB
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add an image to help sellers better understand your project (Max 5MB)
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 hover:scale-105 py-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Project...
                      </>
                    ) : (
                      'Create Project'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 hover:bg-accent hover:text-accent-foreground transition-colors py-3"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="w-full max-w-2xl bg-card/50 border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-card-foreground text-center">💡 Tips for a Great Project Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground px-6 sm:px-8">
              <p>• Write a clear, descriptive title that summarizes your project</p>
              <p>• Include specific requirements, technologies, and deliverables</p>
              <p>• Set a realistic budget and timeline</p>
              <p>• Add relevant images or mockups to illustrate your vision</p>
              <p>• Be responsive to questions from potential sellers</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}