import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faUtensils, faTable, faUser, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { baseURL } from "../configs/baseURL.config";

function Management() {
  const [activeTab, setActiveTab] = useState("Menus");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [menus, setMenus] = useState([]);
  const [tables, setTables] = useState([]);
  const [garsons, setGarsons] = useState([]);
  const [role, setRole] = useState([]);
  const [staff, setStaff] = useState([]);

  const [permissions, setPermissions] = useState([]);
  useEffect(()=>{
    const fetchPermissions = async ()=>{
      try {
        const permissions = await axios.get(`${baseURL}/api/v1/permissions`);
        console.log(permissions);
      setPermissions(permissions.data.data);
      } catch (error) {
        console.log("Erro", error)
      }

    };
    fetchPermissions();
  },[])
  const [newItem, setNewItem] = useState({
    name: "",
    catagory: "",
    username: "",
    email: "",
    password: "",
    capacity: "",
    phone: "",
    role: "",
    salary: "",
    selectedPermissions: [],
    standard: false,
    international: false
  });

  // ---------------- FETCH DATA ----------------
  const fetchMenus = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/v1/menues/all`);
      setMenus(res.data.data || []);
    } catch {
      toast.error("Failed to load menus");
    }
  };

  const fetchTables = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/v1/tables/all`);
      setTables(res.data.data || []);
    } catch {
      toast.error("Failed to load tables");
    }
  };

  const fetchGarsons = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/v1/users/all/`);
      setGarsons(res.data.data || []);
      console.log(res);
    } catch {
      toast.error("Failed to load garsons");
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchTables();
    fetchGarsons();
  }, []);

  // ---------------- MODAL ----------------
  const openModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setNewItem({
        name: item.name || "",
        catagory: item.catagory || "",
        email: item.email || "",
        password: item.password || "",
        capacity: item.capacity || "",
        phone: item.phone || "",
        role: item.role || "",
        salary: item.salary || "",
        selectedPermissions: item.permissions || [],
        standard: item.standard || false,
        international: item.international || false,
      });
    } else {
      setEditItem(null);
      setNewItem({
        name: "",
        catagory: "",
        username: "",
        email: "",
        password: "",
        capacity: "",
        phone: "",
        role: "",
        salary: "",
        selectedPermissions: [],
        standard: false,
        international: false,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditItem(null);
    setNewItem({
      name: "",
      catagory: "",
      username: "",
      email: "",
      password: "",
      capacity: "",
      phone: "",
      role: "",
      salary: "",
      selectedPermissions: [],
      standard: false,
      international: false,
    });
  };

  // ---------------- ADD/UPDATE ITEM ----------------
  const handleAdd = async () => {
    try {
      if (activeTab === "Menus") {
        if (!newItem.name || !newItem.catagory) return toast.error("Please fill all menu fields");
        if (editItem) {
          await axios.put(`${baseURL}/api/v1/menues/update/${editItem._id}`, { name: newItem.name, catagory: newItem.catagory });
          toast.success("Menu updated successfully");
        } else {
          await axios.post(`${baseURL}/api/v1/menues/add`, { name: newItem.name, catagory: newItem.catagory });
          toast.success("Menu added successfully");
        }
        fetchMenus();
      } else if (activeTab === "Tables") {
        if (!newItem.name || !newItem.capacity) return toast.error("Please fill all table fields");
        if (editItem) {
          await axios.put(`${baseURL}/api/v1/tables/update/${editItem._id}`, { tableNumber: newItem.name, capacity: Number(newItem.capacity) });
          toast.success("Table updated successfully");
        } else {
          await axios.post(`${baseURL}/api/v1/tables/add`, { tableNumber: newItem.name, capacity: Number(newItem.capacity) });
          toast.success("Table added successfully");
        }
        fetchTables();
      } else if (activeTab === "Garsons") {
        if (!newItem.name || !newItem.email || !newItem.password) return toast.error("Please fill all garson fields");
        if (editItem) {
          await axios.put(`${baseURL}/api/v1/users/update/${editItem._id}`, {
            name: newItem.name,
            email: newItem.email,
            password: newItem.password,
            phone: newItem.phone,
            role: newItem.role,
          });
          toast.success("Garson updated successfully");
        } else {
          await axios.post(`${baseURL}/api/v1/user/register/`, {
            name: newItem.name,
            email: newItem.email,
            password: newItem.password,
            phone: newItem.phone,
            role: newItem.role,
          });
          toast.success("Garson added successfully");
        }
        fetchGarsons();
      } else if (activeTab === "Role") {
        if (!newItem.name) return toast.error("Please fill role field");
        const payload = {
          role: newItem.name,
          permissions: newItem.selectedPermissions
        };
        if (editItem) {
          await axios.put(`${baseURL}/api/v1/users/update-role/${editItem._id}`, payload);
          toast.success("Role updated successfully");
        } else {
          await axios.post(`${baseURL}/api/v1/role/add`, payload);
          toast.success("Role added successfully");
        }
        fetchGarsons();
      } else if (activeTab === "Staff") {
        if (!newItem.name || !newItem.phone || !newItem.salary) return toast.error("Please fill all staff fields");
        // API call for staff
        toast.success("Staff operation simulated"); // placeholder
      }
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  // ---------------- DELETE ITEM ----------------
  const handleDelete = async (index, id) => {
    try {
      if (activeTab === "Menus") {
        await axios.delete(`${baseURL}/api/v1/menues/delete/${id}`);
        toast.success("Menu deleted");
        fetchMenus();
      } else if (activeTab === "Tables") {
        await axios.delete(`${baseURL}/api/v1/tables/delete/${id}`);
        toast.success("Table deleted");
        fetchTables();
      } else if (activeTab === "Garsons" || activeTab === "Role") {
        await axios.delete(`${baseURL}/api/v1/users/delete/${id}`);
        toast.success(`${activeTab === "Garsons" ? "Garson" : "Role"} deleted`);
        fetchGarsons();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const tabIcons = {
    Menus: faUtensils,
    Tables: faTable,
    Garsons: faUser,
    Role: faUserShield,
    Staff: faUser,
  };

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-yellow-600">Restaurant Admin Panel</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {["Menus", "Tables", "Garsons", "Role", "Staff"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl font-medium shadow transition-all duration-200 flex items-center gap-2
              ${activeTab === tab ? "bg-yellow-500 text-white shadow-lg scale-105" : "bg-white hover:bg-yellow-50 text-black"}`}
          >
            <FontAwesomeIcon icon={tabIcons[tab]} />
            {tab}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden text-black">
        <table className="w-full text-center">
          <thead className="bg-yellow-100 text-black">
            <tr>
              {activeTab === "Menus" && <><th className="p-4">Menu Name</th><th>Category</th><th>Actions</th></>}
              {activeTab === "Tables" && <><th className="p-4">Table Number</th><th>Capacity</th><th>Actions</th></>}
              {activeTab === "Garsons" && <><th className="p-4">Name</th><th>Email</th><th>Password</th><th>Role</th><th>Phone</th><th>Actions</th></>}
              {activeTab === "Role" && <><th className="p-4">Role</th><th>Permissions</th><th>Actions</th></>}
              {activeTab === "Staff" && <><th className="p-4">Name</th><th>Phone</th><th>Salary</th><th>Actions</th></>}
            </tr>
          </thead>
          <tbody>
            {activeTab === "Menus" && menus.map(menu => (
              <tr key={menu._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 text-black">{menu.name}</td>
                <td className="text-black">{menu.catagory}</td>
                <td className="flex justify-center gap-4">
                  <button onClick={() => openModal(menu)} className="text-blue-500 hover:text-blue-700 transition"><FontAwesomeIcon icon={faEdit} /></button>
                  <button onClick={() => handleDelete(null, menu._id)} className="text-red-500 hover:text-red-700 transition"><FontAwesomeIcon icon={faTrash} /></button>
                </td>
              </tr>
            ))}

            {activeTab === "Tables" && tables.map(table => (
              <tr key={table._id || table.tableNumber} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 text-black">{table.tableNumber}</td>
                <td className="text-black">{table.capacity}</td>
                <td className="flex justify-center gap-4">
                  <button onClick={() => openModal(table)} className="text-blue-500 hover:text-blue-700 transition"><FontAwesomeIcon icon={faEdit} /></button>
                  <button onClick={() => handleDelete(null, table._id)} className="text-red-500 hover:text-red-700 transition"><FontAwesomeIcon icon={faTrash} /></button>
                </td>
              </tr>
            ))}

            {activeTab === "Garsons" && garsons.map(g => (
              <tr key={g._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 text-black">{g.name}</td>
                <td className="text-black">{g.email}</td>
                <td className="text-black">{g.password}</td>
                <td className="text-black">{g.role}</td>
                <td className="text-black">{g.phone}</td>
                <td className="flex justify-center gap-4">
                  <button onClick={() => openModal(g)} className="text-blue-500 hover:text-blue-700 transition"><FontAwesomeIcon icon={faEdit} /></button>
                  <button onClick={() => handleDelete(null, g._id)} className="text-red-500 hover:text-red-700 transition"><FontAwesomeIcon icon={faTrash} /></button>
                </td>
              </tr>
            ))}

            {activeTab === "Role" && role.map(r => (
              <tr key={r._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 text-black">{r.name}</td>  
                <td className="text-black">{(r.permissions || []).join(", ")}</td>
                <td className="flex justify-center gap-4">
                  <button onClick={() => openModal(r)} className="text-blue-500 hover:text-blue-700 transition"><FontAwesomeIcon icon={faEdit} /></button>
                  <button onClick={() => handleDelete(null, r._id)} className="text-red-500 hover:text-red-700 transition"><FontAwesomeIcon icon={faTrash} /></button>
                </td>
              </tr>
            ))}

            {activeTab === "Staff" && staff.map(s => (
              <tr key={s._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 text-black">{s.name}</td>
                <td className="text-black">{s.phone}</td>
                <td className="text-black">{s.salary}</td>
                <td className="flex justify-center gap-4">
                  <button onClick={() => openModal(s)} className="text-blue-500 hover:text-blue-700 transition"><FontAwesomeIcon icon={faEdit} /></button>
                  <button onClick={() => handleDelete(null, s._id)} className="text-red-500 hover:text-red-700 transition"><FontAwesomeIcon icon={faTrash} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Button */}
      <div className="flex justify-center mt-8">
        <button onClick={() => openModal()} className="px-6 py-3 bg-yellow-500 text-white rounded-xl shadow-lg hover:scale-105 hover:bg-yellow-600 transition">
          {editItem ? "Update " + activeTab.slice(0, -1) : "Add " + activeTab.slice(0, -1)}
        </button>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white w-[500px] p-8 rounded-2xl shadow-2xl text-black">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold mb-6 text-yellow-600">{editItem ? "Update" : "Add"} {activeTab.slice(0, -1)}</h2>
              <button onClick={closeModal} className="text-black text-xl font-bold hover:text-gray-700">X</button>
            </div>

            <div className="flex flex-col gap-4 text-black mb-4">
              {/* Menus */}
              {activeTab === "Menus" && (
                <>
                  <input type="text" placeholder="Menu Name" className="border p-2 rounded w-full" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                  <input type="text" placeholder="Catagory" className="border p-2 rounded w-full" value={newItem.catagory} onChange={(e) => setNewItem({ ...newItem, catagory: e.target.value })} />
                </>
              )}

              {/* Tables */}
              {activeTab === "Tables" && (
                <>
                  <input type="text" placeholder="Table Number" className="border p-2 rounded w-full" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                  <input type="number" placeholder="Capacity" className="border p-2 rounded w-full" value={newItem.capacity} onChange={(e) => setNewItem({ ...newItem, capacity: e.target.value })} />
                </>
              )}

              {/* Garsons */}
              {activeTab === "Garsons" && (
                <>
                  <input type="text" placeholder="Name" className="border p-2 rounded w-full" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                  <input type="email" placeholder="Email" className="border p-2 rounded w-full" value={newItem.email} onChange={(e) => setNewItem({ ...newItem, email: e.target.value })} />
                  <input type="password" placeholder="Password" className="border p-2 rounded w-full" value={newItem.password} onChange={(e) => setNewItem({ ...newItem, password: e.target.value })} />
                  <select className="border p-2 rounded w-full" value={newItem.role} onChange={(e) => setNewItem({ ...newItem, role: e.target.value })}>
                    <option value="">Select Role</option>
                    <option value="user">Garson</option>
                    <option value="chef">Chef</option>
                    <option value="admin">Admin</option>
                  </select>
                  <input type="number" placeholder="Phone" className="border p-2 rounded w-full" value={newItem.phone} onChange={(e) => setNewItem({ ...newItem, phone: e.target.value })} />
                </>
              )}

              {/* Role */}
              {activeTab === "Role" && (
                <>
                  <input type="text" placeholder="Role Name" className="border p-2 rounded w-full" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-auto border p-2 rounded">
                    {permissions.map(p => (
  <label key={p._id} className="flex items-center gap-1">
    <input
      type="checkbox"
      checked={newItem.selectedPermissions.includes(p._id)}
      onChange={(e) => {
        const checked = e.target.checked;
        const selected = newItem.selectedPermissions;
        if (checked) {
          setNewItem({ ...newItem, selectedPermissions: [...selected, p._id] });
        } else {
          setNewItem({ ...newItem, selectedPermissions: selected.filter(x => x !== p._id) });
        }
      }}
    />
    {p.name}
  </label>
))}
                  </div>
                </>
              )}

              {/* Staff */}
              {activeTab === "Staff" && (
                <>
                  <input type="text" placeholder="Name" className="border p-2 rounded w-full" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                  <input type="number" placeholder="Phone" className="border p-2 rounded w-full" value={newItem.phone} onChange={(e) => setNewItem({ ...newItem, phone: e.target.value })} />
                  <input type="number" placeholder="Salary" className="border p-2 rounded w-full" value={newItem.salary} onChange={(e) => setNewItem({ ...newItem, salary: e.target.value })} />
                </>
              )}
            </div>

            <button onClick={handleAdd} className="px-6 py-2 bg-yellow-500 text-white rounded-xl shadow-lg hover:bg-yellow-600 transition w-full mt-4">
              {editItem ? "Update" : "Add"} {activeTab.slice(0, -1)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Management;