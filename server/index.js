import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware, adminMiddleware } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import charactersRoutes from './routes/characters.js';
import ticketsRoutes from './routes/tickets.js';
import downloadsRoutes from './routes/downloads.js';
import imagesRoutes from './routes/images.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/news', authMiddleware, newsRoutes);
app.use('/api/characters', authMiddleware, charactersRoutes);
app.use('/api/tickets', authMiddleware, ticketsRoutes);

// Admin routes
app.use('/api/admin/tickets', authMiddleware, adminMiddleware, ticketsRoutes);
app.use('/api/admin/downloads', authMiddleware, adminMiddleware, downloadsRoutes);
app.use('/api/admin/images', authMiddleware, adminMiddleware, imagesRoutes);

// Serve uploaded files
app.use('/downloads', express.static('public/downloads'));
app.use('/images', express.static('public/images'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});