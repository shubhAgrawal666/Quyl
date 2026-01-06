import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const mongoURL = process.env.MONGODB_URL?.replace(
      "<PASSWORD>",
      process.env.DB_PASS
    );

    if (!mongoURL) throw new Error("MongoDB URL missing");

    mongoose.set("bufferCommands", false);

    cached.promise = mongoose.connect(mongoURL, {
      dbName: process.env.DB_NAME,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
