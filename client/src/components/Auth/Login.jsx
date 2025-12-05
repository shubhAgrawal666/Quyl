import React, { useState } from "react";
import { loginUser } from "../../api/auth"; // adjust the path if needed
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  // state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email || !password) {
      setErr("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({ email, password });

      // If login failed
      if (!response.data.success) {
        // If email is not verified → redirect to verify
        if (response.data.needsVerification) {
          return navigate(`/verify?userId=${response.data.userId}`);
        }

        setErr(response.data.message);
        setLoading(false);
        return;
      }

      // SUCCESS → token saved in cookie automatically
      navigate("/"); // redirect to homepage

    } catch (error) {
      console.log(error);
      setErr("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center bg-cover">
        <div className="rounded-2xl shadow-xl bg-white border border-gray-300 h-[380px] w-[420px] p-6">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-800 tracking-wide">
            Welcome Back
          </h1>

          {/* Error message */}
          {err && (
            <p className="text-red-600 text-center font-semibold mb-2">
              {err}
            </p>
          )}

          <form className="font-sans tracking-wide space-y-4" onSubmit={handleLogin}>

            <div>
              <label className="font-semibold text-gray-700">Enter Email</label>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 rounded-lg border border-gray-400 w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">Enter Password</label>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 rounded-lg border border-gray-400 w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-3 bg-blue-600 text-white p-2 rounded-lg font-semibold tracking-wider hover:bg-blue-700 transition-all shadow-md"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
}
