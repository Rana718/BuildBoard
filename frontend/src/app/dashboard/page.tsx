'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { Layout } from '@/components/Layout';
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
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">In Progress</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  }, []);

  // Show loading while auth is loading
  if (!user && !hasInitialized) {
    return (
      <Layout>
        <div className="px-4 sm:px-0 animate-fade-in">
          <div className="space-y-8">
            <div className="h-20 bg-muted/20 rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted/20 rounded-lg animate-pulse"></div>
              ))}
            </div>
            <div className="h-96 bg-muted/20 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show nothing if no user
  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Welcome back, {user.name}!
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                {user.role === 'BUYER' 
                  ? 'Manage your projects and find the right talent'
                  : 'Find new opportunities and manage your work'
                }
              </p>
            </div>
            {user.role === 'BUYER' && (
              <Link href="/projects/create">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card 
            className={`bg-card/50 border-border/50 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
              currentFilter === 'all' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleFilterChange('all')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
              <div className="p-2 bg-primary/20 rounded-lg">
                <FolderOpen className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-card-foreground">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                All time
              </p>
            </CardContent>
          </Card>
          
          {user.role === 'BUYER' && (
            <Card 
              className={`bg-card/50 border-border/50 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                currentFilter === 'pending' ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleFilterChange('pending')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Clock className="h-4 w-4 text-yellow-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-card-foreground">{stats.pending}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Awaiting bids
                </p>
              </CardContent>
            </Card>
          )}
          
          <Card 
            className={`bg-card/50 border-border/50 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
              currentFilter === (user.role === 'SELLER' ? 'assigned' : 'inProgress') ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleFilterChange(user.role === 'SELLER' ? 'assigned' : 'inProgress')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {user.role === 'SELLER' ? 'Assigned' : 'In Progress'}
              </CardTitle>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-card-foreground">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {user.role === 'SELLER' ? 'Projects assigned to you' : 'Active work'}
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className={`bg-card/50 border-border/50 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
              currentFilter === 'completed' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleFilterChange('completed')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-card-foreground">{stats.completed}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Successfully finished
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtered Projects */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-card-foreground">
                  {currentFilter === 'all' ? 'All Projects' :
                   currentFilter === 'pending' ? 'Pending Projects' :
                   currentFilter === 'assigned' ? 'Assigned Projects' :
                   currentFilter === 'inProgress' ? 'In Progress Projects' :
                   currentFilter === 'completed' ? 'Completed Projects' :
                   'Recent Projects'}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {user.role === 'BUYER' 
                    ? 'Your posted projects and their progress'
                    : 'Projects you\'re working on or have completed'
                  }
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => handleFilterChange('all')}
                >
                  Show All
                </Button>
                <Link href="/projects">
                  <Button variant="outline" className="hover:bg-accent hover:text-accent-foreground transition-colors">
                    View All Projects
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 rounded-lg bg-muted/20 animate-pulse"></div>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                  {currentFilter === 'all' ? 'No projects found' : `No ${currentFilter} projects found`}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {currentFilter === 'all' 
                    ? (user.role === 'BUYER' 
                        ? 'Start by creating your first project'
                        : 'Browse available projects to get started')
                    : `You don't have any ${currentFilter} projects yet`
                  }
                </p>
                {user.role === 'BUYER' ? (
                  <Link href="/projects/create">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Project
                    </Button>
                  </Link>
                ) : (
                  <Link href="/projects">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105">
                      <Eye className="w-4 h-4 mr-2" />
                      Browse Projects
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.slice(0, 10).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-6 border border-border/50 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        {getStatusBadge(project.status)}
                      </div>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{project.budgetRange}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(project.deadline), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{project._count.bids} bids</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-6">
                      <Link href={`/projects/${project.id}`}>
                        <Button variant="outline" className="hover:bg-accent hover:text-accent-foreground transition-all duration-200 group">
                          View Details
                          <Eye className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}