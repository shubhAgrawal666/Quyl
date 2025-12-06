import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getDashboardStats,
  toggleUserVerification,
  getUserById,
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/dashboard-stats", authMiddleware, isAdmin, getDashboardStats);
router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.get("/user/:id", authMiddleware, isAdmin, getUserById);
router.put("/update-role", authMiddleware, isAdmin, updateUserRole);
router.put(
  "/toggle-verification",
  authMiddleware,
  isAdmin,
  toggleUserVerification
);
router.delete("/delete-user/:id", authMiddleware, isAdmin, deleteUser);

export default router;
