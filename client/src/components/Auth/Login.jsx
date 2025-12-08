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
          return navigate(`/verify?userId=${data.userId}`);
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
    <div className="h-screen w-screen flex justify-center items-center bg-cover">
      <div className="rounded-2xl shadow-xl bg-white border border-gray-300 h-[380px] w-[420px] p-6">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Welcome Back
        </h1>

        {err && <p className="text-red-600 text-center mb-2">{err}</p>}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="font-semibold text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 rounded-lg border w-full p-2"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 rounded-lg border w-full p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-3 bg-blue-600 text-white p-2 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
