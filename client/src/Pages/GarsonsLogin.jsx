import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ItemsContext } from "../App";
import { toast } from "react-toastify";
import RestaurantLoader from './RestaurantLoader';
import { useApi } from '../context/ApiContext';
import InputField from "../Components/UI/InputField";
import Button from "../Components/UI/Button";

function LoginForm() {
  const { post } = useApi();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsAuth } = useContext(ItemsContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.warn("Please fill in both fields");
      return;
    }

    try {
      setLoading(true);

      // No need to add `withCredentials` here, it is global now
      const response = await post("/api/v1/user/login", { email, password }, { withCredentials: true });

      console.log("SERVER RESPONSE:", response.data);

      if (!response.data.success) {
        toast.error(response.data.message || "Invalid Email or Password");
        return;
      }

      const user = response.data.data.user;
      if (!user) {
        toast.error("User not returned from server");
        return;
      }

      setIsAuth(true);
      toast.success("Login Successful");

      // Get array of permission keys
      const permissionKeys = user.permissions || [];

      // Define dashboard priorities
      const adminKeys = ['admin_access', 'add_user', 'update_user', 'delete_user', 'add_role', 'update_role', 'delete_role', 'add_table', 'add_menu'];
      const garsonKeys = ['order_food', 'garson_access'];
      const kitchenKeys = ['kitchen_access'];

      if (permissionKeys.some(p => adminKeys.includes(p))) {
        navigate("/admin");
      } else if (permissionKeys.some(p => garsonKeys.includes(p))) {
        navigate("/garson-dashboard");
      } else if (permissionKeys.some(p => kitchenKeys.includes(p))) {
        navigate("/kitchen");
      } else {
        toast.error("No dashboard assigned to this account");
        setIsAuth(false);
      }

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
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
          Welcome
        </h1>

        <div className="flex flex-col space-y-6">
          <InputField
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-yellow-600 rounded-xl px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-yellow-600 rounded-xl px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          />
          <div className="text-center">
            <Link to="/forgot-password" className="text-yellow-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;