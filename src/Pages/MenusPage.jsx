import { Link } from "react-router-dom";
import { FaGlassMartiniAlt } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faPizzaSlice } from "@fortawesome/free-solid-svg-icons";

function MenusPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <title>Menus Page</title>

      <h1 className="text-yellow-600 font-extrabold text-5xl sm:text-6xl text-center mb-16 drop-shadow-lg">
        Choose Your Favorite Menu
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">

        {/* Breakfast Card */}
        <Link
          to="/breakfast"
          className="relative flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold text-3xl py-12 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-yellow-500/60 hover:-translate-y-2 hover:shadow-lg"
        >
          <FontAwesomeIcon 
            icon={faCoffee} 
            className="text-6xl mb-4" 
          />
          Breakfast
        </Link>

        {/* Lunch & Dinner Card */}
        <Link
          to="/lunch"
          className="relative flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold text-3xl py-12 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-yellow-500/60 hover:-translate-y-2 hover:shadow-lg"
        >
          <FontAwesomeIcon 
            icon={faPizzaSlice} 
            className="text-6xl mb-4" 
          />
          Lunch & Dinner
        </Link>

        {/* Drinks Card */}
        <Link
          to="/drinks"
          className="relative flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold text-3xl py-12 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-yellow-500/60 hover:-translate-y-2 hover:shadow-lg"
        >
          <FaGlassMartiniAlt 
            className="text-6xl mb-4" 
          />
          Drinks
        </Link>

      </div>
    </div>
  );
}

export default MenusPage;
