'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileUpload } from '@/components/FileUpload';
import { projectsAPI, bidsAPI, reviewsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar, DollarSign, Users, Star, Upload, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const bidSchema = z.object({
  bidAmount: z.number().positive('Bid amount must be positive'),
  estimatedCompletionTime: z.string().min(1, 'Estimated completion time is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters').optional(),
});

type BidForm = z.infer<typeof bidSchema>;
type ReviewForm = z.infer<typeof reviewSchema>;

interface Project {
  id: string;
  title: string;
  description: string;
  budgetRange: string;
  deadline: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  imageUrl?: string;
  createdAt: string;
  buyer: {
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
  };
  seller?: {
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
  };
  bids: Array<{
    id: string;
    bidAmount: number;
    estimatedCompletionTime: string;
    message: string;
    createdAt: string;
    seller: {
      id: string;
      name: string;
      email: string;
      profileImageUrl?: string;
    };
  }>;
  deliverables: Array<{
    id: string;
    fileUrl: string;
    uploadedAt: string;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    buyer: {
      id: string;
      name: string;
      profileImageUrl?: string;
    };
  }>;
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const bidForm = useForm<BidForm>({
    resolver: zodResolver(bidSchema),
  });

  const reviewForm = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
  });

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await projectsAPI.getById(id as string);
      setProject(response.data.project);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch project details',
        variant: 'error',
      });
      router.push('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (data: BidForm) => {
    setBidding(true);
    try {
      await bidsAPI.place({
        projectId: id as string,
        ...data,
      });
      
      toast({
        title: 'Bid placed successfully',
        description: 'Your bid has been submitted to the buyer.',
      });
      
      setShowBidForm(false);
      bidForm.reset();
      fetchProject(); // Refresh to show new bid
    } catch (error: any) {
      toast({
        title: 'Failed to place bid',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error',
      });
    } finally {
      setBidding(false);
    }
  };

  const handleSelectSeller = async (sellerId: string) => {
    try {
      await projectsAPI.selectSeller(id as string, sellerId);
      toast({
        title: 'Seller selected',
        description: 'The seller has been notified and the project is now in progress.',
      });
      fetchProject();
    } catch (error: any) {
      toast({
        title: 'Failed to select seller',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error',
      });
    }
  };

  const handleCompleteProject = async () => {
    try {
      await projectsAPI.complete(id as string);
      toast({
        title: 'Project completed',
        description: 'The project has been marked as completed and the buyer has been notified.',
      });
      fetchProject();
    } catch (error: any) {
      toast({
        title: 'Failed to complete project',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error',
      });
    }
  };

  const handleUploadDeliverable = async () => {
    if (!deliverableUrl) {
      toast({
        title: 'No file selected',
        description: 'Please upload a file first.',
        variant: 'error',
      });
      return;
    }

    try {
      await projectsAPI.uploadDeliverable(id as string, deliverableUrl);
      toast({
        title: 'Deliverable uploaded',
        description: 'Your deliverable has been uploaded successfully.',
      });
      setDeliverableUrl('');
      fetchProject();
    } catch (error: any) {
      toast({
        title: 'Failed to upload deliverable',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error',
      });
    }
  };

  const handleSubmitReview = async (data: ReviewForm) => {
    try {
      await reviewsAPI.create(id as string, data);
      toast({
        title: 'Review submitted',
        description: 'Thank you for your feedback!',
      });
      setShowReviewForm(false);
      reviewForm.reset();
      fetchProject();
    } catch (error: any) {
      toast({
        title: 'Failed to submit review',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canPlaceBid = user?.role === 'SELLER' && 
    project?.status === 'PENDING' && 
    project?.buyer.id !== user?.id &&
    !project?.bids.some(bid => bid.seller.id === user?.id);

  const canSelectSeller = user?.role === 'BUYER' && 
    project?.buyer.id === user?.id && 
    project?.status === 'PENDING';

  const canCompleteProject = user?.role === 'SELLER' && 
    project?.seller?.id === user?.id && 
    project?.status === 'IN_PROGRESS';

  const canUploadDeliverable = user?.role === 'SELLER' && 
    project?.seller?.id === user?.id && 
    project?.status === 'IN_PROGRESS';

  const canReview = user?.role === 'BUYER' && 
    project?.buyer.id === user?.id && 
    project?.status === 'COMPLETED' &&
    project?.reviews.length === 0;
  const canMakePayment = user?.role === 'BUYER' && 
    project?.buyer.id === user?.id && 
    project?.status === 'COMPLETED';
  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading project details...</p>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Project not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {format(new Date(project.deadline), 'MMM dd, yyyy')}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {project.budgetRange}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {project.bids.length} bids
                      </span>
                    </div>
                  </div>
                </div>
                {project.imageUrl && (
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Bids Section */}
            <Card>
              <CardHeader>
                <CardTitle>Bids ({project.bids.length})</CardTitle>
                {canPlaceBid && (
                  <Button onClick={() => setShowBidForm(true)}>
                    Place Bid
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {showBidForm && (
                  <form onSubmit={bidForm.handleSubmit(handlePlaceBid)} className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold mb-4">Submit Your Bid</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bid Amount ($)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          {...bidForm.register('bidAmount', { valueAsNumber: true })}
                          className={bidForm.formState.errors.bidAmount ? 'border-red-500' : ''}
                        />
                        {bidForm.formState.errors.bidAmount && (
                          <p className="text-red-500 text-sm mt-1">{bidForm.formState.errors.bidAmount.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estimated Completion Time
                        </label>
                        <Input
                          placeholder="e.g., 2 weeks, 1 month"
                          {...bidForm.register('estimatedCompletionTime')}
                          className={bidForm.formState.errors.estimatedCompletionTime ? 'border-red-500' : ''}
                        />
                        {bidForm.formState.errors.estimatedCompletionTime && (
                          <p className="text-red-500 text-sm mt-1">{bidForm.formState.errors.estimatedCompletionTime.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Proposal Message
                        </label>
                        <Textarea
                          rows={4}
                          placeholder="Explain your approach, experience, and why you're the right fit for this project..."
                          {...bidForm.register('message')}
                          className={bidForm.formState.errors.message ? 'border-red-500' : ''}
                        />
                        {bidForm.formState.errors.message && (
                          <p className="text-red-500 text-sm mt-1">{bidForm.formState.errors.message.message}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button type="submit" disabled={bidding}>
                          {bidding ? 'Submitting...' : 'Submit Bid'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowBidForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </form>
                )}

                {project.bids.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No bids yet</p>
                ) : (
                  <div className="space-y-4">
                    {project.bids.map((bid) => (
                      <div key={bid.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={bid.seller.profileImageUrl} />
                              <AvatarFallback>
                                {bid.seller.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{bid.seller.name}</h4>
                              <p className="text-sm text-gray-600">
                                {format(new Date(bid.createdAt), 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              ${bid.bidAmount.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              {bid.estimatedCompletionTime}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{bid.message}</p>
                        {canSelectSeller && (
                          <Button
                            size="sm"
                            onClick={() => handleSelectSeller(bid.seller.id)}
                          >
                            Select This Seller
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deliverables Section */}
            {(project.status === 'IN_PROGRESS' || project.status === 'COMPLETED') && (
              <Card>
                <CardHeader>
                  <CardTitle>Deliverables</CardTitle>
                  {canUploadDeliverable && (
                    <div className="space-y-4">
                      <FileUpload
                        onUpload={setDeliverableUrl}
                        accept="*/*"
                        maxSize={50 * 1024 * 1024} // 50MB
                      />
                      {deliverableUrl && (
                        <Button onClick={handleUploadDeliverable}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Deliverable
                        </Button>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {project.deliverables.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No deliverables uploaded yet</p>
                  ) : (
                    <div className="space-y-3">
                      {project.deliverables.map((deliverable) => (
                        <div key={deliverable.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Deliverable</p>
                            <p className="text-sm text-gray-600">
                              Uploaded {format(new Date(deliverable.uploadedAt), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={deliverable.fileUrl} target="_blank" rel="noopener noreferrer">
                              Download
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            {project.status === 'COMPLETED' && (
              <Card>
                <CardHeader>
                  <CardTitle>Review</CardTitle>
                  {canReview && (
                    <Button onClick={() => setShowReviewForm(true)}>
                      Leave Review
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {showReviewForm && (
                    <form onSubmit={reviewForm.handleSubmit(handleSubmitReview)} className="mb-6 p-4 border rounded-lg bg-gray-50">
                      <h4 className="font-semibold mb-4">Rate Your Experience</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rating (1-5 stars)
                          </label>
                          <select
                            {...reviewForm.register('rating', { valueAsNumber: true })}
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="">Select rating</option>
                            <option value={1}>1 Star</option>
                            <option value={2}>2 Stars</option>
                            <option value={3}>3 Stars</option>
                            <option value={4}>4 Stars</option>
                            <option value={5}>5 Stars</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Comment (Optional)
                          </label>
                          <Textarea
                            rows={4}
                            placeholder="Share your experience working with this seller..."
                            {...reviewForm.register('comment')}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button type="submit">Submit Review</Button>
                          <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}

                  {project.reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No reviews yet</p>
                  ) : (
                    <div className="space-y-4">
                      {project.reviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <Avatar>
                              <AvatarImage src={review.buyer.profileImageUrl} />
                              <AvatarFallback>
                                {review.buyer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold">{review.buyer.name}</h4>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                  {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                                </span>
                              </div>
                              {review.comment && (
                                <p className="text-gray-700">{review.comment}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            {/* Payment Section */}
            {canMakePayment && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Payment</span>
                  </CardTitle>
                  <CardDescription>
                    Complete payment for this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Project Completed</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        The seller has completed the project. You can now proceed with payment.
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Suggested Amount:</span>
                      <span className="font-semibold">{project.budgetRange}</span>
                    </div>

                    <Button 
                      onClick={() => router.push(`/payments/${project.id}`)}
                      className="w-full"
                      size="lg"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Make Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Project Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Posted by</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={project.buyer.profileImageUrl} />
                      <AvatarFallback>
                        {project.buyer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-700">{project.buyer.name}</span>
                  </div>
                </div>
                
                {project.seller && (
                  <div>
                    <h4 className="font-semibold text-gray-900">Assigned to</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={project.seller.profileImageUrl} />
                        <AvatarFallback>
                          {project.seller.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-700">{project.seller.name}</span>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900">Posted</h4>
                  <p className="text-gray-700">{format(new Date(project.createdAt), 'MMM dd, yyyy')}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">Budget</h4>
                  <p className="text-gray-700">{project.budgetRange}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">Deadline</h4>
                  <p className="text-gray-700">{format(new Date(project.deadline), 'MMM dd, yyyy')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {canCompleteProject && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleCompleteProject} className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
