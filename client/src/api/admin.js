// src/api/admin.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api",
  withCredentials: true,
});

// Courses
export const createCourse = (payload) => API.post("/admin/course", payload);
export const updateCourse = (courseId, payload) => API.put(`/admin/course/${courseId}`, payload);
export const deleteCourse = (courseId) => API.delete(`/admin/course/${courseId}`);
export const getAdminCourses = () => API.get("/admin/courses");

// Lessons
export const addLesson = (courseId, payload) =>
  API.post(`/admin/course/${courseId}/lesson`, payload);
export const deleteLesson = (courseId, lessonId) =>
  API.delete(`/admin/course/${courseId}/lesson/${lessonId}`);
