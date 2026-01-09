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
  subject: "Verify Your Email – OTP",
  html: `
    <div style=" padding:40px 0; font-family: Arial, sans-serif;">
      <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

        <!-- Header -->
        <div style="background:linear-gradient(135deg, #2563eb, #7c3aed); padding:24px 32px;">
          <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700;">
            Welcome to Your Platform 🎉
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:32px;">
          <p style="margin:0 0 12px; color:#1f2933; font-size:16px;">
            Hello <strong>${name}</strong>,
          </p>

          <p style="margin:0 0 20px; color:#4b5563; font-size:15px; line-height:1.6;">
            Thank you for creating an account with us. To complete your registration, please verify your email address using the code below.
          </p>

          <!-- OTP Box -->
          <div style="margin:24px 0; padding:20px; background:linear-gradient(135deg, #eff6ff, #f5f3ff); border-radius:12px; text-align:center;">
            <p style="margin:0 0 8px; color:#6b7280; font-size:14px;">
              Your Verification Code
            </p>
            <div style="font-size:32px; font-weight:700; letter-spacing:4px; color:#4f46e5;">
              ${otp}
            </div>
          </div>

          <p style="margin:0 0 12px; color:#4b5563; font-size:14px;">
            This code will expire in <strong>10 minutes</strong>.
          </p>

          <p style="margin:0 0 24px; color:#6b7280; font-size:14px; line-height:1.6;">
            If you did not create this account, you can safely ignore this email.
          </p>

          <p style="margin:0; color:#1f2933; font-size:14px;">
            We’re excited to have you onboard!<br/>
            <strong>Your Platform Team</strong>
          </p>
        </div>
      </div>
    </div>
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
  subject: "Verify Your Email – New OTP",
  html: `
    <div style=" padding:40px 0; font-family: Arial, sans-serif;">
      <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

        <!-- Header -->
        <div style="background:linear-gradient(135deg, #2563eb, #7c3aed); padding:24px 32px;">
          <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700;">
            Email Verification
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:32px;">
          <p style="margin:0 0 12px; color:#1f2933; font-size:16px;">
            Hello <strong>${user.name}</strong>,
          </p>

          <p style="margin:0 0 20px; color:#4b5563; font-size:15px; line-height:1.6;">
            You requested a new verification code. Please use the OTP below to verify your email address.
          </p>

          <!-- OTP Box -->
          <div style="margin:24px 0; padding:20px; background:linear-gradient(135deg, #eff6ff, #f5f3ff); border-radius:12px; text-align:center;">
            <p style="margin:0 0 8px; color:#6b7280; font-size:14px;">
              Your One-Time Password (OTP)
            </p>
            <div style="font-size:32px; font-weight:700; letter-spacing:4px; color:#4f46e5;">
              ${otp}
            </div>
          </div>

          <p style="margin:0 0 12px; color:#4b5563; font-size:14px;">
            This code will expire in <strong>10 minutes</strong>.
          </p>

          <p style="margin:0 0 24px; color:#6b7280; font-size:14px; line-height:1.6;">
            If you did not request this code, you can safely ignore this email.
          </p>

          <p style="margin:0; color:#1f2933; font-size:14px;">
            Regards,<br/>
            <strong>Your Platform Team</strong>
          </p>
        </div>
      </div>
    </div>
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
      subject: "Your Password Reset Code",
      html: `
    <div style=" padding:40px 0; font-family: Arial, sans-serif;">
      <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

        <!-- Header -->
        <div style="background:linear-gradient(135deg, #2563eb, #7c3aed); padding:24px 32px;">
          <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700;">
            Password Reset Request
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:32px;">
          <p style="margin:0 0 12px; color:#1f2933; font-size:16px;">
            Hello <strong>${user.name}</strong>,
          </p>

          <p style="margin:0 0 20px; color:#4b5563; font-size:15px; line-height:1.6;">
            We received a request to reset your password. Please use the verification code below to proceed.
          </p>

          <!-- OTP Box -->
          <div style="margin:24px 0; padding:20px; background:linear-gradient(135deg, #eff6ff, #f5f3ff); border-radius:12px; text-align:center;">
            <p style="margin:0 0 8px; color:#6b7280; font-size:14px;">
              Your One-Time Password (OTP)
            </p>
            <div style="font-size:32px; font-weight:700; letter-spacing:4px; color:#4f46e5;">
              ${otp}
            </div>
          </div>

          <p style="margin:0 0 12px; color:#4b5563; font-size:14px;">
            This code will expire in <strong>10 minutes</strong>.
          </p>

          <p style="margin:0 0 24px; color:#6b7280; font-size:14px; line-height:1.6;">
            If you did not request a password reset, you can safely ignore this email. Your account will remain secure.
          </p>

          <p style="margin:0; color:#1f2933; font-size:14px;">
            Regards,<br/>
            <strong>Your Platform Team</strong>
          </p>
        </div>
      </div>
    </div>
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
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const user = await User.findOne({ email }).select(
      "+resetOtp +resetOtpExpires"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exist!" });
    }

    if (!user.resetOtp || user.resetOtp === "") {
      return res.status(400).json({
        success: false,
        message: "No OTP request found. Please request a new OTP",
      });
    }

    if (Date.now() > user.resetOtpExpires) {
      return res.status(400).json({ success: false, message: "OTP Expired" });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Incorrect OTP" });
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
    return res.status(500).json({ success: false, message: error.message });
  }
};
