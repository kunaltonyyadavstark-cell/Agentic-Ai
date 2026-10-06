import mongoose from 'mongoose';
import logger from './logger.config';


/**
 * Connect to the MongoDB database
 * 
 * @returns Promise that resolves when the connection succeeds
 * @throws Error if the connection fails
 * 
 * @example
 * await connectDatabase();
 * logger.info('Connected to MongoDB');
 */
export async function connectDatabase(): Promise<void> {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27018/agentlogic';
    
    await mongoose.connect(mongoUri);
    
    logger.info('✅ Connected to MongoDB');
    
    // Log connection events
    mongoose.connection.on('error', (error) => {
      logger.error('❌ MongoDB error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected');
    });

  } catch (error) {
    logger.error('❌ Error connecting to MongoDB:', error);
    // Use a production-grade logger in production
    process.exit(1);
  }
}

/**
 * Disconnect from the database
 * Useful for tests and graceful shutdown
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
  }
}

/**
 * Clear all collections
 * Only for testing.
 */
export async function clearDatabase(): Promise<void> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('clearDatabase can only be used in the test environment');
  }

  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}