import React, { useState } from "react";
import { sendResetOtp, resetPassword } from "../../api/auth.js";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = email, 2 = otp + new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // STEP 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);

    try {
      await sendResetOtp({ email });
      setMsg("OTP has been sent to your email.");
      setStep(2);
    } catch (error) {
        console.log(error.response);
setErr(error.response?.data?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        email,
        otp,
        newPassword,
      });

      setMsg("Password reset successful. You can now login.");
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErr(error.response?.data?.message || "Invalid OTP or something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover px-4">
      <div
        className="
          rounded-2xl shadow-xl bg-white border border-gray-300
          w-full max-w-[420px]
          p-6 sm:p-7
        "
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-800">
          Reset Password
        </h1>

        <p className="text-center text-gray-600 text-sm sm:text-base mb-4">
          {step === 1
            ? "Enter your email to receive OTP"
            : "Enter OTP and set new password"}
        </p>

        {err && (
          <p className="text-red-600 text-center mb-2 text-sm sm:text-base">
            {err}
          </p>
        )}

        {msg && (
          <p className="text-green-600 text-center mb-2 text-sm sm:text-base">
            {msg}
          </p>
        )}

        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <form className="space-y-4" onSubmit={handleSendOtp}>
            <div>
              <label className="font-semibold text-gray-700 text-sm sm:text-base">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 rounded-lg border w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-3 bg-blue-600 text-white p-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2: OTP + NEW PASSWORD */}
        {step === 2 && (
          <form className="space-y-4" onSubmit={handleResetPassword}>
            <div>
              <label className="font-semibold text-gray-700 text-sm sm:text-base">
                OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 rounded-lg border w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 text-sm sm:text-base">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 rounded-lg border w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 text-sm sm:text-base">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 rounded-lg border w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-3 bg-blue-600 text-white p-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
