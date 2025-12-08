
import express from "express";
import {
  createCourse,
  getCourses,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
  addLesson,
  updateLesson,
  deleteLesson,
  enrollCourse,
  markLessonComplete,
  getProgress,
  getEnrolledCourses,
} from "../controllers/courseController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.get("/", getCourses);
router.post("/create", authMiddleware, isAdmin, createCourse);
router.put("/update/:slug", authMiddleware, isAdmin, updateCourse);
router.delete("/delete/:slug", authMiddleware, isAdmin, deleteCourse);
router.post("/:slug/lessons/add", authMiddleware, isAdmin, addLesson);
router.put("/:slug/lessons/:lessonSlug", authMiddleware, isAdmin, updateLesson);
router.delete("/:slug/lessons/:lessonSlug",authMiddleware,isAdmin,deleteLesson);
router.post("/enroll", authMiddleware, enrollCourse);
router.post("/toggleLesson", authMiddleware,markLessonComplete);
router.get("/progress/:slug", authMiddleware, getProgress);
router.get("/my/enrolled", authMiddleware, getEnrolledCourses);
router.get("/:slug", getCourseBySlug);

export default router;
