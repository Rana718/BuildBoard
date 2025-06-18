import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Create payment for a project
router.post('/create', async (req: AuthRequest, res) => {
  try {
    const paymentSchema = z.object({
      projectId: z.string(),
      amount: z.number().positive(),
      paymentMethod: z.string().optional(),
    });

    const { projectId, amount, paymentMethod } = paymentSchema.parse(req.body);

    // Verify the project exists and user is the buyer
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { buyer: true, seller: true }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.buyerId !== req.user?.id) {
      return res.status(403).json({ message: 'Only the buyer can create payments' });
    }

    if (project.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Can only pay for completed projects' });
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findFirst({
      where: { projectId }
    });

    if (existingPayment) {
      return res.status(400).json({ message: 'Payment already exists for this project' });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        projectId,
        buyerId: req.user!.id,
        amount,
        paymentMethod: paymentMethod || 'card',
        status: 'PENDING',
        // In a real app, you'd integrate with Stripe, PayPal, etc.
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      },
      include: {
        project: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Update project final amount and status
    await prisma.project.update({
      where: { id: projectId },
      data: {
        finalAmount: amount,
        status: 'PAYMENT_PENDING'
      }
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Process payment (simulate payment processing)
router.post('/:paymentId/process', async (req: AuthRequest, res) => {
  try {
    const { paymentId } = req.params;
    const processSchema = z.object({
      paymentMethod: z.string(),
      cardDetails: z.object({
        number: z.string().optional(),
        expiryMonth: z.string().optional(),
        expiryYear: z.string().optional(),
        cvv: z.string().optional(),
      }).optional(),
    });

    const { paymentMethod, cardDetails } = processSchema.parse(req.body);

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        project: {
          include: {
            seller: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.buyerId !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (payment.status !== 'PENDING') {
      return res.status(400).json({ message: 'Payment already processed' });
    }

    // Simulate payment processing
    // In a real app, you'd call Stripe, PayPal, etc. APIs here
    const isPaymentSuccessful = Math.random() > 0.1; // 90% success rate for demo

    if (isPaymentSuccessful) {
      // Update payment status
      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'COMPLETED',
          paymentMethod,
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }
      });

      // Update project status
      await prisma.project.update({
        where: { id: payment.projectId },
        data: { status: 'COMPLETED' }
      });

      res.json({
        success: true,
        payment: updatedPayment,
        message: 'Payment processed successfully'
      });
    } else {
      // Payment failed
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'FAILED' }
      });

      res.status(400).json({
        success: false,
        message: 'Payment processing failed. Please try again.'
      });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get payment details
router.get('/:paymentId', async (req: AuthRequest, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        project: {
          include: {
            buyer: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            seller: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if user has access to this payment
    if (payment.buyerId !== req.user?.id && payment.project.sellerId !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get payments for a project
router.get('/project/:projectId', async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;

    // Verify user has access to this project
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.buyerId !== req.user?.id && project.sellerId !== req.user?.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const payments = await prisma.payment.findMany({
      where: { projectId },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's payment history
router.get('/user/history', async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const payments = await prisma.payment.findMany({
      where: { buyerId: req.user!.id },
      include: {
        project: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                profileImageUrl: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.payment.count({
      where: { buyerId: req.user!.id }
    });

    res.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
