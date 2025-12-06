import mongoose from "mongoose";
import slugify from "slugify";
const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      lowercase: true,
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

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
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

courseSchema.pre("save", async function () {
  if (this.isModified("title") || !this.slug) {
    let baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
      remove: /[*+~.()'"!:@]/g,
    });

    let slug = baseSlug;
    let counter = 1;

    while (
      await mongoose.models.Course.findOne({
        slug,
        _id: { $ne: this._id },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  if (this.isModified("lessons")) {
    this.lessons.forEach((lesson, index) => {
      if (!lesson.slug || lesson.isModified("title")) {
        let baseSlug = slugify(lesson.title, {
          lower: true,
          strict: true,
          trim: true,
          remove: /[*+~.()'"!:@]/g,
        });

        let slug = baseSlug;
        let counter = 1;

        const existingSlugs = this.lessons
          .filter((l, i) => i !== index)
          .map((l) => l.slug);

        while (existingSlugs.includes(slug)) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        lesson.slug = slug;
      }
    });
  }
});

courseSchema.statics.generateSlug = async function (title, excludeId = null) {
  let baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  });

  let slug = baseSlug;
  let counter = 1;

  const query = { slug };
  if (excludeId) query._id = { $ne: excludeId };

  while (await this.findOne(query)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

courseSchema.index({ title: "text", description: "text" });
courseSchema.index({ category: 1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ studentsEnrolled: 1 });

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;
