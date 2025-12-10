// src/main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createRoutesFromElements,
  RouterProvider,
  Route,
  createBrowserRouter,
} from "react-router-dom";

import "./index.css";

import {
  Signup,
  Login,
  Verify,
  Profile,
  Home,
  MyCourses,
  AllCourses,
  CourseDetails,

  // ADMIN
  AdminLayout,
  AdminRoute,
  AdminDashboard,
  CoursesList,
  CreateCourse,
  EditCourse,
  ManageUsers
} from "./components/Index.js";

import Layout from "./components/layout.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* USER SIDE ROUTES */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="verify" element={<Verify />} />
        <Route path="profile" element={<Profile />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="courses" element={<AllCourses />} />
        <Route path="courses/:slug" element={<CourseDetails />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route
        path="admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="courses" element={<CoursesList />} />
        <Route path="courses/new" element={<CreateCourse />} />
        <Route path="courses/:courseId/edit" element={<EditCourse />} />
        <Route path="users" element={<ManageUsers />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
