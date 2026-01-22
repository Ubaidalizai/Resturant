import { useNavigate } from "react-router-dom";
import { useState } from "react";
import background from "../images/willcome.jpg";
import RestaurantLoader from'./RestaurantLoader';

function Welcome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleOrderNow = () => {
    setLoading(true);

    setTimeout(() => {
      navigate("/menus");
    }, 2000); 
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <title>Welcome</title>

      {loading && <RestaurantLoader />}

     
      <img
        src={background}
        alt="Restaurant Background"
        className="absolute inset-0 w-full h-full object-cover blur-[2px] scale-105"
      />

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 space-y-6">
        <h1 className="text-5xl md:text-8xl font-extrabold text-white">
          Welcome
        </h1>

        <p className="text-xl md:text-3xl text-gray-200">
          Experience the Taste of Real Food
        </p>

        <button
          onClick={handleOrderNow}
          className="mt-4 bg-yellow-600 text-white font-bold px-8 py-4 rounded-full text-lg shadow-xl animate-bounce hover:shadow-amber-300 scale-105 transition-all duration-300"
        >
          Order Now
        </button>

        <button
          onClick={() => navigate("/login")}
          className="text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Welcome;
