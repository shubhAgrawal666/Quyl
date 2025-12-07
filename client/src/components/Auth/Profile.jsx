import React, { useEffect, useState } from "react";
import { sendResetOtp, resetPassword, logoutUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
export default function Profile() {
  const navigate = useNavigate();

  // 👉 Replace this with your real user data (from context / login response)
  const [user, setUser] = useState({ name: "username", email: "email" });

  // Example: if you store user in localStorage after login
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const [resetStep, setResetStep] = useState(1); // 1 = request OTP, 2 = enter OTP+new pass
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const {logout} = useAuth();

  // 🔹 logout handler
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // 🔹 step 1: send reset OTP
  const handleSendResetOtp = async (e) => {
  e.preventDefault();
  setErr("");
  setMsg("");

  const emailToUse = user.email;

  setLoading(true);
  try {
    const res = await sendResetOtp({ email: emailToUse });
    if (!res.data.success) {
      setErr(res.data.message || "Failed to send OTP");
      setLoading(false);
      return;
    }
    setMsg("OTP sent to your email");
    setResetStep(2);
  } catch {
    setErr("Failed to send OTP");
  } finally {
    setLoading(false);
  }
};


  // 🔹 step 2: reset password
  const handleResetPassword = async (e) => {
  e.preventDefault();
  setErr("");
  setMsg("");

  if (!otp || !newPassword) {
    setErr("All fields are required");
    return;
  }

  const emailToUse = user.email;

  setLoading(true);
  try {
    const res = await resetPassword({
      email: emailToUse,
      otp,
      newPassword,
    });

    if (!res.data.success) {
      setErr(res.data.message);
      setLoading(false);
      return;
    }

    setMsg("Password changed successfully");
    await logoutUser();
    localStorage.removeItem("user");
    navigate("/login");
  } catch {
    setErr("Failed to reset password");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-50">
      <div className="rounded-2xl shadow-xl bg-white border border-gray-300 w-[420px] p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800 tracking-wide">
          Profile
        </h1>

        {/* messages */}
        {err && (
          <p className="text-red-600 text-center font-semibold mb-2">
            {err}
          </p>
        )}
        {msg && (
          <p className="text-green-600 text-center font-semibold mb-2">
            {msg}
          </p>
        )}

        {/* user info */}
        <div className="font-sans tracking-wide space-y-3 mb-6">
          <div>
            <label className="font-semibold text-gray-700">Username</label>
            <input
              type="text"
              value={user.name}
              readOnly
              className="mt-1 rounded-lg border border-gray-300 w-full p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Email</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="mt-1 rounded-lg border border-gray-300 w-full p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>
        </div>

        {/* reset password section */}
        <div className="border-t border-gray-200 pt-4 mt-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Reset Password
          </h2>

          {resetStep === 1 && (
            <form className="space-y-3" onSubmit={handleSendResetOtp}>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white p-2 rounded-lg font-semibold tracking-wider hover:bg-blue-700 transition-all shadow-md disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Send Reset OTP"}
              </button>
            </form>
          )}

          {resetStep === 2 && (
            <form className="space-y-3" onSubmit={handleResetPassword}>
              <div>
                <label className="font-semibold text-gray-700">OTP</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-1 rounded-lg border border-gray-400 w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 rounded-lg border border-gray-400 w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white p-2 rounded-lg font-semibold tracking-wider hover:bg-blue-700 transition-all shadow-md disabled:opacity-60"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setResetStep(1);
                  setOtp("");
                  setNewPassword("");
                  setMsg("");
                  setErr("");
                }}
                className="w-full bg-gray-200 text-gray-800 p-2 rounded-lg font-semibold tracking-wider hover:bg-gray-300 transition-all shadow-md"
              >
                Back to Send OTP
              </button>
            </form>
          )}
        </div>

        {/* logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-5 bg-red-500 text-white p-2 rounded-lg font-semibold tracking-wider hover:bg-red-600 transition-all shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
