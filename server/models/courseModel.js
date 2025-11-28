// course+lessons
import mongoose from "mongoose";

// LESSON SCHEMA
const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    youtubeUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: String, // Example: "10:25"
      default: "0:00",
    }
  },
  { timestamps: true }
);

// COURSE SCHEMA
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String, // store image URL
      required: true,
    },

    lessons: [lessonSchema], // Embedded array of lessons

    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin ID
      required: true,
    },
  },
  { timestamps: true }
);
const Course =mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;