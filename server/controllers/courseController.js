import Course from "../models/courseModel.js";
import User from "../models/userModel.js";
import Progress from "../models/ProgressModel.js";

export const createCourse = async (req, res) => {
  try {
    const { title, description, category, thumbnail, lessons } = req.body;

    if (!title || !description || !category || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Title, description, category, and thumbnail are required",
      });
    }

    const course = await Course.create({
      title,
      description,
      category,
      thumbnail,
      lessons: lessons || [],
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

export const getCourses = async (req, res) => {
  try {
    const { category, search } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(filter)
      .populate("createdBy", "name email")
      .select("-lessons")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("studentsEnrolled", "name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { title, description, category, thumbnail } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, category, thumbnail },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await User.updateMany(
      { enrolledCourses: req.params.id },
      { $pull: { enrolledCourses: req.params.id } }
    );

    await Progress.deleteMany({ courseId: req.params.id });

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};

export const addLesson = async (req, res) => {
  try {
    const { title, youtubeUrl, duration } = req.body;

    if (!title || !youtubeUrl) {
      return res.status(400).json({
        success: false,
        message: "Title and YouTube URL are required",
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.lessons.push({ title, youtubeUrl, duration: duration || "0:00" });
    await course.save();

    res.status(201).json({
      success: true,
      message: "Lesson added successfully",
      course,
    });
  } catch (error) {
    console.error("Add lesson error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add lesson",
    });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { title, youtubeUrl, duration } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lesson = course.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    if (title) lesson.title = title;
    if (youtubeUrl) lesson.youtubeUrl = youtubeUrl;
    if (duration !== undefined) lesson.duration = duration;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      course,
    });
  } catch (error) {
    console.error("Update lesson error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update lesson",
    });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lessonIndex = course.lessons.findIndex(
      (l) => l._id.toString() === lessonId
    );

    if (lessonIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    course.lessons.splice(lessonIndex, 1);
    await course.save();

    await Progress.updateMany(
      { courseId, completedLessons: lessonIndex },
      { $pull: { completedLessons: lessonIndex } }
    );

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
      course,
    });
  } catch (error) {
    console.error("Delete lesson error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete lesson",
    });
  }
};

export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (req.user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId },
    });

    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { studentsEnrolled: userId },
    });

    await Progress.create({
      userId,
      courseId,
      completedLessons: [],
    });

    res.status(200).json({
      success: true,
      message: "Successfully enrolled in course",
    });
  } catch (error) {
    console.error("Enroll course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to enroll in course",
    });
  }
};

export const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonIndex } = req.body;
    const userId = req.user._id;

    if (typeof lessonIndex !== "number" || lessonIndex < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson index",
      });
    }

    if (!req.user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled in this course",
      });
    }

    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = await Progress.create({
        userId,
        courseId,
        completedLessons: [lessonIndex],
      });
    } else {
      if (!progress.completedLessons.includes(lessonIndex)) {
        progress.completedLessons.push(lessonIndex);
        await progress.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Lesson marked as complete",
      completedLessons: progress.completedLessons,
    });
  } catch (error) {
    console.error("Mark lesson complete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark lesson as complete",
    });
  }
};

export const getProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(200).json({
        success: true,
        completedLessons: [],
        totalCompleted: 0,
      });
    }

    res.status(200).json({
      success: true,
      completedLessons: progress.completedLessons,
      totalCompleted: progress.completedLessons.length,
    });
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch progress",
    });
  }
};

export const getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "enrolledCourses",
      select: "title description category thumbnail createdAt",
      populate: {
        path: "createdBy",
        select: "name",
      },
    });

    const coursesWithProgress = await Promise.all(
      user.enrolledCourses.map(async (course) => {
        const progress = await Progress.findOne({
          userId: req.user._id,
          courseId: course._id,
        });

        return {
          ...course.toObject(),
          progress: {
            completedLessons: progress?.completedLessons || [],
            totalCompleted: progress?.completedLessons.length || 0,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      count: coursesWithProgress.length,
      courses: coursesWithProgress,
    });
  } catch (error) {
    console.error("Get enrolled courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled courses",
    });
  }
};
