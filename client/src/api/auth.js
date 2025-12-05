import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

export const registerUser = (data) => API.post("/auth/register", data);
export const verifyEmail = (data) => API.post("/auth/verify-email", data);
export const resendOtp = (data) => API.post("/auth/resend-otp", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const sendResetOtp = (data) => API.post("/auth/send-reset-otp", data);
export const resetPassword = (data) => API.post("/auth/reset-password", data);

export default API;
