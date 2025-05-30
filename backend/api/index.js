const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes with adjusted paths
const eventRoutes = require('../routes/events');
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/users');

const app = express();

// --- Database Connection ---
let dbConnectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  if (!dbConnectionPromise) {
    dbConnectionPromise = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch(error => {
      console.error('MongoDB connection error:', error.message);
      dbConnectionPromise = null;
      throw error;
    });
  }
  return dbConnectionPromise;
};

connectDB().catch(err => console.error("MongoDB connection failed:", err.message));

// --- Middleware ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_VERCEL_URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// --- Routes ---
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(503).json({ message: 'Service temporarily unavailable' });
  }
});

app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('API is running'));

// --- Error handling middleware ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app; 