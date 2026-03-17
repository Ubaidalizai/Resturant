import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ItemsContext } from "../App";
import { toast } from "react-toastify";
import RestaurantLoader from './RestaurantLoader';
import { useApi } from '../context/ApiContext';
import InputField from "../Components/UI/InputField";
import Button from "../Components/UI/Button";
import { useTranslation } from "react-i18next";
import { getTranslatedServerMessage } from "../utils/serverMessageTranslator";
function LoginForm() {
  const { post } = useApi();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsAuth, setUser } = useContext(ItemsContext);
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const handleLogin = async () => {
    if (!email || !password) {
      toast.warn(t("PleaseFillBothFields", { defaultValue: "Please fill in both fields" }));
      return;
    }

    try {
      setLoading(true);

      // No need to add `withCredentials` here, it is global now
      const response = await post("/api/v1/user/login", { email, password }, { withCredentials: true });
      if (!response.data.success) {
        toast.error(getTranslatedServerMessage(response.data.message, t) || t("InvalidEmailOrPassword", { defaultValue: "Invalid Email or Password" }));
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

      // Get array of permission keys
      const permissionKeys = user.permissions || [];
      console.log(user);
      console.log(permissionKeys);
      // Define dashboard priorities
      const adminKeys = ['admin_access', 'table_access', 'panel_access', 'delete_user', 'add_role', 'update_role', 'delete_role', 'add_table', 'add_menu', 'add_food'];
      const garsonKeys = ['order_food', 'garson_access'];
      const kitchenKeys = ['kitchen_access'];

      if (permissionKeys.some(p => adminKeys.includes(p))) {
        navigate("/admin");
      } else if (permissionKeys.some(p => garsonKeys.includes(p))) {
        navigate("/menus");
      } else if (permissionKeys.some(p => kitchenKeys.includes(p))) {
        navigate("/kitchen");
      } else {
        toast.error(t("NoDashboardAssigned", { defaultValue: "No dashboard assigned to this account" }));
        setIsAuth(false);
      }

    } catch (err) {
      console.error(err);
      toast.error(getTranslatedServerMessage(err.response?.data?.message, t) || t("LoginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {loading && <RestaurantLoader message="Logging in..." />}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-10 relative">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30"></div>

        <h1 className="text-center text-4xl sm:text-4xl font-extrabold text-yellow-600 mb-8">
          {t("Login")}
        </h1>

        <div className="flex flex-col space-y-6">
          <InputField
            type="text"
            placeholder={t("EmailAddress", { defaultValue: "Email Address" })}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-yellow-600 rounded-xl px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          />
          <InputField
            type="password"
            placeholder={t("Password", { defaultValue: "Password" })}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-yellow-600 rounded-xl px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          />
          <div className="text-center">
            <Link to="/forgot-password" className="text-yellow-600 hover:underline">
              {t("ForgotPassword", { defaultValue: "Forgot Password?" })}
            </Link>
          </div>
          <Button onClick={handleLogin} className="w-full">
            {t("Login")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;