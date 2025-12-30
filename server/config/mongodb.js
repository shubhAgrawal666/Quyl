import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoURL = process.env.MONGODB_URL.replace(
      "<PASSWORD>",
      process.env.DB_PASS
    );
    if (!mongoURL) {
      throw new Error("MONGODB_URL not defined");
    }

    cached.promise = mongoose
      .connect(mongoURL, {
        dbName: process.env.DB_NAME || "test",
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB connected");
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
