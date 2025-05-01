const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/ticketSale'; 

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));
