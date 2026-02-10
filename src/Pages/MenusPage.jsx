import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function MenusPage() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/menues/all");

       
        const menusData = Array.isArray(res.data.data) ? res.data.data : [];
        setMenus(menusData);

      } catch (error) {
        console.error("Menus fetch error:", error);
        setMenus([]);
      }
    };

    fetchMenus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <title>Menus Page</title>

      <h1 className="text-yellow-600 font-extrabold text-5xl sm:text-6xl text-center mb-16 drop-shadow-lg">
        Choose Your Favorite Menu
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">
        {menus.length > 0 ? (
          menus.map((menu) => (
            <Link
              key={menu._id}
              to={`/menu/${menu._id}`}
              className="flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold text-3xl py-12 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-yellow-500/60 hover:-translate-y-2 hover:shadow-lg text-center"
            >
              {menu.name || "Unnamed Menu"}
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500 text-xl col-span-full">
            No menus available.
          </p>
        )}
      </div>
    </div>
  );
}

export default MenusPage;
