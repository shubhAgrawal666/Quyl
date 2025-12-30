import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ Database Connected Successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Database Connection Error:", err);
    });

    const mongoURL = process.env.MONGODB_URL.replace(
      "<PASSWORD>",
      process.env.DB_PASS
    );

    await mongoose.connect(mongoURL, {
      dbName: process.env.DB_NAME || "test",
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);

    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
};

export default connectDB;
