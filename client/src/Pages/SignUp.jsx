import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemsContext } from "../App";
import { toast } from "react-toastify";
import RestaurantLoader from'./RestaurantLoader';
import axios from 'axios'
function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const { login, setIsAuth } = useContext(ItemsContext);
  const navigate = useNavigate();
  

  const handleLogin = async () => {
  
  

    setLoading(true);
    try {
      axios.post('http://localhost:4000/api/v1/admin/login', {
      "email": username,
      "password": password
    }).then((response) => {
      if (response.data.success) {
        console.log(response.data);
        toast.success(response.data.message);
        setIsAuth(true);
        navigate('/admin'); 
      }}).catch((error) => {
     return setErr(error.response.data.message);
    });
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      {/* {loading && <RestaurantLoader message="Logging in..." />} */}

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-10 relative">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30"></div>

        <h1 className="text-center text-4xl sm:text-5xl font-extrabold text-yellow-600 mb-8">
          Welcome Admin
        </h1>

        <div className="flex flex-col space-y-6">
          <input
            type="text"
            placeholder="Username: afghan"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border-2 border-yellow-600 rounded-xl px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          />
          <input
            type="password"
            placeholder="Password: 123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-yellow-600 rounded-xl px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          />
          {err && <p className="text-red-500 text-sm text-center">{err}</p>}
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

export default SignUp;
