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

// Update user profile
router.put('/:userId', async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;
    const updateSchema = z.object({
      name: z.string().min(1, 'Name is required').optional(),
      bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
      skills: z.array(z.string()).max(10, 'Maximum 10 skills allowed').optional(),
      profileImageUrl: z.string().url('Invalid image URL').optional(),
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

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors 
      });
    }
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
