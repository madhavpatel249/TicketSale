const mongoose = require('mongoose');

// Database connection state
let dbConnectionPromise = null;
let isConnected = false;

// Modern MongoDB connection with better error handling
const connectDB = async () => {
  // Return existing connection if already connected
  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return mongoose.connection;
  }

  // Return existing promise if connection is in progress
  if (dbConnectionPromise) {
    return dbConnectionPromise;
  }

  // Create new connection promise
  dbConnectionPromise = mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferCommands: false, // Disable mongoose buffering
    bufferMaxEntries: 0 // Disable mongoose buffering
  })
  .then((connection) => {
    console.log('✅ MongoDB connected successfully');
    isConnected = true;
    
    // Handle connection events
    connection.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      isConnected = false;
    });

    connection.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      isConnected = false;
    });

    connection.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
      isConnected = true;
    });

    return connection;
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    dbConnectionPromise = null;
    isConnected = false;
    throw error;
  });

  return dbConnectionPromise;
};

// Ensure database connection for requests
const ensureDBConnection = async () => {
  if (!isConnected && mongoose.connection.readyState < 1) {
    await connectDB();
  }
  return mongoose.connection;
};

// Graceful shutdown
const disconnectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    isConnected = false;
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Gracefully shutting down...');
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM. Gracefully shutting down...');
  await disconnectDB();
  process.exit(0);
});

module.exports = {
  connectDB,
  ensureDBConnection,
  disconnectDB,
  isConnected: () => isConnected
};