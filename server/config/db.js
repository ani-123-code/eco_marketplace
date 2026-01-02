const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  MONGODB_URI not set. Database connection will fail.');
      return false;
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
    });
    console.log('✅ MongoDB Connected');
    return true;
  } catch (err) {
    console.error('❌ DB connection error:', err.message);
    // Don't exit - let server continue without DB (graceful degradation)
    return false;
  }
};

module.exports = connectDB;
