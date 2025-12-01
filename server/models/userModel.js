import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    otp: { type: String, default: "", select: false },
    otpExpires: { type: Date, select: false },

    isVerified: { type: Boolean, default: false },

    resetOtp: { type: String, default: "", select: false },
    resetOtpExpires: { type: Date, select: false },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
