import React, { useState } from 'react'
import RestaurantLoader from './RestaurantLoader';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseURL } from '../configs/baseURL.config';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const handleResetPassword = async () => {
        if (!password){
            toast.error("Please enter a new password");
            return;
        }
        if(!confirmPassword){
            toast.error("Please confirm your new password");
            return;
        }
        if(password !== confirmPassword){
            toast.error("Passwords do not match");
            return;
        }
        if(password.length < 7){
            toast.error("Password must be at least 7 characters long");
            return;
        }
        try {
            setLoading(true);
            // Extract token from URL
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");
            if (!token) {
                toast.error("Invalid or expired reset link");
                return;
            }
            const res = await axios.post(`${baseURL}/api/v1/user/reset-password`, { password, token });
            if (res.data.success) {
                toast.success(res.data.message || "Password reset successful");
                setTimeout(() => {
                    window.location.href = "/"; // Redirect to login page after success
                }, 2000);
            } else {
                toast.error(res.data.message || "Failed to reset password");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    }
    return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {loading && <RestaurantLoader message="Changing password..." />}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-10 relative">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30"></div>

        <h1 className="text-center text-4xl sm:text-4xl font-extrabold text-yellow-600 mb-8">
          Reset Password
        </h1>

        <div className="flex flex-col space-y-6">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-yellow-600 rounded-xl px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border-2 border-yellow-600 rounded-xl px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          />
          <button
            onClick={handleResetPassword}
            className="w-full bg-yellow-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-yellow-400 transition-transform transform hover:scale-105"
          >
            Reset the Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage