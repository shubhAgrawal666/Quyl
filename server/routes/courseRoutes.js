// /api/courses/...
import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addLesson,
  updateLesson,
  deleteLesson,
  enrollCourse,
  markLessonComplete,
  getProgress,
  getEnrolledCourses
} from "../controllers/courseController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/create", authMiddleware, isAdmin, createCourse);
router.put("/update/:id", authMiddleware, isAdmin, updateCourse);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteCourse);
router.post("/:id/lessons/add", authMiddleware, isAdmin, addLesson);
router.put("/:courseId/lessons/:lessonId", authMiddleware, isAdmin, updateLesson);
router.delete("/:courseId/lessons/:lessonId", authMiddleware, isAdmin, deleteLesson);
router.post("/enroll", authMiddleware, enrollCourse);
router.post("/complete-lesson", authMiddleware, markLessonComplete);
router.get("/progress/:courseId", authMiddleware, getProgress);
router.get("/my/enrolled", authMiddleware, getEnrolledCourses);


export default router;
