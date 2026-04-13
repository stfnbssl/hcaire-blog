import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const password = process.env.MONGODB_PASSWORD;
  const urlTemplate = process.env.MONGODB_URL;

  if (!password || !urlTemplate) {
    throw new Error('MONGODB_PASSWORD and MONGODB_URL must be set in .env');
  }

  // Insert password and database name into the connection string
  const mongoUrl = urlTemplate
    .replace('{password}', password)
    .replace('/?', '/hcaire_db?');

  try {
    await mongoose.connect(mongoUrl);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
