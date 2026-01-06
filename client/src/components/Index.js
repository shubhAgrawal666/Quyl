// src/components/Index.js

// AUTH
import Signup from "./Auth/Signup.jsx";
import Login from "./Auth/Login.jsx";
import Verify from "./Auth/Verify.jsx";
import Profile from "./Auth/Profile.jsx";
import ForgotPassword from "./Auth/ForgotPassword.jsx";

// USER SIDE COMPONENTS
import Header from "./header/Header.jsx";
import Home from "./home/Home.jsx";
import MyCourses from "./myCourses/MyCourses.jsx";
import AllCourses from "./courses/AllCourses.jsx";
import CourseDetails from "./courses/CourseDetails.jsx";
import Footer from "./footer/Footer.jsx";
// ADMIN COMPONENTS
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminRoute from "./admin/AdminRoute.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import CoursesList from "./admin/CoursesList.jsx";
import CreateCourse from "./admin/CreateCourse.jsx";
import EditCourse from "./admin/EditCourse.jsx";
import ManageUsers from "./admin/ManageUsers.jsx";

// EXPORT ALL COMPONENTS
export {
  Signup,
  Login,
  ForgotPassword,
  Verify,
  Profile,
  Header,
  Footer,
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
};
