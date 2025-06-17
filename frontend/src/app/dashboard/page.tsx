'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { projectsAPI, bidsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { format } from 'date-fns';
import { FolderOpen, DollarSign, Clock, Users } from 'lucide-react';

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
  _count: {
    bids: number;
    deliverables?: number;
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      const projectsData = response.data.projects;
      setProjects(projectsData);
      
      // Calculate stats
      const stats = {
        total: projectsData.length,
        pending: projectsData.filter((p: Project) => p.status === 'PENDING').length,
        inProgress: projectsData.filter((p: Project) => p.status === 'IN_PROGRESS').length,
        completed: projectsData.filter((p: Project) => p.status === 'COMPLETED').length,
      };
      setStats(stats);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        variant: 'error',
      });
    } finally {
      setLoading(false);
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

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user.role === 'BUYER' 
              ? 'Manage your projects and find the right talent'
              : 'Find new opportunities and manage your bids'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              {user.role === 'BUYER' 
                ? 'Your latest posted projects'
                : 'Projects you\'re working on or have bid on'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No projects found</p>
                {user.role === 'BUYER' && (
                  <Link href="/projects/create">
                    <Button>Create Your First Project</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Budget: {project.budgetRange}</span>
                        <span>Deadline: {format(new Date(project.deadline), 'MMM dd, yyyy')}</span>
                        <span>{project._count.bids} bids</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Link href={`/projects/${project.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {projects.length > 5 && (
                  <div className="text-center pt-4">
                    <Link href="/projects">
                      <Button variant="outline">View All Projects</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
