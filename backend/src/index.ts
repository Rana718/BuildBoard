import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticateToken } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import bidRoutes from './routes/bids.js';
import reviewRoutes from './routes/reviews.js';
// import uploadRoutes from './routes/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Auth routes (handles public and protected routes internally)
app.use('/api/auth', authRoutes);

// Protected routes - require authentication
app.use('/api/projects', authenticateToken, projectRoutes);
app.use('/api/bids', authenticateToken, bidRoutes);
app.use('/api/reviews', authenticateToken, reviewRoutes);
// app.use('/api/upload', authenticateToken, uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
