import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import RestaurantLoader from "./RestaurantLoader";
import { useApi } from "../context/ApiContext";
import InputField from "../Components/UI/InputField";
import Button from "../Components/UI/Button";
import { getTranslatedServerMessage } from "../utils/serverMessageTranslator";
//sdafasdf
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
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center px-4">
      {loading && (
        <RestaurantLoader message={t("SendingResetLink", { defaultValue: "Sending reset link..." })} />
      )}
      <div className="w-full max-w-md erp-panel p-8">
        <h1 className="erp-page-title text-center mb-6">
          {t("ForgotPassword", { defaultValue: "Forgot Password" })}
        </h1>
        <p className="erp-page-subtitle text-center mb-6">
          {t("ForgotPasswordSubtitle", { defaultValue: "Enter your email and we'll send you a reset link" })}
        </p>

        <div className="space-y-1">
          <InputField
            type="email"
            label={t("EmailAddress", { defaultValue: "Email Address" })}
            placeholder={t("EmailAddress", { defaultValue: "Email Address" })}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleResetPassword} variant="primary" className="w-full mt-4">
            {t("SendResetLink", { defaultValue: "Send Reset Link" })}
          </Button>
          <div className="text-center pt-4">
            <Link to="/" className="text-sm text-blue-700 hover:underline">
              {t("BackToLogin", { defaultValue: "Back to Login" })}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
