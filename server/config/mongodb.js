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

    const options = {
      dbName: process.env.DB_NAME || "test",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongoURL, options);

    console.log("✅ MongoDB Connected Successfully");

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB Disconnected");
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    if (process.env.NODE_ENV !== "production") {
      throw error;
    }
  }
};

export default connectDB;
