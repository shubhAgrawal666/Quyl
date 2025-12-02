import express from "express";
import {
  createAdmin,
  adminLogin,
  adminLogout,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getDashboardStats,
  toggleUserVerification,
  getUserByEmail,
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/create-admin", createAdmin);
router.post("/login", adminLogin);
router.post("/logout", adminLogout);
router.get("/dashboard-stats", authMiddleware, isAdmin, getDashboardStats);
router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.get("/user/:email", authMiddleware, isAdmin, getUserByEmail);
router.put("/update-role", authMiddleware, isAdmin, updateUserRole);
router.put("/toggle-verification", authMiddleware, isAdmin, toggleUserVerification);
router.delete("/delete-user/:email", authMiddleware, isAdmin, deleteUser);


export default router;
