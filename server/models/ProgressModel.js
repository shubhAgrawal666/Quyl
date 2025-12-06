import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    completedLessons: [
      {
        lessonSlug: {
          type: String,
          required: true,
        },
        lessonIndex: {
          type: Number,
          required: true,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },

    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

progressSchema.methods.updateCompletionPercentage = function (totalLessons) {
  if (totalLessons > 0) {
    this.completionPercentage = Math.round(
      (this.completedLessons.length / totalLessons) * 100
    );
  }
  return this.completionPercentage;
};

const Progress =
  mongoose.models.Progress || mongoose.model("Progress", progressSchema);

export default Progress;
