'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Calendar,
  Award,
  Edit,
  FolderOpen,
  Clock,
  CheckCircle,
  Users,
  LogOut,
  Settings,
  Mail
} from 'lucide-react';
import { ReviewCard } from '@/components/profile/ReviewCard';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import { format } from 'date-fns';

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
  const router = useRouter();
  const { user: currentUser, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 sm:w-4 sm:h-4 ${star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
              }`}
          />
        ))}
        <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const renderRatingDistribution = () => {
    if (!profileData) return null;

    const { ratingStats, user } = profileData;
    const totalReviews = user.totalReviews;

    if (totalReviews === 0) {
      return (
        <div className="text-center py-6 sm:py-8">
          <Star className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-2 sm:mb-3" />
          <p className="text-sm sm:text-base text-muted-foreground">No reviews yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-2 sm:space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingStats[rating] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={rating} className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-1 w-12 sm:w-16">
                <span className="text-xs sm:text-sm font-medium">{rating}</span>
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
              </div>
              <Progress value={percentage} className="flex-1 h-2" />
              <span className="text-xs sm:text-sm text-muted-foreground w-8 sm:w-10 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="space-y-4 sm:space-y-6">
          <div className="h-32 sm:h-48 bg-muted/20 rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-muted/20 rounded-lg animate-pulse"></div>
              <div className="h-96 bg-muted/20 rounded-lg animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-muted/20 rounded-lg animate-pulse"></div>
              <div className="h-32 bg-muted/20 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-12 sm:py-20">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Profile not found</h2>
        <p className="text-sm sm:text-base text-muted-foreground">The user profile you're looking for doesn't exist.</p>
      </div>
    );
  }

  const { user, projectStats, reviews } = profileData;

  return (
    <div className="animate-fade-in">
      {/* Profile Header */}
      <Card className="gradient-bg border-border/50 mb-4 sm:mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 border-4 border-primary/20 mx-auto sm:mx-0">
              <AvatarImage src={user.profileImageUrl} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg sm:text-xl lg:text-2xl">
                {user.name.split(' ').map((n: any) => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                    {user.name}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
                    <Badge className={`${user.role === 'BUYER'
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : 'bg-green-500/20 text-green-400 border-green-500/30'
                      } text-xs sm:text-sm w-fit mx-auto sm:mx-0`}>
                      {user.role}
                    </Badge>
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                      Joined {format(new Date(user.createdAt), 'MMM yyyy')}
                    </div>
                  </div>
                  {user.role === 'SELLER' && user.totalReviews > 0 && (
                    <div className="flex items-center justify-center sm:justify-start">
                      {renderStarRating(user.averageRating)}
                      <span className="ml-2 text-xs sm:text-sm text-muted-foreground">
                        ({user.totalReviews} reviews)
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {isOwnProfile && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditDialogOpen(true)}
                        className="w-full sm:w-auto text-xs sm:text-sm"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full sm:w-auto text-xs sm:text-sm text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                      >
                        <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        Logout
                      </Button>
                    </>
                  )}
                  {!isOwnProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                      Contact
                    </Button>
                  )}
                </div>
              </div>

              {user.bio && (
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 max-w-2xl">
                  {user.bio}
                </p>
              )}

              {user.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center sm:justify-start">
                  {user.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats and Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 mb-4 sm:mb-6">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs sm:text-sm">
                Reviews ({user.totalReviews})
              </TabsTrigger>
              <TabsTrigger value="activity" className="text-xs sm:text-sm hidden sm:block">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              {/* Project Stats */}
              <Card className="gradient-bg border-border/50">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg lg:text-xl">Project Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="text-center p-3 sm:p-4 bg-card/50 rounded-lg">
                      <FolderOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-1 sm:mb-2" />
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                        {user.role === 'BUYER' ? user._count.projectsAsBuyer : user._count.projectsAsSeller}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {user.role === 'BUYER' ? 'Projects Posted' : 'Projects Completed'}
                      </div>
                    </div>

                    {user.role === 'SELLER' && (
                      <>
                        <div className="text-center p-3 sm:p-4 bg-card/50 rounded-lg">
                          <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400 mx-auto mb-1 sm:mb-2" />
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                            {user.averageRating.toFixed(1)}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">Average Rating</div>
                        </div>

                        <div className="text-center p-3 sm:p-4 bg-card/50 rounded-lg">
                          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 mx-auto mb-1 sm:mb-2" />
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                            {user.totalReviews}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">Total Reviews</div>
                        </div>

                        <div className="text-center p-3 sm:p-4 bg-card/50 rounded-lg">
                          <Award className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto mb-1 sm:mb-2" />
                          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                            {user.totalReviews > 0 ? Math.round((user.averageRating / 5) * 100) : 0}%
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">Success Rate</div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4 sm:space-y-6">
              {reviews.length === 0 ? (
                <Card className="gradient-bg border-border/50">
                  <CardContent className="text-center py-8 sm:py-12">
                    <Star className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No reviews yet</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {isOwnProfile
                        ? "Complete some projects to start receiving reviews!"
                        : "This user hasn't received any reviews yet."
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity">
              <Card className="gradient-bg border-border/50">
                <CardContent className="text-center py-8 sm:py-12">
                  <Clock className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Activity Timeline</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Activity timeline feature coming soon!
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Rating Distribution (for sellers) */}
          {user.role === 'SELLER' && (
            <Card className="gradient-bg border-border/50">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {renderRatingDistribution()}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          {isOwnProfile && (
            <Card className="gradient-bg border-border/50">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <Button variant="outline" className="w-full justify-start text-xs sm:text-sm">
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Account Settings
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs sm:text-sm">
                  <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  View All Projects
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Profile Dialog */}
      {isOwnProfile && (
        <EditProfileDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          user={user}
          onUpdate={fetchProfile}
        />
      )}
    </div>
  );
}
