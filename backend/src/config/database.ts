import mongoose from 'mongoose';

export let isMongoConnected = false;

export const connectDatabase = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexura_support';

  try {
    // Attempt connection with a short 3-second timeout for graceful fallback
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log('✅ Database: MongoDB Connected successfully');
    return true;
  } catch (err: any) {
    isMongoConnected = false;
    console.log('⚡ Database: MongoDB not available at ' + uri);
    console.log('🚀 Demo Mode: Activated In-Memory Fast Store with Seeded Hackathon Records');
    return false;
  }
};
