import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useApi } from "../context/ApiContext";

function MenusPage() {
  const { get } = useApi();
  const { t } = useTranslation("common");
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await get('/api/v1/menues/all');

       
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6">
      <title>{t("MenusPageTitle", { defaultValue: "Menus Page" })}</title>
      
      <div className="flex flex-col items-center gap-10">

       
        <h1 className="text-yellow-600 font-extrabold text-5xl sm:text-6xl text-center drop-shadow-md">
          {t("ChooseYourFavoriteMenu")}
        </h1>

       
        <div className="flex flex-col md:flex-row gap-6">

          <Link to="/breakfast" className="flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold text-3xl py-12 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-yellow-500/60 hover:-translate-y-2 hover:shadow-lg text-center p-5" > {t("Breakfast")} </Link>

          <Link to="/lunch" className="flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold text-3xl py-12 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-yellow-500/60 hover:-translate-y-2 hover:shadow-lg text-center p-5"> {t("LunchAndDinner")} </Link>

          <Link to="/drinks" className="flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold text-3xl py-12 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-yellow-500/60 hover:-translate-y-2 hover:shadow-lg text-center p-5"> {t("Drinks")}</Link>

           {menus.length > 0 ? (
          menus.map((menu) => (
            <>
            <Link
              key={menu._id}
              to={`/menu/${menu._id}`}
              className="flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold text-3xl py-12 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-yellow-500/60 hover:-translate-y-2 hover:shadow-lg text-center p-5"
            >
              {menu.name || t("UnnamedMenu", { defaultValue: "Unnamed Menu" })}
            </Link>

            
            </>
          ))
        ) : (
        <></>
        )}

        </div>
      </div>
    </div>
  );
}

export default MenusPage;