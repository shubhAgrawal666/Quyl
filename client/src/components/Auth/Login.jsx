import React, { useState } from "react";
import { loginUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      const data = response.data;

      if (!data.success) {
        if (data.needsVerification) {
          navigate(`/verify?userId=${data.userId}`);
          return;
        }
        setErr(data.message);
        return;
      }

      await checkAuth();
      navigate("/");
    } catch {
      setErr("Something went wrong.");
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
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-800">
          Welcome Back
        </h1>

        {err && (
          <p className="text-red-600 text-center mb-2 text-sm sm:text-base">
            {err}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="font-semibold text-gray-700 text-sm sm:text-base">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 rounded-lg border w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 text-sm sm:text-base">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 rounded-lg border w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-3 bg-blue-600 text-white p-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
