// frontend/components/ForgotPasswordPage.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import RestaurantLoader from "./RestaurantLoader";
import { useApi } from "../context/ApiContext";
import InputField from "../Components/UI/InputField";
import Button from "../Components/UI/Button";
import { getTranslatedServerMessage } from "../utils/serverMessageTranslator";

const ForgotPasswordPage = () => {
  const { t } = useTranslation("common");
  const { post } = useApi();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      toast.error(t("PleaseEnterYourEmail"));
      return;
    }
    try {
      setLoading(true);
      const res = await post(`/api/v1/user/forgot-password`, { email });
      if (res.data.success) {
        toast.success(getTranslatedServerMessage(res.data.message, t) || t("ResetLinkSent"));
      } else {
        toast.error(getTranslatedServerMessage(res.data.message, t) || t("FailedToSendResetLink"));
      }
    } catch (err) {
      console.error(err);
      toast.error(getTranslatedServerMessage(err.response?.data?.message, t) || t("AnErrorOccurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {loading && (
        <RestaurantLoader message={t("SendingResetLink", { defaultValue: "Sending reset link..." })} />
      )}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-10 relative">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30"></div>

        <h1 className="text-center text-4xl sm:text-4xl font-extrabold text-yellow-600 mb-8">
          {t("ForgotPassword", { defaultValue: "Forgot Password" })}
        </h1>

        <div className="flex flex-col space-y-6">
          <InputField
            type="email"
            placeholder={t("EmailAddress", { defaultValue: "Email Address" })}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-yellow-600 rounded-xl px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          />
          <Button onClick={handleResetPassword} className="w-full">
            {t("SendResetLink", { defaultValue: "Send Reset Link" })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;