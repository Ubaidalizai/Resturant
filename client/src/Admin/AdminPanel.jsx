import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Management() {
  const [activeTab, setActiveTab] = useState("Menus");
  const [modalOpen, setModalOpen] = useState(false);

  const [menus, setMenus] = useState([{ name: "Breakfast", category: "Fast Food" }]);
  const [tables, setTables] = useState([{ number: "T1", capacity: 4 }, { number: "T2", capacity: 6 }]);
  const [garsons, setGarsons] = useState([{ username: "John", password: "1234" }]);

  const [newItem, setNewItem] = useState({ name: "", category: "", username: "", password: "", capacity: "" });

  // Modal open/close
  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setNewItem({ name: "", category: "", username: "", password: "", capacity: "" });
  };

  // Add new item
  const handleAdd = () => {
    if (activeTab === "Menus") {
      setMenus([...menus, { name: newItem.name, category: newItem.category }]);
    } else if (activeTab === "Tables") {
      setTables([...tables, { number: newItem.name, capacity: newItem.capacity }]);
    } else if (activeTab === "Garsons") {
      setGarsons([...garsons, { username: newItem.username, password: newItem.password }]);
    }

    setNewItem({ name: "", category: "", username: "", password: "", capacity: "" });
    closeModal();
  };

  // Delete item
  const handleDelete = (index) => {
    if (activeTab === "Menus") setMenus(menus.filter((_, i) => i !== index));
    else if (activeTab === "Tables") setTables(tables.filter((_, i) => i !== index));
    else if (activeTab === "Garsons") setGarsons(garsons.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Admin Panel Title */}
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
                  <th className="py-2 border">Username</th>
                  <th className="py-2 border">Password</th>
                  <th className="py-2 border">Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {activeTab === "Menus" &&
              menus.map((menu, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2 border">{menu.name}</td>
                  <td className="py-2 border">{menu.category}</td>
                  <td className="py-2 border">
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete(i)}
                    />
                  </td>
                </tr>
              ))}
            {activeTab === "Tables" &&
              tables.map((t, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2 border">{t.number}</td>
                  <td className="py-2 border">{t.capacity}</td>
                  <td className="py-2 border">
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete(i)}
                    />
                  </td>
                </tr>
              ))}
            {activeTab === "Garsons" &&
              garsons.map((g, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2 border">{g.username}</td>
                  <td className="py-2 border">{g.password}</td>
                  <td className="py-2 border">
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete(i)}
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
          onClick={() => setModalOpen(true)}
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

            {/* Inputs */}
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
                    placeholder="Category"
                    className="border p-2 rounded w-full"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
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
                    placeholder="Username"
                    className="border p-2 rounded w-full"
                    value={newItem.username}
                    onChange={(e) => setNewItem({ ...newItem, username: e.target.value })}
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
