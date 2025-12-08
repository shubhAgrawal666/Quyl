import React, { useState } from "react";
import { sendResetOtp, resetPassword } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const [resetStep, setResetStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loadingAction, setLoadingAction] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center text-lg font-semibold">
        Loading profile...
      </div>
    );
  }

  
  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center text-lg font-semibold">
        No user found. Please login again.
      </div>
    );
  }

  
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  
  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    setLoadingAction(true);
    try {
      const res = await sendResetOtp({ email: user.email });

      if (!res.data.success) {
        setErr(res.data.message);
      } else {
        setMsg("OTP sent to your email");
        setResetStep(2);
      }
    } catch {
      setErr("Failed to send OTP");
    } finally {
      setLoadingAction(false);
    }
  };

  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!otp || !newPassword) {
      setErr("All fields are required");
      return;
    }

    setLoadingAction(true);
    try {
      const res = await resetPassword({
        email: user.email,
        otp,
        newPassword,
      });

      if (!res.data.success) {
        setErr(res.data.message);
      } else {
        setMsg("Password changed successfully");
      }
    } catch {
      setErr("Failed to update password");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-50">
      <div className="rounded-2xl shadow-xl bg-white border border-gray-300 w-[420px] p-6">

        <h1 className="text-2xl font-bold text-center mb-4">Profile</h1>

        {err && <p className="text-red-600 text-center">{err}</p>}
        {msg && <p className="text-green-600 text-center">{msg}</p>}

        {/* USER INFO */}
        <div className="space-y-3 mb-6">
          <div>
            <label className="font-semibold">Name</label>
            <input
              value={user.name}
              readOnly
              className="mt-1 rounded-lg border w-full p-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="font-semibold">Email</label>
            <input
              value={user.email}
              readOnly
              className="mt-1 rounded-lg border w-full p-2 bg-gray-100"
            />
          </div>
        </div>

        {/* RESET PASSWORD */}
        <div className="border-t border-gray-300 pt-4 mb-4">
          <h2 className="font-semibold mb-2">Reset Password</h2>

          {resetStep === 1 && (
            <form onSubmit={handleSendResetOtp}>
              <button
                type="submit"
                disabled={loadingAction}
                className="w-full bg-blue-600 text-white p-2 rounded-lg"
              >
                {loadingAction ? "Sending..." : "Send Reset OTP"}
              </button>
            </form>
          )}

          {resetStep === 2 && (
            <form className="space-y-3" onSubmit={handleResetPassword}>
              <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border p-2 rounded-lg w-full"
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-2 rounded-lg w-full"
              />

              <button
                type="submit"
                disabled={loadingAction}
                className="w-full bg-blue-600 text-white p-2 rounded-lg"
              >
                {loadingAction ? "Updating..." : "Change Password"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setResetStep(1);
                  setOtp("");
                  setNewPassword("");
                }}
                className="w-full bg-gray-200 text-gray-800 p-2 rounded-lg"
              >
                Back
              </button>
            </form>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white p-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
