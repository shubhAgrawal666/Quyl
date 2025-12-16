import React, { useState } from "react";
import { registerUser } from "../../api/auth"; 
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        name,
        email,
        password,
        adminKey, // optional
      });

      if (!response.data.success) {
        setError(response.data.message);
        setLoading(false);
        return;
      }

      const userId = response.data.userId;
      navigate(`/verify?userId=${userId}`);

    } catch (err) {
      err
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center bg-cover">
        <div className="rounded-2xl shadow-xl bg-white border border-gray-300 h-[480px] w-[420px] p-6">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-800 tracking-wide">
            Create Account
          </h1>

          {error && (
            <p className="text-red-600 text-center font-semibold mb-2">
              {error}
            </p>
          )}

          <form className="font-sans tracking-wide space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="font-semibold text-gray-700">Enter Username</label>
              <input
                type="text"
                placeholder="Username"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 rounded-lg border border-gray-400 w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

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

            <div>
              <label className="font-semibold text-gray-700">Enter Admin Key</label>
              <input
                type="text"
                placeholder="Optional"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="mt-1 rounded-lg border border-gray-400 w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-3 bg-blue-600 text-white p-2 rounded-lg font-semibold tracking-wider hover:bg-blue-700 transition-all shadow-md"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

        </div>
      </div>
    </>
  );
}
