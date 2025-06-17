import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireRole, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').optional(),
});

// Create review (Buyer only, after project completion)
router.post('/:projectId', requireRole(['BUYER']), async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;
    const validatedData = createReviewSchema.parse(req.body);
    
    // Check if project exists and is completed
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.buyerId !== req.user!.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (project.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Project must be completed to leave a review' });
    }
    
    if (!project.sellerId) {
      return res.status(400).json({ message: 'No seller assigned to this project' });
    }
    
    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { projectId }
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this project' });
    }
    
    // Create review
    const review = await prisma.review.create({
      data: {
        ...validatedData,
        projectId,
        buyerId: req.user!.id,
        sellerId: project.sellerId,
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          }
        },
        project: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    });
    
    res.status(201).json({
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors 
      });
    }
    
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get review for a project
router.get('/:projectId', async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;
    
    // Check if project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const hasAccess = 
      project.buyerId === req.user!.id || 
      project.sellerId === req.user!.id;
    
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const review = await prisma.review.findUnique({
      where: { projectId },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          }
        },
        project: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json({ review });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all reviews for a seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // Check if seller exists
    const seller = await prisma.user.findUnique({
      where: { id: sellerId, role: 'SELLER' }
    });
    
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: { sellerId },
        include: {
          buyer: {
            select: {
              id: true,
              name: true,
              profileImageUrl: true,
            }
          },
          project: {
            select: {
              id: true,
              title: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: Number(limit),
      }),
      prisma.review.count({
        where: { sellerId }
      })
    ]);
    
    // Calculate average rating
    const avgRating = await prisma.review.aggregate({
      where: { sellerId },
      _avg: {
        rating: true,
      }
    });
    
    res.json({
      reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / Number(limit)),
      },
      averageRating: avgRating._avg.rating || 0,
      totalReviews: totalCount,
    });
  } catch (error) {
    console.error('Get seller reviews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update review (Buyer only, within 7 days)
router.put('/:projectId', requireRole(['BUYER']), async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;
    const validatedData = createReviewSchema.parse(req.body);
    
    const review = await prisma.review.findUnique({
      where: { projectId }
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (review.buyerId !== req.user!.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Check if review is within 7 days
    const daysSinceCreation = Math.floor(
      (Date.now() - review.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceCreation > 7) {
      return res.status(400).json({ message: 'Reviews can only be updated within 7 days' });
    }
    
    const updatedReview = await prisma.review.update({
      where: { projectId },
      data: validatedData,
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          }
        },
        project: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    });
    
    res.json({
      message: 'Review updated successfully',
      review: updatedReview,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors 
      });
    }
    
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
