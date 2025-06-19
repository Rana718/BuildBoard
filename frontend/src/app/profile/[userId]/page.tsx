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
import { 
  Star, 
  StarIcon, 
  Calendar, 
  Award, 
  Edit,
  FolderOpen,
  Clock,
  CheckCircle,
  Users
} from 'lucide-react';
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
                : 'text-muted-foreground'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
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
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingStats[rating.toString()] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <div key={rating} className="flex items-center space-x-3">
              <span className="text-sm w-3 text-muted-foreground">{rating}</span>
              <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Progress value={percentage} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground w-8">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-fade-in space-y-6">
          <div className="loading-shimmer h-32 rounded-lg"></div>
          <div className="loading-shimmer h-64 rounded-lg"></div>
          <div className="loading-shimmer h-48 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="gradient-bg border-border/50">
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Profile not found</h3>
            <p className="text-muted-foreground">The user profile you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user, projectStats, reviews } = profileData;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card className="gradient-bg border-border/50">
        <CardContent className="pt-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <Avatar className="w-32 h-32 border-4 border-primary/20">
              <AvatarImage src={user.profileImageUrl} />
              <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  {user.name}
                </h1>
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={user.role === 'BUYER' ? 'default' : 'secondary'}
                    className="text-sm px-3 py-1"
                  >
                    {user.role}
                  </Badge>
                  {isOwnProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditDialogOpen(true)}
                      className="btn-hover"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
              
              {user.bio && (
                <p className="text-muted-foreground text-lg leading-relaxed">{user.bio}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}</span>
                </div>
                {user.role === 'SELLER' && (
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span>{user.totalReviews} reviews</span>
                  </div>
                )}
              </div>

              {user.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {user.role === 'SELLER' && user.totalReviews > 0 && (
              <div className="text-center bg-accent/30 p-6 rounded-xl border border-border/50">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {user.averageRating.toFixed(1)}
                </div>
                {renderStarRating(user.averageRating)}
                <div className="text-sm text-muted-foreground mt-2">
                  Based on {user.totalReviews} reviews
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          {user.role === 'SELLER' && (
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="gradient-bg border-border/50 card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
                  <FolderOpen className="w-4 h-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{projectStats.total || 0}</div>
              </CardContent>
            </Card>

            {user.role === 'BUYER' ? (
              <>
                <Card className="gradient-bg border-border/50 card-hover">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                      <Clock className="w-4 h-4 text-yellow-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-400">
                      {projectStats.pending || 0}
                    </div>
                  </CardContent>
                </Card>
                <Card className="gradient-bg border-border/50 card-hover">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
                      <Users className="w-4 h-4 text-blue-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-400">
                      {projectStats.inProgress || 0}
                    </div>
                  </CardContent>
                </Card>
                <Card className="gradient-bg border-border/50 card-hover">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400">
                      {projectStats.completed || 0}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="gradient-bg border-border/50 card-hover">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Assigned</CardTitle>
                      <Users className="w-4 h-4 text-blue-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-400">
                      {projectStats.assigned || 0}
                    </div>
                  </CardContent>
                </Card>
                <Card className="gradient-bg border-border/50 card-hover">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400">
                      {projectStats.completed || 0}
                    </div>
                  </CardContent>
                </Card>
                <Card className="gradient-bg border-border/50 card-hover">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
                      <Star className="w-4 h-4 text-yellow-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-400">
                      {user.averageRating.toFixed(1)}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {user.role === 'SELLER' && user.totalReviews > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="gradient-bg border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span>Rating Distribution</span>
                  </CardTitle>
                  <CardDescription>
                    How clients rate your work
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderRatingDistribution()}
                </CardContent>
              </Card>

              <Card className="gradient-bg border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-primary" />
                    <span>Recent Reviews</span>
                  </CardTitle>
                  <CardDescription>
                    Latest feedback from clients
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                  {reviews.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No reviews yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects">
          <Card className="gradient-bg border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FolderOpen className="w-5 h-5 text-primary" />
                <span>Project Statistics</span>
              </CardTitle>
              <CardDescription>
                {user.role === 'BUYER' 
                  ? 'Overview of projects you have posted' 
                  : 'Overview of projects you have worked on'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(projectStats).map(([key, value]) => (
                  <div key={key} className="text-center p-6 border border-border/50 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
                    <div className="text-3xl font-bold text-primary">{value as number}</div>
                    <div className="text-sm text-muted-foreground capitalize mt-2">
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
            <Card className="gradient-bg border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span>All Reviews ({reviews.length})</span>
                </CardTitle>
                <CardDescription>
                  Complete feedback history from your clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} detailed />
                ))}
                {reviews.length === 0 && (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                    <p className="text-muted-foreground">
                      Complete your first project to start receiving reviews
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
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
