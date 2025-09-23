import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://kintunde2010:W7RmTzpRS1fAIjyS@cluster0.5nhc7da.mongodb.net/growfund?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
