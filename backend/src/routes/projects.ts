import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireRole, AuthRequest } from '../middleware/auth.js';
import { sendSellerSelectionEmail, sendProjectCompletionEmail } from '../lib/email.js';

const router = express.Router();

const createProjectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  budgetRange: z.string().min(1, 'Budget range is required'),
  deadline: z.string().datetime('Invalid deadline format'),
  imageUrl: z.string().url().optional(),
});

// Create project (Buyer only)
router.post('/create', requireRole(['BUYER']), async (req: AuthRequest, res) => {
  try {
    const validatedData = createProjectSchema.parse(req.body);
    
    const project = await prisma.project.create({
      data: {
        ...validatedData,
        deadline: new Date(validatedData.deadline),
        buyerId: req.user!.id,
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          }
        },
        _count: {
          select: {
            bids: true,
          }
        }
      }
    });
    
    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors 
      });
    }
    
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all projects (with filters)
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { status, role } = req.query;
    
    let whereClause: any = {};
    
    // Filter based on user role and query params
    if (req.user!.role === 'BUYER') {
      whereClause.buyerId = req.user!.id;
    } else if (req.user!.role === 'SELLER') {
      if (role === 'my-projects') {
        whereClause.sellerId = req.user!.id;
      } else {
        // Show only pending projects for sellers to bid on
        whereClause.status = 'PENDING';
      }
    }
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          }
        },
        _count: {
          select: {
            bids: true,
            deliverables: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
    
    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single project
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          }
        },
        bids: {
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
        },
        deliverables: {
          orderBy: {
            uploadedAt: 'desc',
          }
        },
        reviews: {
          include: {
            buyer: {
              select: {
                id: true,
                name: true,
                profileImageUrl: true,
              }
            }
          }
        }
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has access to this project
    const hasAccess = 
      project.buyerId === req.user!.id || 
      project.sellerId === req.user!.id ||
      (req.user!.role === 'SELLER' && project.status === 'PENDING');
    
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update project status
router.put('/status/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['PENDING', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        buyer: true,
        seller: true,
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check permissions
    const canUpdate = 
      (project.buyerId === req.user!.id) || 
      (project.sellerId === req.user!.id);
    
    if (!canUpdate) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updatedProject = await prisma.project.update({
      where: { id },
      data: { status },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          }
        }
      }
    });
    
    res.json({
      message: 'Project status updated successfully',
      project: updatedProject,
    });
  } catch (error) {
    console.error('Update project status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Select seller for project (Buyer only)
router.post('/select-seller/:id', requireRole(['BUYER']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { sellerId } = req.body;
    
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        buyer: true,
        bids: {
          where: { sellerId },
          include: {
            seller: true,
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
    
    if (project.status !== 'PENDING') {
      return res.status(400).json({ message: 'Project is not in pending status' });
    }
    
    const bid = project.bids[0];
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    // Update project with selected seller
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        sellerId,
        status: 'IN_PROGRESS',
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          }
        }
      }
    });
    
    // Send email notification to selected seller
    try {
      await sendSellerSelectionEmail(
        bid.seller.email,
        bid.seller.name,
        project.title,
        project.buyer.name
      );
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Don't fail the request if email fails
    }
    
    res.json({
      message: 'Seller selected successfully',
      project: updatedProject,
    });
  } catch (error) {
    console.error('Select seller error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Complete project (Seller only)
router.post('/complete/:id', requireRole(['SELLER']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        buyer: true,
        seller: true,
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.sellerId !== req.user!.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (project.status !== 'IN_PROGRESS') {
      return res.status(400).json({ message: 'Project is not in progress' });
    }
    
    const updatedProject = await prisma.project.update({
      where: { id },
      data: { status: 'COMPLETED' },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          }
        }
      }
    });
    
    // Send email notification to buyer
    try {
      await sendProjectCompletionEmail(
        project.buyer.email,
        project.buyer.name,
        project.title,
        project.seller!.name
      );
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Don't fail the request if email fails
    }
    
    res.json({
      message: 'Project completed successfully',
      project: updatedProject,
    });
  } catch (error) {
    console.error('Complete project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Upload deliverable (Seller only)
router.post('/deliver/:id', requireRole(['SELLER']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { fileUrl } = req.body;
    
    if (!fileUrl) {
      return res.status(400).json({ message: 'File URL is required' });
    }
    
    const project = await prisma.project.findUnique({
      where: { id }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.sellerId !== req.user!.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (project.status !== 'IN_PROGRESS') {
      return res.status(400).json({ message: 'Project is not in progress' });
    }
    
    const deliverable = await prisma.deliverable.create({
      data: {
        projectId: id,
        fileUrl,
      }
    });
    
    res.status(201).json({
      message: 'Deliverable uploaded successfully',
      deliverable,
    });
  } catch (error) {
    console.error('Upload deliverable error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
