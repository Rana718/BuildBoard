'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { projectsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { format } from 'date-fns';
import { Search, Filter, Plus, Calendar, DollarSign, Users } from 'lucide-react';
import Image from 'next/image';

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

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, [roleFilter]);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, statusFilter]);

  const fetchProjects = async () => {
    try {
      const params: any = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (roleFilter !== 'all') {
        params.role = roleFilter;
      }

      const response = await projectsAPI.getAll(params);
      setProjects(response.data.projects);
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

  const filterProjects = () => {
    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-2">
              {user.role === 'BUYER' 
                ? 'Manage your posted projects'
                : 'Browse available projects and submit bids'
              }
            </p>
          </div>
          {user.role === 'BUYER' && (
            <Link href="/projects/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                {user.role === 'SELLER' && (
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">Available Projects</option>
                    <option value="my-projects">My Projects</option>
                  </select>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No projects found</p>
              {user.role === 'BUYER' && (
                <Link href="/projects/create">
                  <Button>Create Your First Project</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  {project.imageUrl && (
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-3">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>{project.budgetRange}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Due: {format(new Date(project.deadline), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{project._count.bids} bids</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Posted by {project.buyer.name}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Link href={`/projects/${project.id}`}>
                      <Button className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
