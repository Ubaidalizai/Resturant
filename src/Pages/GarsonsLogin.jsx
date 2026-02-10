import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemsContext } from "../App";
import { toast } from "react-toastify";
import RestaurantLoader from './RestaurantLoader';
import axios from "axios";


function GarsonLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

   const { setIsAuth } = useContext(ItemsContext);
   const navigate = useNavigate();



  const handleLogin = async () => {
    if (username === '' || password === '') {
      toast.warn('Please fill in both fields');
      return;
    }

    try {
      setLoading(true); 

      // ✅ Correct Garson login API
      const response = await axios.post('http://localhost:4000/api/v1/user/login/', {
        email: username,
        password: password
      });

      if (response.data.success) {
        setIsAuth(true); // Update auth context
        toast.success(response.data.message || 'Welcome Back!');
        navigate('/menus'); // Navigate to menus page
      } else {
        toast.error(response.data.message || 'Invalid Username or Password');
      }

    } catch (err) {
      console.error(err);

      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(response.data.message || 'An error occurred during login');
      }
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
          Welcome Garson
        </h1>

        <div className="flex flex-col space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

export default GarsonLogin;
