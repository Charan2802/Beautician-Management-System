import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    console.log(
      "URI Exists:",
      !!process.env.MONGODB_URI
    );

    const conn = await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(
      `✅ MongoDB Connected: ${conn.connection.host}`
    );

    return conn;
  } catch (error) {
    console.error(
      "❌ MongoDB Error:",
      error.message
    );

    throw error;
  }
};

export default connectDB;