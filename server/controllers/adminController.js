import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Progress from "../models/ProgressModel.js";
import generateToken from "../utils/generateToken.js";

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, key } = req.body;

    if (!name || !email || !password || !key) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and admin key are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    if (key !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin secret key. Unauthorized access.",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create admin account",
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await User.findOne({ email, role: "admin" }).select(
      "+password"
    );

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(admin);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role && ["student", "admin"].includes(role)) {
      filter.role = role;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select("-password -otp -otpExpires -resetOtp -resetOtpExpires")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
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
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
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
    const userId = req.params.id;

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
        message: "You cannot delete your own account",
      });
    }

    await Course.updateMany(
      { studentsEnrolled: userId },
      { $pull: { studentsEnrolled: userId } }
    );

    await Progress.deleteMany({ userId });

    await User.findByIdAndDelete(userId);

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
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalCourses = await Course.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentEnrollments = await Progress.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const popularCourses = await Course.find()
      .sort({ studentsEnrolled: -1 })
      .limit(5)
      .select("title category studentsEnrolled thumbnail");

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalAdmins,
        totalCourses,
        verifiedUsers,
        recentEnrollments,
      },
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

    user.isVerified = !user.isVerified;
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
