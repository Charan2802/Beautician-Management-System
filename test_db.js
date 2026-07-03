import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testConnection = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected Successfully");
    console.log("Host:", conn.connection.host);
    console.log("Database:", conn.connection.name);

    process.exit(0);
  } catch (error) {
    console.log("❌ MongoDB Connection Failed");
    console.log(error.message);

    process.exit(1);
  }
};

testConnection();