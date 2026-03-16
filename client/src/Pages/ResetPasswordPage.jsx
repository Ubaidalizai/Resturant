import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import RestaurantLoader from './RestaurantLoader';
import { toast } from 'react-toastify';
import { useApi } from '../context/ApiContext';
import InputField from "../Components/UI/InputField";
import Button from "../Components/UI/Button";

const ResetPasswordPage = () => {
    const { t } = useTranslation("common");
    const { post } = useApi();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const handleResetPassword = async () => {
        if (!password){
            toast.error(t("PleaseEnterNewPassword"));
            return;
        }
        if(!confirmPassword){
            toast.error(t("PleaseConfirmNewPassword"));
            return;
        }
        if(password !== confirmPassword){
            toast.error(t("PasswordsDoNotMatch"));
            return;
        }
        if(password.length < 7){
            toast.error(t("PasswordLengthRequirement"));
            return;
        }
        try {
            setLoading(true);
            // Extract token from URL
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");
            if (!token) {
                toast.error(t("InvalidOrExpiredResetLink"));
                return;
            }
            const res = await post(`/api/v1/user/reset-password`, { password, token });
            if (res.data.success) {
                toast.success(res.data.message || t("PasswordResetSuccessful"));
                setTimeout(() => {
                    window.location.href = "/"; // Redirect to login page after success
                }, 2000);
            } else {
                toast.error(res.data.message || t("FailedToResetPassword"));
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || t("AnErrorOccurred"));
        } finally {
            setLoading(false);
        }
    }
    return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {loading && (
        <RestaurantLoader message={t("ChangingPassword", { defaultValue: "Changing password..." })} />
      )}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-10 relative">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30"></div>

        <h1 className="text-center text-4xl sm:text-4xl font-extrabold text-yellow-600 mb-8">
          {t("ResetPassword", { defaultValue: "Reset Password" })}
        </h1>

        <div className="flex flex-col space-y-6">
          <InputField
            type="password"
            placeholder={t("NewPassword", { defaultValue: "New Password" })}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-yellow-600 rounded-xl px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          />
          <InputField
            type="password"
            placeholder={t("ConfirmPassword", { defaultValue: "Confirm Password" })}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border-2 border-yellow-600 rounded-xl px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          />
          <Button
            onClick={handleResetPassword}
            className="w-full"
          >
            {t("ResetPasswordButton", { defaultValue: "Reset the Password" })}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage