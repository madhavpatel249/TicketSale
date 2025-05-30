const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Make sure to set environment variables in Vercel

// Import routes
const eventRoutes = require('./routes/events'); // Ensure these paths are correct relative to this file
const authRoutes = require('./routes/auth');   // e.g., if this file is api/index.js, routes might be ../routes/events
const userRoutes = require('./routes/users');

const app = express();

// --- Database Connection ---
// It's good practice to establish the connection when the function initializes.
// Mongoose handles connection pooling, so it will reuse connections for warm function instances.
let dbConnectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    return; // Already connected or connecting
  }
  if (!dbConnectionPromise) {
    // Avoid multiple connection attempts during cold start
    dbConnectionPromise = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // serverSelectionTimeoutMS: 5000, // Optional: Adjust timeout for connection attempts
      // bufferCommands: false, // Optional: Disable buffering if you want commands to fail fast if not connected
    }).then(mongooseInstance => {
      console.log('MongoDB connected successfully via Mongoose');
      return mongooseInstance;
    }).catch(error => {
      console.error('MongoDB connection error:', error.message);
      // In a serverless environment, you might not want to process.exit(1)
      // as it could affect other invocations if the container is reused.
      // Instead, let requests fail or handle the error appropriately.
      dbConnectionPromise = null; // Reset promise so next invocation can try again
      throw error; // Re-throw to indicate failure
    });
  }
  return dbConnectionPromise;
};

// Call connectDB when the module is loaded to initiate connection early for warm starts
// or on the first request for cold starts.
// We will ensure it's called before handling requests.
// For Vercel, it's better to await this in the request handling path if needed,
// or ensure it's called when the serverless function is initialized.
// A simple approach is to call it here and let Mongoose manage the connection state.
connectDB().catch(err => {
    // Log the error but don't necessarily kill the whole process for serverless
    console.error("Initial MongoDB connection attempt failed:", err.message);
});


// --- Middleware ---

// CORS Configuration: Update with your frontend's Vercel URL
const allowedOrigins = [
  'http://localhost:3000', // Your local React dev server
  'http://localhost:5173', // Your local Vite dev server (if applicable)
  process.env.FRONTEND_VERCEL_URL // Your deployed frontend URL on Vercel (set this in Vercel env vars)
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // If you're using cookies/sessions
}));

app.use(express.json());

// --- Routes ---
// Ensure DB is connected before handling requests that might need it.
// This middleware will ensure connectDB() promise is resolved before proceeding.
app.use(async (req, res, next) => {
  try {
    await connectDB(); // Ensures DB is connected or connection attempt is made
    next();
  } catch (error) {
    console.error("Failed to ensure DB connection for request:", error.message);
    res.status(503).json({ message: 'Service temporarily unavailable due to database issue.' });
  }
});

app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Basic root route for testing deployment
app.get('/', (req, res) => {
  res.send('Express backend is running on Vercel!');
});

// --- Error handling middleware ---
// This should be the last middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  // Avoid sending detailed error messages in production for security
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

// --- Vercel Export ---
// Vercel expects the Express app to be exported
module.exports = app;

// The app.listen() and startServer() parts are removed as Vercel handles the server lifecycle.
