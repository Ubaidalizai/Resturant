import { useEffect, useState } from "react";
import MenuTabs from "../Components/garson/MenuTabs";
import FoodGrid from "../Components/garson/FoodGrid";
import CartPanel from "../Components/garson/CartPanel";
import axios from "axios";
import { baseURL } from "../configs/baseURL.config";

function GarsoonDashboard() {
  const [menus, setMenus] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [tables, setTables] = useState([]);

  const [selectedMenu, setSelectedMenu] = useState(null);
  const [cart, setCart] = useState({}); // <-- object based cart
  const [selectedTable, setSelectedTable] = useState("");

  // Fetch tables
  useEffect(() => {
    axios.get(`${baseURL}/api/v1/tables/all`)
      .then(res => setTables(res.data.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch menus
  useEffect(() => {
    axios.get(`${baseURL}/api/v1/menues/all`)
      .then(res => {
        setMenus(res.data.data);
        if (res.data.data.length) setSelectedMenu(res.data.data[0]._id);
      })
      .catch(err => console.error(err));
  }, []);

  // Fetch foods
  useEffect(() => {
    axios.get(`${baseURL}/api/v1/foods/all`)
      .then(res => setAllFoods(res.data.data))
      .catch(err => console.error(err));
  }, []);

  // Filter foods by selected menu
  const filteredFoods = selectedMenu
    ? allFoods.filter(food => food.catagory === selectedMenu)
    : allFoods;

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* LEFT SIDE */}
      <div className="flex-1 p-6">
        <MenuTabs
          menus={menus}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />

        <FoodGrid
          foods={filteredFoods}
          cart={cart}
          setCart={setCart}
        />
      </div>

      {/* RIGHT SIDE CART */}
      <CartPanel
        cart={cart}
        setCart={setCart}
        tables={tables}
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
      />

    </div>
  );
}

export default GarsoonDashboard;