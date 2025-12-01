// course+lessons
import mongoose from "mongoose";

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
      type: String,
      default: "0:00",
    },
  },
  { timestamps: true }
);

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
      type: String,
      required: true,
    },

    lessons: [lessonSchema],

    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;
