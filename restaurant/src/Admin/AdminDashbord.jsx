import React, { useState } from "react";
import { useEffect } from "react";
import { AiOutlineMenu, AiOutlineTable, AiOutlineAppstore, AiOutlineHistory } from "react-icons/ai";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBurger } from '@fortawesome/free-solid-svg-icons';
import Tables from "./Tables";
import { Link } from "react-router-dom";
import OrderHistory from "./OrderHistory";
import FoodDataStorage from './FoodDataStorage';
import Logo from '../../public/logo.jpg';
import OverviewChart from "./OverviewChart";

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [orders, setOrders] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem("Orders");

    if (data) {
      const parsedOrders = JSON.parse(data);
      setOrders(parsedOrders);


      const today = new Date();
      const todayFormatted = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

      const dailyTotal = parsedOrders
        .filter(order => order.date === todayFormatted)
        .reduce((sum, order) => sum + Number(order.orderTotal), 0);

      setTodayRevenue(dailyTotal);

      console.log("TODAY:", todayFormatted);
      console.log("ORDER DATES:", parsedOrders.map(o => o.date));
    }
  }, []);




  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-transform z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 w-64`}>
        <div className="p-6 border-b border-gray-200">
          <Link to='/'>
            <img src={Logo} alt="Logo" />
          </Link>
        </div>
        <nav className="p-6 flex flex-col gap-3 text-yellow-600">
          <div
            onClick={() => setActiveMenu("Overview")}
            className={`flex items-center gap-3 font-semibold py-2 px-4 rounded cursor-pointer hover:bg-yellow-50 ${
              activeMenu === "Overview" ? "bg-yellow-100" : ""
            }`} >
            <AiOutlineAppstore size={20} />
            <span>Overview</span>
          </div>
          
          <div
            onClick={() => setActiveMenu("Foods")}
            className={`flex items-center gap-3 font-semibold py-2 px-4 rounded cursor-pointer hover:bg-yellow-50 ${
              activeMenu === "Foods" ? "bg-yellow-100" : ""
            }`}
          >
            <FontAwesomeIcon icon={faBurger} />
            <span>Foods</span>
          </div>
          <div
            onClick={() => setActiveMenu("Tables")}
            className={`flex items-center gap-3 font-semibold py-2 px-4 rounded cursor-pointer hover:bg-yellow-50 ${
              activeMenu === "Tables" ? "bg-yellow-100" : ""
            }`}
          >
            <AiOutlineTable size={20} />
            <span>Tables</span>
          </div>
          <div
            onClick={() => setActiveMenu("OrderHistory")}
            className={`flex items-center gap-3 font-semibold py-2 px-4 rounded cursor-pointer hover:bg-yellow-50 ${
              activeMenu === "OrderHistory" ? "bg-yellow-100" : ""
            }`}
          >
            <AiOutlineHistory size={20} />
            <span>Order History</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 bg-white shadow-md md:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-yellow-600 text-2xl"
          >
            <AiOutlineMenu />
          </button>
        </div>

        <div className="p-6">
          {/* Conditional Rendering */}
          {activeMenu === "Overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <h1 className="text-[30px] justify-center text-center mb-[21px] sm:text-[45px] md:col-start-1 md:col-span-2 lg:col-start-1 lg:col-span-4 font-bold text-yellow-600">
                Admin Dashboard
              </h1>

             <div></div>
              <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform">
                <h3 className="text-gray-500 font-semibold">Today Total Orders</h3>
                <p className="text-yellow-600 text-3xl font-bold mt-2">{orders.length}</p>
              </div>

              
              <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform">
                <h3 className="text-gray-500 font-semibold">Daily Revenue</h3>
                <p className="text-yellow-600 text-3xl font-bold mt-2">${todayRevenue.toFixed(2)}</p>
              </div>

              {/* Chart under cards */}
              <div className="md:col-span-2 lg:col-span-4">
                <OverviewChart />
              </div>
            </div>
          )}

          {activeMenu === "Tables" && <Tables />}
          {activeMenu === "OrderHistory" && <OrderHistory />}
          {activeMenu === "Foods" && <FoodDataStorage />}

          {activeMenu !== "Overview" &&
            activeMenu !== "Tables" &&
            activeMenu !== "OrderHistory" &&
            activeMenu !== "Foods" && (
              <div className="bg-white rounded-3xl shadow-2xl p-6">
                <h2 className="text-xl font-semibold text-black">{activeMenu}</h2>
                <p className="mt-2 text-gray-700">Content for {activeMenu} goes here.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
