import mongoose from 'mongoose';

let memoryServer = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // Fallback: if no external MongoDB is reachable, start an in-memory MongoDB
    if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
      try {
        await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/parkingease', {
          serverSelectionTimeoutMS: 2000,
        });
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        return mongoose.connection;
      } catch (localErr) {
        console.log('Local MongoDB not available, starting in-memory MongoDB...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create({
          instance: { dbName: 'parkingease' },
        });
        uri = memoryServer.getUri('parkingease');
        await mongoose.connect(uri);
        console.log(`In-Memory MongoDB Connected: ${mongoose.connection.host}`);
        return mongoose.connection;
      }
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
