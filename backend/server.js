const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 


const eventRoutes = require('./routes/events'); 
const authRoutes = require('./routes/auth');   
const userRoutes = require('./routes/users');

const app = express();


let dbConnectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    
    return; 
  }
  if (!dbConnectionPromise) {
    
    dbConnectionPromise = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    }).then(mongooseInstance => {
      console.log('MongoDB connected successfully via Mongoose');
      return mongooseInstance;
    }).catch(error => {
      console.error('MongoDB connection error:', error.message);
      
      dbConnectionPromise = null; 
      throw error; 
    });
  }
  return dbConnectionPromise;
};


connectDB().catch(err => {
    
    console.error("Initial MongoDB connection attempt failed:", err.message);
});





const allowedOrigins = [
  'http://localhost:3000', 
  process.env.FRONTEND_VERCEL_URL, 
  'https://ticketsale-xi.vercel.app/' 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));

app.use(express.json());


app.use(async (req, res, next) => {
  try {
    await connectDB(); 
    next();
  } catch (error) {
    console.error("Failed to ensure DB connection for request:", error.message);
    res.status(503).json({ message: 'Service temporarily unavailable due to database issue.' });
  }
});

app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
  res.send('Express backend is running on Vercel!');
});


app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  
  res.status(500).json({ message: 'Something went wrong on the server!' });
});


module.exports = app;


