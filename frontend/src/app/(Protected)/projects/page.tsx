'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { projectsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { format } from 'date-fns';
import { Search, Filter, Plus, Calendar, DollarSign, Users, Eye } from 'lucide-react';
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">In Progress</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!user) {
    return null;
  }

  return (
    
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {user.role === 'BUYER' 
                ? 'Manage your posted projects'
                : 'Browse available projects and submit bids'
              }
            </p>
          </div>
          {user.role === 'BUYER' && (
            <Link href="/projects/create">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background border-input text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-background border border-input rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
                    className="px-3 py-2 bg-background border border-input rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-3 text-sm">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="text-center py-8">
              <div className="space-y-3">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">No projects found</h3>
                <p className="text-muted-foreground text-sm">
                  {searchTerm ? 'Try adjusting your search terms' : 'No projects match your current filters'}
                </p>
                {user.role === 'BUYER' && !searchTerm && (
                  <Link href="/projects/create">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Project
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="bg-card border-border hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group">
                <CardHeader className="p-4 pb-3">
                  {project.imageUrl && (
                    <div className="relative h-40 mb-3 rounded-lg overflow-hidden bg-muted/20">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    {getStatusBadge(project.status)}
                  </div>
                  <CardDescription className="text-sm text-muted-foreground line-clamp-3 mt-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-2 text-green-400" />
                      <span className="font-medium text-card-foreground">{project.budgetRange}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                      <span>Due: {format(new Date(project.deadline), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2 text-purple-400" />
                      <span>{project._count.bids} bids</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Posted by <span className="font-medium text-card-foreground">{project.buyer.name}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <Link href={`/projects/${project.id}`}>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm group">
                        <Eye className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
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
  );
}