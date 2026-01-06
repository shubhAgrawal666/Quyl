import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import generateToken from "../utils/generateToken.js";
import connectDB from "../config/mongodb.js";
import "dotenv/config";

export const register = async (req, res) => {
  const { name, email, password, adminKey } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User Already Exists!" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role =
      adminKey === process.env.ADMIN_SECRET_KEY ? "admin" : "student";

    const otp = String(Math.floor(Math.random() * 900000 + 100000));
    const otpExpires = Date.now() + 10 * 60 * 1000;

    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
      role,
    });

    await user.save();

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Verify Your Email - OTP",
      html: `
        <h2>Welcome ${name}!</h2>
        <p>Your OTP for email verification is:</p>
        <h1 style="color: #4CAF50; font-size: 32px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't create this account, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message:
        "Registration successful! Please verify your email with the OTP sent.",
      userId: user._id,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    await connectDB();
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.json({ success: false, message: "Missing Details!" });
    }

    const user = await User.findById(userId).select("+otp +otpExpires");

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist!" });
    }

    if (user.isVerified) {
      return res.json({ success: false, message: "Email already verified!" });
    }

    if (Date.now() > user.otpExpires) {
      return res.json({ success: false, message: "OTP Expired!" });
    }

    if (otp !== user.otp) {
      return res.json({ success: false, message: "Incorrect OTP!" });
    }

    user.isVerified = true;
    user.otp = "";
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Email Verified Successfully!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const resendOTP = async (req, res) => {
  try {
    await connectDB();
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist!" });
    }

    if (user.isVerified) {
      return res.json({ success: false, message: "Email already verified!" });
    }

    const otp = String(Math.floor(Math.random() * 900000 + 100000));
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "Verify Your Email - New OTP",
      html: `
        <h2>Hello ${user.name}!</h2>
        <p>Your new OTP for email verification is:</p>
        <h1 style="color: #4CAF50; font-size: 32px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "New OTP sent to your email!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist!" });
    }

    if (!user.isVerified) {
      return res.json({
        success: false,
        message: "Please verify your email first",
        userId: user._id,
        needsVerification: true,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect Password" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    await connectDB();
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.user._id).select("name email role");

    if (!user) {
      return res.json({ success: false });
    }

    return res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendResetOtp = async (req, res) => {
  try {
    await connectDB();
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist!" });
    }

    const otp = String(Math.floor(Math.random() * 900000 + 100000));
    const resetOtpExpires = Date.now() + 10 * 60 * 1000;

    user.resetOtp = otp;
    user.resetOtpExpires = resetOtpExpires;
    await user.save();

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      html: `
        <h2>Hello ${user.name}!</h2>
        <p>Your OTP for password reset is:</p>
        <h1 style="color: #4CAF50; font-size: 32px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP Sent to your email!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    await connectDB();
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (newPassword.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const user = await User.findOne({ email }).select(
      "+resetOtp +resetOtpExpires"
    );

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist!" });
    }

    if (!user.resetOtp || user.resetOtp === "") {
      return res.json({
        success: false,
        message: "No OTP request found. Please request a new OTP",
      });
    }

    if (Date.now() > user.resetOtpExpires) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    if (user.resetOtp !== otp) {
      return res.json({ success: false, message: "Incorrect OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpires = undefined;
    await user.save();

    return res.json({
      success: true,
      message: "Password Changed Successfully!",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
