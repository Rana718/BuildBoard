'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { profileAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, StarIcon, User, Calendar, Award, TrendingUp } from 'lucide-react';
import { ProfileChart } from '@/components/profile/ProfileChart';
import { ReviewCard } from '@/components/profile/ReviewCard';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';

interface ProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'BUYER' | 'SELLER';
    profileImageUrl?: string;
    bio?: string;
    skills: string[];
    averageRating: number;
    totalReviews: number;
    createdAt: string;
    _count: {
      projectsAsBuyer: number;
      projectsAsSeller: number;
      reviewsReceived: number;
    };
  };
  projectStats: any;
  reviews: any[];
  ratingStats: Record<string, number>;
}

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const userId = params.userId as string;
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.getProfile(userId);
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const renderRatingDistribution = () => {
    if (!profileData) return null;

    const { ratingStats, user } = profileData;
    const totalReviews = user.totalReviews;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingStats[rating.toString()] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <div key={rating} className="flex items-center space-x-2">
              <span className="text-sm w-3">{rating}</span>
              <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Progress value={percentage} className="flex-1 h-2" />
              <span className="text-sm text-gray-600 w-8">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>Profile not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user, projectStats, reviews } = profileData;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.profileImageUrl} />
              <AvatarFallback className="text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <Badge variant={user.role === 'BUYER' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
                {isOwnProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditDialogOpen(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
              
              {user.bio && (
                <p className="text-gray-600">{user.bio}</p>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                {user.role === 'SELLER' && (
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>{user.totalReviews} reviews</span>
                  </div>
                )}
              </div>

              {user.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {user.role === 'SELLER' && user.totalReviews > 0 && (
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">
                  {user.averageRating.toFixed(1)}
                </div>
                {renderStarRating(user.averageRating)}
                <div className="text-sm text-gray-500">
                  {user.totalReviews} reviews
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          {user.role === 'SELLER' && (
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          )}
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projectStats.total || 0}</div>
              </CardContent>
            </Card>

            {user.role === 'BUYER' ? (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {projectStats.pending || 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {projectStats.inProgress || 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {projectStats.completed || 0}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Assigned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {projectStats.assigned || 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {projectStats.completed || 0}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {user.averageRating.toFixed(1)}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {user.role === 'SELLER' && user.totalReviews > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderRatingDistribution()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Project Statistics</CardTitle>
              <CardDescription>
                {user.role === 'BUYER' 
                  ? 'Projects you have posted' 
                  : 'Projects you have worked on'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(projectStats).map(([key, value]) => (
                  <div key={key} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{value as number}</div>
                    <div className="text-sm text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {user.role === 'SELLER' && (
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>All Reviews ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} detailed />
                ))}
                {reviews.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No reviews yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Performance Analytics</span>
              </CardTitle>
              <CardDescription>
                Real-time statistics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileChart userId={userId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={user}
        onUpdate={fetchProfile}
      />
    </div>
  );
}
