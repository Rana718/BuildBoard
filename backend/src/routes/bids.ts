import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireRole, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

const placeBidSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  bidAmount: z.number().positive('Bid amount must be positive'),
  estimatedCompletionTime: z.string().min(1, 'Estimated completion time is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Place bid (Seller only)
router.post('/place', requireRole(['SELLER']), async (req: AuthRequest, res) => {
  try {
    const validatedData = placeBidSchema.parse(req.body);
    
    // Check if project exists and is in pending status
    const project = await prisma.project.findUnique({
      where: { id: validatedData.projectId },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.status !== 'PENDING') {
      return res.status(400).json({ message: 'Project is not accepting bids' });
    }
    
    if (project.buyerId === req.user!.id) {
      return res.status(400).json({ message: 'You cannot bid on your own project' });
    }
    
    // Check if seller already placed a bid
    const existingBid = await prisma.bid.findUnique({
      where: {
        projectId_sellerId: {
          projectId: validatedData.projectId,
          sellerId: req.user!.id,
        }
      }
    });
    
    if (existingBid) {
      return res.status(400).json({ message: 'You have already placed a bid on this project' });
    }
    
    // Create bid
    const bid = await prisma.bid.create({
      data: {
        ...validatedData,
        sellerId: req.user!.id,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            budgetRange: true,
          }
        }
      }
    });
    
    res.status(201).json({
      message: 'Bid placed successfully',
      bid,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors 
      });
    }
    
    console.error('Place bid error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get bids for a project
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
    
    // Only project owner (buyer) can see all bids
    // Sellers can only see their own bid
    let whereClause: any = { projectId };
    
    if (req.user!.role === 'SELLER' && project.buyerId !== req.user!.id) {
      whereClause.sellerId = req.user!.id;
    } else if (req.user!.role === 'BUYER' && project.buyerId !== req.user!.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const bids = await prisma.bid.findMany({
      where: whereClause,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
    
    res.json({ bids });
  } catch (error) {
    console.error('Get bids error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update bid (Seller only, before project is assigned)
router.put('/:bidId', requireRole(['SELLER']), async (req: AuthRequest, res) => {
  try {
    const { bidId } = req.params;
    
    const updateBidSchema = z.object({
      bidAmount: z.number().positive().optional(),
      estimatedCompletionTime: z.string().min(1).optional(),
      message: z.string().min(10).optional(),
    });
    
    const validatedData = updateBidSchema.parse(req.body);
    
    // Check if bid exists and belongs to the seller
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        project: true,
      }
    });
    
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    if (bid.sellerId !== req.user!.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (bid.project.status !== 'PENDING') {
      return res.status(400).json({ message: 'Cannot update bid for assigned project' });
    }
    
    const updatedBid = await prisma.bid.update({
      where: { id: bidId },
      data: validatedData,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            budgetRange: true,
          }
        }
      }
    });
    
    res.json({
      message: 'Bid updated successfully',
      bid: updatedBid,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors 
      });
    }
    
    console.error('Update bid error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete bid (Seller only, before project is assigned)
router.delete('/:bidId', requireRole(['SELLER']), async (req: AuthRequest, res) => {
  try {
    const { bidId } = req.params;
    
    // Check if bid exists and belongs to the seller
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        project: true,
      }
    });
    
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    if (bid.sellerId !== req.user!.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (bid.project.status !== 'PENDING') {
      return res.status(400).json({ message: 'Cannot delete bid for assigned project' });
    }
    
    await prisma.bid.delete({
      where: { id: bidId }
    });
    
    res.json({ message: 'Bid deleted successfully' });
  } catch (error) {
    console.error('Delete bid error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
