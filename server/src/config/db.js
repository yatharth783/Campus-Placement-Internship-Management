
const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is missing in environment variables.');
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log('[CampusConnect DB] MongoDB connected successfully.');
  } catch (err) {
    console.error('[CampusConnect DB] MongoDB connection failed:', err.message);

    // Never use temporary database in production
    if (isProduction) {
      throw err;
    }

    // Local development fallback only
    console.log('[CampusConnect DB] Starting embedded MongoDB for development...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');

      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();

      await mongoose.connect(memoryUri);

      console.log('[CampusConnect DB] Embedded MongoDB connected.');

      const { seedDatabase } = require('../utils/seeder');
      await seedDatabase(true);
    } catch (memErr) {
      console.error('[CampusConnect DB] Embedded MongoDB failed:', memErr.message);
      throw memErr;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();

  if (mongodInstance) {
    await mongodInstance.stop();
    mongodInstance = null;
  }
};

module.exports = { connectDB, disconnectDB };
