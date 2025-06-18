import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile by ID
router.get('/:userId', async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImageUrl: true,
        bio: true,
        skills: true,
        averageRating: true,
        totalReviews: true,
        createdAt: true,
        _count: {
          select: {
            projectsAsBuyer: true,
            projectsAsSeller: true,
            reviewsReceived: true,
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get project statistics
    let projectStats = {};
    
    if (user.role === 'BUYER') {
      const buyerStats = await prisma.project.groupBy({
        by: ['status'],
        where: { buyerId: userId },
        _count: { status: true }
      });
      
      projectStats = {
        total: buyerStats.reduce((sum, stat) => sum + stat._count.status, 0),
        pending: buyerStats.find(s => s.status === 'PENDING')?._count.status || 0,
        inProgress: buyerStats.find(s => s.status === 'IN_PROGRESS')?._count.status || 0,
        completed: buyerStats.find(s => s.status === 'COMPLETED')?._count.status || 0,
        cancelled: buyerStats.find(s => s.status === 'CANCELLED')?._count.status || 0,
      };
    } else {
      const sellerStats = await prisma.project.groupBy({
        by: ['status'],
        where: { sellerId: userId },
        _count: { status: true }
      });
      
      projectStats = {
        total: sellerStats.reduce((sum, stat) => sum + stat._count.status, 0),
        assigned: sellerStats.find(s => s.status === 'IN_PROGRESS')?._count.status || 0,
        completed: sellerStats.find(s => s.status === 'COMPLETED')?._count.status || 0,
      };
    }

    // Get recent reviews
    const reviews = await prisma.review.findMany({
      where: { sellerId: userId },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Get rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { sellerId: userId },
      _count: { rating: true }
    });

    const ratingStats = {
      1: ratingDistribution.find(r => r.rating === 1)?._count.rating || 0,
      2: ratingDistribution.find(r => r.rating === 2)?._count.rating || 0,
      3: ratingDistribution.find(r => r.rating === 3)?._count.rating || 0,
      4: ratingDistribution.find(r => r.rating === 4)?._count.rating || 0,
      5: ratingDistribution.find(r => r.rating === 5)?._count.rating || 0,
    };

    res.json({
      user,
      projectStats,
      reviews,
      ratingStats
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get profile statistics for charts (SSE endpoint)
router.get('/:userId/stats-stream', async (req: AuthRequest, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  const sendStats = async () => {
    try {
      const { userId } = req.params;
      
      // Get monthly project statistics for the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const monthlyStats = await prisma.project.findMany({
        where: {
          OR: [
            { buyerId: userId },
            { sellerId: userId }
          ],
          createdAt: {
            gte: sixMonthsAgo
          }
        },
        select: {
          createdAt: true,
          status: true,
          finalAmount: true
        }
      });

      // Group by month
      const monthlyData = monthlyStats.reduce((acc, project) => {
        const month = project.createdAt.toISOString().slice(0, 7); // YYYY-MM
        if (!acc[month]) {
          acc[month] = { projects: 0, earnings: 0, completed: 0 };
        }
        acc[month].projects++;
        if (project.status === 'COMPLETED' && project.finalAmount) {
          acc[month].earnings += project.finalAmount;
          acc[month].completed++;
        }
        return acc;
      }, {} as Record<string, { projects: number; earnings: number; completed: number }>);

      const data = {
        timestamp: new Date().toISOString(),
        monthlyData,
        totalProjects: monthlyStats.length,
        totalEarnings: Object.values(monthlyData).reduce((sum, month) => sum + month.earnings, 0),
        completedProjects: Object.values(monthlyData).reduce((sum, month) => sum + month.completed, 0)
      };

      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (error) {
      console.error('Error in SSE:', error);
      res.write(`data: ${JSON.stringify({ error: 'Failed to fetch stats' })}\n\n`);
    }
  };

  // Send initial data
  await sendStats();

  // Send updates every 30 seconds
  const interval = setInterval(sendStats, 30000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// Update user profile
router.put('/:userId', async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;
    const updateSchema = z.object({
      name: z.string().optional(),
      bio: z.string().optional(),
      skills: z.array(z.string()).optional(),
      profileImageUrl: z.string().optional(),
    });

    const validatedData = updateSchema.parse(req.body);

    // Check if user can update this profile
    if (req.user?.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this profile' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImageUrl: true,
        bio: true,
        skills: true,
        averageRating: true,
        totalReviews: true,
        createdAt: true,
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
