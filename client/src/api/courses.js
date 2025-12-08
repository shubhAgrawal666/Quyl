import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true, 
});

export const enrollCourse =(slug) => API.post("/courses/enroll",{slug});
export const getAllCourses = () => API.get("/courses");
export const getEnrolledCourses = () => API.get("/courses/my/enrolled");
export const getCourseBySlug = (slug) =>
  API.get(`/courses/${slug}`);

export const getProgress = (slug) =>
  API.get(`/courses/progress/${slug}`);

export const markLessonComplete = (slug, lessonIndex) => {
  return API.post(`/courses/toggleLesson`, {slug, lessonIndex });
};
