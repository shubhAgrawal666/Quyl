
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true, 
});

export const enrollCourse = async (courseId) => {
  return axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/course/enroll`,
    { courseId },
    { withCredentials: true }
  );
};

export const getEnrolledCourses = () => API.get("/courses/my/enrolled");
