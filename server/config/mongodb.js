import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("✅ Already connected to MongoDB");
      return;
    }

    const mongoURL = process.env.MONGODB_URL?.replace(
      "<PASSWORD>",
      process.env.DB_PASS
    );

    if (!mongoURL) {
      throw new Error("MONGODB_URL environment variable is not defined");
    }

    if (!process.env.DB_PASS) {
      throw new Error("DB_PASS environment variable is not defined");
    }

    console.log("🔄 Connecting to MongoDB...");
    console.log(
      "Connection string (masked):",
      mongoURL.replace(/:[^:@]+@/, ":****@")
    );

    const options = {
      dbName: process.env.DB_NAME || "test",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 20000,
      socketTimeoutMS: 90000,
      family: 4,
    };

    await mongoose.connect(mongoURL, options);

    console.log("✅ MongoDB Connected Successfully");
    console.log("Database:", process.env.DB_NAME || "test");

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB Disconnected");
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    console.error("Full error:", error);

    if (process.env.NODE_ENV !== "production") {
      throw error;
    }
  }
};

export default connectDB;
