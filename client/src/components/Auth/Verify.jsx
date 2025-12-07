import React, { useState } from "react";
import { verifyEmail, resendOtp } from "../../api/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Verify() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setResendMessage("");

    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    setLoading(true);
    console.log("Sending to backend:", { userId, otp });
    try {
      const response = await verifyEmail({ userId, otp });

      if (!response.data.success) {
        setError(response.data.message);
        setLoading(false);
        return;
      }

      navigate("/login");

    } catch (err) {
      console.log(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResendMessage("");

    try {
      const response = await resendOtp({ userId });

      if (!response.data.success) {
        setError(response.data.message);
        return;
      }
      
      setResendMessage("OTP sent again to your email!");
      
    } catch (err) {
        console.log(err);
        setError("Could not resend OTP.");
    }
};

console.log("UserID from URL:", userId);
  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center bg-cover">
        <div className="rounded-2xl shadow-xl bg-white border border-gray-300 h-[350px] w-[420px] p-6">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-800 tracking-wide">
            Verify Email
          </h1>

          {error && (
            <p className="text-red-600 text-center font-semibold mb-2">
              {error}
            </p>
          )}

          {resendMessage && (
            <p className="text-green-600 text-center font-semibold mb-2">
              {resendMessage}
            </p>
          )}

          <form className="font-sans tracking-wide space-y-4" onSubmit={handleVerify}>
            <div>
              <label className="font-semibold text-gray-700">
                Enter OTP sent to your email
              </label>
              <input
                type="text"
                placeholder="Enter OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 rounded-lg border border-gray-400 w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-3 bg-blue-600 text-white p-2 rounded-lg font-semibold tracking-wider hover:bg-blue-700 transition-all shadow-md"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          <button
            onClick={handleResend}
            className="w-full mt-3 bg-gray-200 text-gray-800 p-2 rounded-lg font-semibold tracking-wider hover:bg-gray-300 transition-all shadow-md"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </>
  );
}
