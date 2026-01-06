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
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 90000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
