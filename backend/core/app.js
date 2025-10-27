const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const eventRoutes = require('../src/events/event.route');
const authRoutes = require('../src/auth/auth.route');
const userRoutes = require('../src/users/user.route');

// Import middleware
const uploadMiddleware = require('../utils/upload');
const { ensureDBConnection } = require('../config/db');

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://ticketsale-xi.vercel.app',
  'https://ticketsale-xi.vercel.app/',
  process.env.FRONTEND_VERCEL_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    await ensureDBConnection();
    next();
  } catch (error) {
    console.error("Failed to ensure DB connection for request:", error.message);
    res.status(503).json({ message: 'Service temporarily unavailable due to database issue.' });
  }
});

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// File upload route
app.post('/api/events/upload-image', uploadMiddleware, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `${process.env.API_URL || ''}/uploads/${req.file.filename}`;
    return res.status(200).json({
      message: 'File uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Error in upload handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check route
app.get('/', (req, res) => {
  res.send('Express backend is running on Vercel!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  
  // Handle multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

module.exports = app;