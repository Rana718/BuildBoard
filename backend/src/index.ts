import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticateToken } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import bidRoutes from './routes/bids.js';
import reviewRoutes from './routes/reviews.js';
import profileRoutes from './routes/profile.js';
import './services/worker.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRoutes);

app.use('/api/projects', authenticateToken, projectRoutes);
app.use('/api/bids', authenticateToken, bidRoutes);
app.use('/api/reviews', authenticateToken, reviewRoutes);
app.use('/api/profile', authenticateToken, profileRoutes);



app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'BuildBoard API is running smoothly',
    timestamp: new Date().toISOString()
  });
});



app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});


app.use('*', (req, res) => {
  res.status(404).json({
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

app.listen(PORT, () => {
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});
