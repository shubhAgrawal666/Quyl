import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Progress from "../models/ProgressModel.js";
import generateToken from "../utils/generateToken.js";
import transporter from "../config/nodemailer.js";
import connectDB from "../config/mongodb.js";
import "dotenv/config";

export const getAllUsers = async (req, res) => {
  try {
    await connectDB();
    const users = await User.find()
      .select("name email role createdAt isVerified")
      .lean();

    const progresses = await Progress.find().lean();

    const courses = await Course.find().select("title lessons").lean();

    const courseMap = {};
    courses.forEach((c) => {
      courseMap[c._id] = { title: c.title, totalLessons: c.lessons.length };
    });

    const progressByUser = {};
    progresses.forEach((p) => {
      if (!progressByUser[p.userId]) {
        progressByUser[p.userId] = [];
      }
      progressByUser[p.userId].push(p);
    });

    const enrichedUsers = users.map((user) => {
      const userProgress = progressByUser[user._id] || [];

      const enrolledCourses = userProgress.map((p) => {
        const courseInfo = courseMap[p.courseId] || {
          title: "Unknown Course",
          totalLessons: 0,
        };

        const total = courseInfo.totalLessons;
        const done = p.completedLessons.length;

        const progressPercent =
          total > 0 ? Math.round((done / total) * 100) : 0;

        return {
          courseId: p.courseId,
          courseTitle: courseInfo.title,
          progress: progressPercent,
        };
      });

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        registeredAt: user.createdAt,
        isVerified: user.isVerified,
        enrolledCourses,
      };
    });

    return res.json({
      success: true,
      users: enrichedUsers,
    });
  } catch (err) {
    console.error("ADMIN GET USERS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load users",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(id)
      .select("-password -otp -otpExpires -resetOtp -resetOtpExpires")
      .populate("enrolledCourses", "title category thumbnail");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const progress = await Progress.find({ userId: user._id }).populate(
      "courseId",
      "title"
    );

    res.status(200).json({
      success: true,
      user,
      progress,
    });
  } catch (error) {
    console.error("Get user by id error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    await connectDB();
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: "User ID and role are required",
      });
    }

    if (!["student", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'student' or 'admin'",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.user._id.toString() === userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.user._id.toString() === id) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    await Course.updateMany(
      { studentsEnrolled: user._id },
      { $pull: { studentsEnrolled: user._id } }
    );

    await Progress.deleteMany({ userId: user._id });

    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    await connectDB();
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalCourses = await Course.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const allUsers = await User.find({}, "enrolledCourses");
    const totalEnrollments = allUsers.reduce(
      (sum, u) => sum + (u.enrolledCourses?.length || 0),
      0
    );

    const recentEnrollments = await Progress.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const popularCourses = await Course.find()
      .sort({ studentsEnrolled: -1 })
      .limit(5)
      .select("title category studentsEnrolled thumbnail");

    res.status(200).json({
      success: true,
      totalUsers,
      totalStudents,
      totalAdmins,
      totalCourses,
      totalEnrollments,
      verifiedUsers,
      recentEnrollments,
      popularCourses,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

export const toggleUserVerification = async (req, res) => {
  try {
    await connectDB();
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (req.user._id.toString() === userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot change your own Verification Status",
      });
    }
    user.isVerified = !user.isVerified;
    if (!user.isVerified && user.role === "admin") {
      user.role = "student";
    }
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${
        user.isVerified ? "verified" : "unverified"
      } successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Toggle user verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user verification status",
    });
  }
};
