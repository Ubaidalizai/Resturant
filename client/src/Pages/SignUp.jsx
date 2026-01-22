import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemsContext } from "../App";
import { toast } from "react-toastify";
import RestaurantLoader from'./RestaurantLoader';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, setIsAuth } = useContext(ItemsContext);
  const navigate = useNavigate();
  
  const handleLogin = () => {
 
    if (username === '' || password === '') {
      toast.warn('Please fill the blanks');
      return;
    }


    if (username !== login.userName || password !== login.password) {
      toast.error('Invalid Username or Password');
      return;
    }


    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsAuth(true);
      toast.success('Welcome Back!');
      navigate('/admin');
    }, 2000); 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      {loading && <RestaurantLoader message="Logging in..." />}

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
