'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { projectsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  FolderOpen,
  Clock,
  Users,
  CheckCircle,
  Plus,
  TrendingUp,
  Calendar,
  DollarSign,
  Eye
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  budgetRange: string;
  deadline: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
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
  _count: {
    bids: number;
    deliverables?: number;
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    if (!user || hasInitialized) return;

    setLoading(true);
    try {
      let response;
      if (user.role === 'SELLER') {
        // For sellers, get all their projects (assigned + completed)
        const [assignedResponse, completedResponse] = await Promise.all([
          projectsAPI.getAssignedProjects(),
          projectsAPI.getCompletedProjects()
        ]);
        const allProjects = [...assignedResponse.data, ...completedResponse.data];
        response = { data: { projects: allProjects } };
      } else {
        // For buyers, get their created projects
        response = await projectsAPI.getCreatedProjects();
      }

      const projectsData = response.data.projects || response.data;
      setProjects(projectsData);
      setFilteredProjects(projectsData);

      // Calculate stats based on user role
      let calculatedStats;
      if (user.role === 'SELLER') {
        calculatedStats = {
          total: projectsData.length,
          pending: 0, // Sellers don't have pending projects
          inProgress: projectsData.filter((p: Project) => p.status === 'IN_PROGRESS').length,
          completed: projectsData.filter((p: Project) => p.status === 'COMPLETED').length,
        };
      } else {
        calculatedStats = {
          total: projectsData.length,
          pending: projectsData.filter((p: Project) => p.status === 'PENDING').length,
          inProgress: projectsData.filter((p: Project) => p.status === 'IN_PROGRESS').length,
          completed: projectsData.filter((p: Project) => p.status === 'COMPLETED').length,
        };
      }
      setStats(calculatedStats);
      setHasInitialized(true);
    } catch (error: any) {
      console.error('Failed to fetch projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [user, hasInitialized, toast]);

  useEffect(() => {
    if (user && !hasInitialized) {
      fetchProjects();
    }
  }, [user, hasInitialized, fetchProjects]);

  const handleFilterChange = useCallback((filter: string) => {
    setCurrentFilter(filter);
    if (filter === 'all') {
      setFilteredProjects(projects);
    } else if (filter === 'assigned' && user?.role === 'SELLER') {
      setFilteredProjects(projects.filter(p => p.status === 'IN_PROGRESS'));
    } else if (filter === 'completed') {
      setFilteredProjects(projects.filter(p => p.status === 'COMPLETED'));
    } else if (filter === 'pending') {
      setFilteredProjects(projects.filter(p => p.status === 'PENDING'));
    } else if (filter === 'inProgress') {
      setFilteredProjects(projects.filter(p => p.status === 'IN_PROGRESS'));
    }
  }, [projects, user?.role]);

  const getStatusBadge = useCallback((status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Pending</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">In Progress</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Completed</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Cancelled</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  }, []);

  // Show loading while auth is loading
  if (!user && !hasInitialized) {
    return (
      <div className="animate-fade-in">
        <div className="space-y-4 sm:space-y-6">
          <div className="h-16 sm:h-20 bg-muted/20 rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 sm:h-32 bg-muted/20 rounded-lg animate-pulse"></div>
            ))}
          </div>
          <div className="h-64 sm:h-96 bg-muted/20 rounded-lg animate-pulse"></div>
        </div>
      </div>

    );
  }

  // Show nothing if no user
  if (!user) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Welcome back, {user.name}!
            </h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
              {user.role === 'BUYER'
                ? 'Manage your projects and find the right talent'
                : 'Find new opportunities and manage your work'
              }
            </p>
          </div>
          {user.role === 'BUYER' && (
            <Link href="/projects/create">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 hover:scale-105 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <Card className="card-hover gradient-bg border-border/50">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center">
              <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{stats.total}</div>
            <div className="flex items-center mt-1 sm:mt-2">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 mr-1" />
              <span className="text-xs sm:text-sm text-green-400">Active</span>
            </div>
          </CardContent>
        </Card>

        {user.role === 'BUYER' && (
          <Card className="card-hover gradient-bg border-border/50">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="flex items-center mt-1 sm:mt-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 mr-1" />
                <span className="text-xs sm:text-sm text-yellow-400">Awaiting Bids</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="card-hover gradient-bg border-border/50">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400">{stats.inProgress}</div>
            <div className="flex items-center mt-1 sm:mt-2">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 mr-1" />
              <span className="text-xs sm:text-sm text-blue-400">Active Work</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover gradient-bg border-border/50">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400">{stats.completed}</div>
            <div className="flex items-center mt-1 sm:mt-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 mr-1" />
              <span className="text-xs sm:text-sm text-green-400">Finished</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Section */}
      <Card className="gradient-bg border-border/50">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                {user.role === 'BUYER' ? 'Your Projects' : 'Your Work'}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-muted-foreground">
                {user.role === 'BUYER'
                  ? 'Manage and track your posted projects'
                  : 'Track your assigned projects and deliverables'
                }
              </CardDescription>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Button
                variant={currentFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('all')}
                className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
              >
                All
              </Button>
              {user.role === 'BUYER' && (
                <Button
                  variant={currentFilter === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('pending')}
                  className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
                >
                  Pending
                </Button>
              )}
              <Button
                variant={currentFilter === 'inProgress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('inProgress')}
                className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
              >
                Active
              </Button>
              <Button
                variant={currentFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('completed')}
                className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
              >
                Completed
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {loading ? (
            <div className="space-y-3 sm:space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 sm:h-24 bg-muted/20 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <FolderOpen className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No projects found</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                {user.role === 'BUYER'
                  ? "You haven't created any projects yet. Start by posting your first project!"
                  : "You don't have any assigned projects yet. Check available projects to start bidding!"
                }
              </p>
              {user.role === 'BUYER' ? (
                <Link href="/projects/create">
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Project
                  </Button>
                </Link>
              ) : (
                <Link href="/projects">
                  <Button className="w-full sm:w-auto">
                    <Eye className="h-4 w-4 mr-2" />
                    Browse Projects
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredProjects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  className="p-3 sm:p-4 lg:p-6 border border-border/50 rounded-lg hover:border-primary/30 transition-all duration-200 card-hover bg-card/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
                          {project.title}
                        </h3>
                        {getStatusBadge(project.status)}
                      </div>
                      <p className="text-sm sm:text-base text-muted-foreground mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span>{project.budgetRange}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span>Due {format(new Date(project.deadline), 'MMM dd, yyyy')}</span>
                        </div>
                        {user.role === 'BUYER' && project.status === 'PENDING' && (
                          <div className="flex items-center">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span>{project._count.bids} bids</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Link href={`/projects/${project.id}`}>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {filteredProjects.length > 5 && (
                <div className="text-center pt-3 sm:pt-4">
                  <Link href="/projects">
                    <Button variant="outline" className="w-full sm:w-auto">
                      View All Projects ({filteredProjects.length})
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>

  );
}
