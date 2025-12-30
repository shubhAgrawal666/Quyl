import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "/api",
  withCredentials: true,
});

export const getDashboardStats = () => API.get("/admin/dashboard-stats");

export const getAllUsers = () => API.get("/admin/users");

export const getUserById = (id) => API.get(`/admin/user/${id}`);

export const updateUserRole = (payload) =>
  API.put("/admin/update-role", payload);

export const toggleUserVerification = (payload) =>
  API.put("/admin/toggle-verification", payload);

export const deleteUser = (id) => API.delete(`/admin/delete-user/${id}`);

export const createCourse = (payload) => API.post("/courses/create", payload);

export const updateCourse = (slug, payload) =>
  API.put(`/courses/update/${slug}`, payload);

export const deleteCourse = (slug) => API.delete(`/courses/delete/${slug}`);

export const getAdminCourses = () => API.get("/courses");

export const addLesson = (slug, payload) =>
  API.post(`/courses/${slug}/lessons/add`, payload);

export const updateLesson = (slug, lessonSlug, payload) =>
  API.put(`/courses/${slug}/lessons/${lessonSlug}`, payload);

export const deleteLesson = (slug, lessonSlug) =>
  API.delete(`/courses/${slug}/lessons/${lessonSlug}`);
