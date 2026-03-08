// frontend/components/ForgotPasswordPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import RestaurantLoader from "./RestaurantLoader";
import { baseURL } from "../configs/baseURL.config";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${baseURL}/api/v1/user/forgot-password`, { email });
      if (res.data.success) {
        toast.success(res.data.message || "Reset link sent to your email");
      } else {
        toast.error(res.data.message || "Failed to send reset link");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {loading && <RestaurantLoader message="Sending reset link..." />}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-10 relative">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30"></div>

        <h1 className="text-center text-4xl sm:text-4xl font-extrabold text-yellow-600 mb-8">
          Forgot Password
        </h1>

        <div className="flex flex-col space-y-6">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-yellow-600 rounded-xl px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          />
          <button
            onClick={handleResetPassword}
            className="w-full bg-yellow-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-yellow-400 transition-transform transform hover:scale-105"
          >
            Send Reset Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;