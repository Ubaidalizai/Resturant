import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Management() {
  const [activeTab, setActiveTab] = useState("Menus");
  const [modalOpen, setModalOpen] = useState(false);

  const [menus, setMenus] = useState([]);
  const [tables, setTables] = useState([]);
  const [garsons, setGarsons] = useState([]);

  const [newItem, setNewItem] = useState({
    name: "",
    catagory: "",
    username: "",
    email: "",
    password: "",
    capacity: "",
  });

  //  FETCH DATA 
  const fetchMenus = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/menues/all");
      setMenus(res.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load menus");
    }
  };

  const fetchTables = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/tables/all");
      setTables(res.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to load tables");
    }
  };

  const fetchGarsons = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/users/all/");
      setGarsons(res.data.data || []);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to load garsons");
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchTables();
    fetchGarsons();
  }, []);

  // MODAL
  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setNewItem({
      name: "",
      catagory: "",
      username: "",
      email: "",
      password: "",
      capacity: "",
    });
  };

  //  ADD ITEM 
  const handleAdd = async () => {
    try {
      if (activeTab === "Menus") {
        if (!newItem.name || !newItem.catagory) {
          toast.error("Please fill all menu fields");
          return;
        }

        await axios.post("http://localhost:4000/api/v1/menues/add", {
          name: newItem.name,
          catagory: newItem.catagory,
        });

        toast.success("Menu added successfully");
        fetchMenus();

      } else if (activeTab === "Tables") {
        if (!newItem.name || !newItem.capacity) {
          toast.error("Please fill all table fields");
          return;
        }

        await axios.post("http://localhost:4000/api/v1/tables/add", {
          tableNumber: newItem.name,
          capacity: Number(newItem.capacity),
        });

        toast.success("Table added successfully");
        fetchTables();

      } else if (activeTab === "Garsons") {
        if (!newItem.name || !newItem.email || !newItem.password) {
          toast.error("Please fill all garson fields");
          return;
        }

        await axios.post("http://localhost:4000/api/v1/user/register/", {
          name: newItem.name,
          email: newItem.email,
          password: newItem.password,
        });

        toast.success("Garson added successfully");
        fetchGarsons();
      }

      setNewItem({
        name: "",
        catagory: "",
        username: "",
        email: "",
        password: "",
        capacity: "",
      });
      closeModal();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Add failed");
    }
  };

  //  DELETE ITEM 
  const handleDelete = async (index, id) => {
    try {
      if (activeTab === "Menus") {
        await axios.delete(`http://localhost:4000/api/v1/menues/delete/${id}`);
        toast.success("Menu deleted");
        fetchMenus();

      } else if (activeTab === "Tables") {
        await axios.delete(`http://localhost:4000/api/v1/tables/delete/${id}`);
        toast.success("Table deleted");
        fetchTables();

      } else if (activeTab === "Garsons") {
        await axios.delete(`http://localhost:4000/api/v1/users/delete/${id}`);
        toast.success("Garson deleted");
        fetchGarsons();
      }
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  //  RENDER 
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-yellow-600 mb-6 text-center">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-4 justify-center mb-6">
        {["Menus", "Tables", "Garsons"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-yellow-600 text-white" : "bg-white text-gray-800"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse border border-gray-300 text-black">
          <thead className="bg-yellow-100">
            <tr>
              {activeTab === "Menus" && (
                <>
                  <th className="py-2 border">Menu Name</th>
                  <th className="py-2 border">Category</th>
                  <th className="py-2 border">Actions</th>
                </>
              )}
              {activeTab === "Tables" && (
                <>
                  <th className="py-2 border">Table Number</th>
                  <th className="py-2 border">Capacity</th>
                  <th className="py-2 border">Actions</th>
                </>
              )}
              {activeTab === "Garsons" && (
                <>
                  <th className="py-2 border">Name</th>
                  <th className="py-2 border">Email</th>
                  <th className="py-2 border">Password</th>
                  <th className="py-2 border">Actions</th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {activeTab === "Menus" &&
              menus.map((menu) => (
                <tr key={menu._id} className="border-b">
                  <td className="py-2 border">{menu.name}</td>
                  <td className="py-2 border">{menu.catagory}</td>
                  <td className="py-2 border">
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete(null, menu._id)}
                    />
                  </td>
                </tr>
              ))}

            {activeTab === "Tables" &&
              tables.map((table) => (
                <tr key={table._id || table.tableNumber} className="border-b">
                  <td className="py-2 border">{table.tableNumber || table.number}</td>
                  <td className="py-2 border">{table.capacity}</td>
                  <td className="py-2 border">
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete(null, table._id)}
                    />
                  </td>
                </tr>
              ))}

            {activeTab === "Garsons" &&
              garsons.map((g) => (
                <tr key={g._id} className="border-b">
                  <td className="py-2 border">{g.name}</td>
                  <td className="py-2 border">{g.email}</td>
                  <td className="py-2 border">{g.password}</td>
                  <td className="py-2 border">
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete(null, g._id)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Add Button */}
      <div className="flex justify-center mt-4">
        <button
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          onClick={openModal}
        >
          Add {activeTab.slice(0, -1)}
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl p-6 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-yellow-600">Add {activeTab.slice(0, -1)}</h2>
              <button onClick={closeModal} className="font-bold text-yellow-600 text-xl cursor-pointer">
                X
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center text-black mb-4">
              {activeTab === "Menus" && (
                <>
                  <input
                    type="text"
                    placeholder="Menu Name"
                    className="border p-2 rounded w-full"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Catagory"
                    className="border p-2 rounded w-full"
                    value={newItem.catagory}
                    onChange={(e) => setNewItem({ ...newItem, catagory: e.target.value })}
                  />
                </>
              )}

              {activeTab === "Tables" && (
                <>
                  <input
                    type="text"
                    placeholder="Table Number"
                    className="border p-2 rounded w-full"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Capacity"
                    className="border p-2 rounded w-full"
                    value={newItem.capacity}
                    onChange={(e) => setNewItem({ ...newItem, capacity: e.target.value })}
                  />
                </>
              )}

              {activeTab === "Garsons" && (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    className="border p-2 rounded w-full"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 rounded w-full"
                    value={newItem.email}
                    onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 rounded w-full"
                    value={newItem.password}
                    onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
                  />
                </>
              )}

              <button
                onClick={handleAdd}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Management;
