import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { ItemsContext } from "../App";
import { toast } from "react-toastify";
import RestaurantLoader from "./RestaurantLoader";
import { useApi } from "../context/ApiContext";
import InputField from "../Components/UI/InputField";
import Button from "../Components/UI/Button";
import { useTranslation } from "../../node_modules/react-i18next";
import { getTranslatedServerMessage } from "../utils/serverMessageTranslator";

function LoginForm() {
  const { post } = useApi();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { setIsAuth, setUser } = useContext(ItemsContext);
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  const handleLogin = async () => {
    const newErrors = {};
    if (!email) newErrors.email = t("PleaseEnterYourEmail", { defaultValue: "Please enter your email" });
    if (!password) newErrors.password = t("PleaseFillBothFields", { defaultValue: "Please enter password" });
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      setLoading(true);
      const response = await post("/api/v1/user/login", { email, password }, { withCredentials: true });
      if (!response.data.success) {
        toast.error(getTranslatedServerMessage(response.data.message, t) || t("InvalidEmailOrPassword"));
        return;
      }
      const user = response.data.data.user;
      if (!user) {
        toast.error(t("UserNotReturnedFromServer"));
        return;
      }
      setIsAuth(true);
      setUser(user);
      toast.success(getTranslatedServerMessage(response.data.message, t) || t("LoginSuccessful"));

      const permissionKeys = user.permissions || [];
      const adminKeys = ["admin_access", "table_access", "panel_access"];
      const garsonKeys = ["order_food", "garson_access", "table_access"];
      const kitchenKeys = ["kitchen_access"];

      if (permissionKeys.some((p) => adminKeys.includes(p))) navigate("/admin");
      else if (permissionKeys.some((p) => garsonKeys.includes(p))) navigate("/menus");
      else if (permissionKeys.some((p) => kitchenKeys.includes(p))) navigate("/kitchen");
      else {
        toast.error(t("NoDashboardAssigned"));
        setIsAuth(false);
      }
    } catch (err) {
      toast.error(getTranslatedServerMessage(err.response?.data?.message, t) || t("LoginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center px-4">
      {loading && <RestaurantLoader message={t("LoggingIn")} />}
      <div className="w-full max-w-md erp-panel p-8">
        <h1 className="erp-page-title text-center mb-6">{t("Login")}</h1>
        <p className="erp-page-subtitle text-center mb-6">{t("RestaurantManagement", { defaultValue: "Hotel & Restaurant Management System" })}</p>

        <div className="space-y-1">
          <InputField
            type="text"
            label={t("EmailAddress", { defaultValue: "Email Address" })}
            placeholder={t("EmailAddress", { defaultValue: "Email Address" })}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <div className="form-field">
            <label className="erp-label">{t("Password", { defaultValue: "Password" })}</label>
            <div className="password-field-wrap">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("Password", { defaultValue: "Password" })}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`erp-input ${errors.password ? "erp-input-error" : ""}`}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? t("HidePassword") : t("ShowPassword")}
              >
                {showPassword ? <HiOutlineEyeSlash size={20} /> : <HiOutlineEye size={20} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>
          <div className="text-center py-2">
            <Link to="/forgot-password" className="text-sm text-blue-700 hover:underline">
              {t("ForgotPassword", { defaultValue: "Forgot Password?" })}
            </Link>
          </div>
          <Button onClick={handleLogin} variant="primary" className="w-full mt-2">
            {t("Login")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
