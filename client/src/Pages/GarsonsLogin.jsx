import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemsContext } from "../App";
import { toast } from "react-toastify";
import RestaurantLoader from './RestaurantLoader';
import axios from "axios";
import KitchenPanel from "../Kitchen/KitchenPanel";
import { baseURL } from "../configs/baseURL.config";

function LoginForm() {
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

    const response = await axios.post(
      `${baseURL}/api/v1/user/login`,
      { email, password }
    );

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


    if (user.name.toLowerCase() === "admin") {
      navigate("/admin");
    } else if (user.name.toLowerCase() === "chef") {
      navigate("/kitchen");
    } else if (user.name.toLowerCase() === "garson") {
      navigate("/menus");
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


return ( <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
{loading && <RestaurantLoader message="Logging in..." />} <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-10 relative"> <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30"></div> <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30"></div>


    <h1 className="text-center text-4xl sm:text-4xl font-extrabold text-yellow-600 mb-8">
      Welcome
    </h1>

    <div className="flex flex-col space-y-6">
      <input
        type="text"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border-2 border-yellow-600 rounded-xl px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border-2 border-yellow-600 rounded-xl px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
      />

      <button
        onClick={handleLogin}
        className="w-full bg-yellow-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-yellow-400 transition-transform transform hover:scale-105"
      >
        Login
      </button>
    </div>
  </div>
</div>


);
}

export default LoginForm;
