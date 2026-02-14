import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineAppstore } from "react-icons/ai";
import KitchenOrders from "./KitchenOrders";
import Store from "./Store";
import cooker from '../images/cooker.avif';

function KitchenPanel() {
  const [activeMenu, setActiveMenu] = useState("Orders");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Orders", icon: <AiOutlineAppstore size={20} /> },
    { name: "Store", icon: <AiOutlineMenu size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-60 shadow-md transition-transform duration-300 z-50
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col justify-center`}
      >
        {/* Cooker Image on Top */}
        <div className="flex flex-col items-center mb-6">
          <img src={cooker} alt="cooker" className="w-50 h-50 " />
        </div>

        {/* Menu Items in Vertical Center */}
        <nav className="flex flex-col gap-4 px-6">
          {menuItems.map((menu) => (
            <div
              key={menu.name}
              onClick={() => setActiveMenu(menu.name)}
              className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-all
                ${activeMenu === menu.name
                  ? "bg-yellow-100 text-yellow-700 font-semibold"
                  : "text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
                }`}
            >
              {menu.icon}
              <span className="text-base">{menu.name}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-60 flex flex-col">

        {/* Top Bar for mobile */}
        <div className="p-4 bg-white shadow-md flex justify-between items-center md:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-yellow-600 text-2xl"
          >
            <AiOutlineMenu />
          </button>
          <h2 className="text-lg font-bold text-yellow-600">{activeMenu}</h2>
        </div>

        {/* Page Content */}
        <div className="p-6 flex-1">
          {activeMenu === "Orders" && <KitchenOrders />}
          {activeMenu === "Store" && <Store />}
        </div>
      </div>
    </div>
  );
}

export default KitchenPanel;
