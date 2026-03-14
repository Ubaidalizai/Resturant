import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faUtensils, faTable, faUser, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { useApi } from "../context/ApiContext";
import InputField from "../Components/UI/InputField";
import Button from "../Components/UI/Button";
import { ItemsContext } from "../App";

function Management() {
  const { get, post, put, del } = useApi();
  const [activeTab, setActiveTab] = useState("Menus");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const { user } = useContext(ItemsContext);
  const [menus, setMenus] = useState([]);
  const [tables, setTables] = useState([]);
  const [garsons, setGarsons] = useState([]);
  const [role, setRole] = useState([]);
  const [staff, setStaff] = useState([]);
  const [permissions, setPermissions] = useState([]);
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
    address: "",
    nationalId: "",
    employmentType: "",
    status: "",
    selectedPermissions: [],
    standard: false,
    international: false
  });

  // Fetch permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await get('/api/v1/permissions');
        setPermissions(res.data.data || []);
      } catch (err) {
        console.error("Permissions fetch error:", err);
      }
    };
    fetchPermissions();
  }, []);

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const res = await get('/api/v1/role/get');
      setRole(res.data.data.roles || []);
    } catch (err) {
      console.error("Roles fetch error:", err);
    }
  };

  // Fetch data
  const fetchMenus = async () => {
    try { const res = await get('/api/v1/menues/all'); setMenus(res.data.data || []); } 
    catch { toast.error("Failed to load menus"); }
  };
  const fetchTables = async () => {
    try { const res = await get('/api/v1/tables/all'); setTables(res.data.data || []); } 
    catch { toast.error("Failed to load tables"); }
  };
  const fetchGarsons = async () => {
    try { const res = await get('/api/v1/users/all/'); setGarsons(res.data.data || []); } 
    catch { toast.error("Failed to load garsons"); }
  };
  const fetchStaff = async () => {
    try { const res = await get('/api/v1/staff/all'); setStaff(res.data.data || []); } 
    catch { toast.error("Failed to load staff"); }
  };

  useEffect(() => {
    fetchMenus(); fetchTables(); fetchGarsons(); fetchRoles(); fetchStaff();
  }, []);

  // Modal controls
  const openModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setNewItem({
        name: item.name || item.role || "",
        catagory: item.catagory || "",
        email: item.email || "",
        password: "",
        capacity: item.capacity || "",
        phone: item.phone || "",
        role: item.role || "",
        salary: item.salary || "",
        address: item.address || "",
        nationalId: item.nationalId || "",
        employmentType: item.employmentType || "",
        status: item.status || "",
        selectedPermissions: Array.isArray(item.permissions)
          ? item.permissions.map(p => p._id || p)
          : [],
        standard: item.standard || false,
        international: item.international || false
      });
    } else {
      setEditItem(null);
      setNewItem({
        name: "", catagory: "", username: "", email: "", password: "",
        capacity: "", phone: "", role: "", salary: "", address: "",
        nationalId: "", employmentType: "", status: "", selectedPermissions: [],
        standard: false, international: false
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditItem(null);
    setNewItem({
      name: "", catagory: "", username: "", email: "", password: "",
      capacity: "", phone: "", role: "", salary: "", address: "",
      nationalId: "", employmentType: "", status: "", selectedPermissions: [],
      standard: false, international: false
    });
  };

  // Add/Update
  const handleAdd = async () => {
    try {
      if (activeTab === "Menus") {
        if (!newItem.name || !newItem.catagory) return toast.error("Please fill all menu fields");
        if (editItem) { await put(`/api/v1/menues/update/${editItem._id}`, { name: newItem.name, catagory: newItem.catagory }); toast.success("Menu updated"); } 
        else { await post(`/api/v1/menues/add`, { name: newItem.name, catagory: newItem.catagory }); toast.success("Menu added"); }
        fetchMenus();
      } 
      else if (activeTab === "Tables") {
        if (!newItem.name || !newItem.capacity) return toast.error("Please fill all table fields");
        if (editItem) { await put(`/api/v1/tables/update/${editItem._id}`, { tableNumber: newItem.name, capacity: Number(newItem.capacity) }); toast.success("Table updated"); } 
        else { await post(`/api/v1/tables/add`, { tableNumber: newItem.name, capacity: Number(newItem.capacity) }); toast.success("Table added"); }
        fetchTables();
      } 
      else if (activeTab === "Garsons") {
        if (!newItem.name || !newItem.email || !newItem.password) return toast.error("Please fill all garson fields");
        const payload = { name: newItem.name, email: newItem.email, password: newItem.password, phone: newItem.phone, role: newItem.role };
        if (editItem) { await put(`/api/v1/users/update/${editItem._id}`, payload); toast.success("Garson updated"); } 
        else { await post(`/api/v1/user/register/`, payload); toast.success("Garson added"); }
        fetchGarsons();
      } 
      else if (activeTab === "Role") {
        if (!newItem.name) return toast.error("Please fill role field");
        const payload = { id: editItem?._id, role: newItem.name, permissions: newItem.selectedPermissions };
        if (editItem) { await put(`/api/v1/role/update`, payload); toast.success("Role updated"); } 
        else { await post(`/api/v1/role/add`, payload); toast.success("Role added"); }
        fetchRoles();
      } 
      else if (activeTab === "Staff") {
        if (!newItem.name || !newItem.phone || !newItem.salary) return toast.error("Please fill all staff fields");
        const payload = { fullName: newItem.name, phone: newItem.phone, address: newItem.address, nationalId: newItem.nationalId, salary: newItem.salary, status: newItem.status, employmentType: newItem.employmentType };
        if (editItem) { await put(`/api/v1/staff/update/${editItem._id}`, payload); toast.success("Staff updated"); } 
        else { await post(`/api/v1/staff/add`, payload); toast.success("Staff added"); }
        fetchStaff();
      }
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  // Delete
  const handleDelete = async (index, id) => {
    try {
      if (activeTab === "Menus") { await del(`/api/v1/menues/delete/${id}`); toast.success("Menu deleted"); fetchMenus(); } 
      else if (activeTab === "Tables") { await del(`/api/v1/tables/delete/${id}`); toast.success("Table deleted"); fetchTables(); } 
      else if (activeTab === "Garsons") { await del(`/api/v1/users/delete/${id}`); toast.success("Garson deleted"); fetchGarsons(); } 
      else if (activeTab === "Role") { await del(`/api/v1/role/delete/${id}`); toast.success("Role deleted"); fetchRoles(); }
    } catch { toast.error("Delete failed"); }
  };

  const tabIcons = { Menus: faUtensils, Tables: faTable, Garsons: faUser, Role: faUserShield, Staff: faUser };

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-yellow-600">Restaurant Admin Panel</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {["Menus", "Tables", "Garsons", "Role", "Staff"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl font-medium shadow transition-all duration-200 flex items-center gap-2
            ${activeTab === tab ? "bg-yellow-500 text-white shadow-lg scale-105" : "bg-white hover:bg-yellow-50 text-black"}`}>
            <FontAwesomeIcon icon={tabIcons[tab]} />{tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden text-black">
        <table className="w-full text-center">
          <thead className="bg-yellow-100 text-black">
            <tr>
              {activeTab === "Menus" && <><th className="p-4">Menu Name</th><th>Category</th><th>Actions</th></>}
              {activeTab === "Tables" && <><th className="p-4">Table Number</th><th>Capacity</th><th>Actions</th></>}
              {activeTab === "Garsons" && <><th className="p-4">Name</th><th>Email</th><th>Password</th><th>Role</th><th>Phone</th><th>Actions</th></>}
              {activeTab === "Role" && <><th className="p-4">Role</th><th>Permissions</th><th>Actions</th></>}
              {activeTab === "Staff" && <><th className="p-4">Name</th><th>Phone</th><th>Address</th><th>Salary</th><th>Status</th><th>Actions</th></>}
            </tr>
          </thead>
          <tbody>
            {activeTab === "Menus" && menus.map(menu => (
              <tr key={menu._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">{menu.name}</td>
                <td>{menu.catagory}</td>
                <td className="flex justify-center gap-4">
                  <button onClick={() => openModal(menu)} className="text-blue-500 hover:text-blue-700"><FontAwesomeIcon icon={faEdit} /></button>
                  <button onClick={() => handleDelete(null, menu._id)} className="text-red-500 hover:text-red-700"><FontAwesomeIcon icon={faTrash} /></button>
                </td>
              </tr>
            ))}
            {activeTab === "Tables" && tables.map(table => (
              <tr key={table._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">{table.tableNumber}</td>
                <td>{table.capacity}</td>
                <td className="flex justify-center gap-4">
                  <button onClick={() => openModal(table)} className="text-blue-500 hover:text-blue-700"><FontAwesomeIcon icon={faEdit} /></button>
                  <button onClick={() => handleDelete(null, table._id)} className="text-red-500 hover:text-red-700"><FontAwesomeIcon icon={faTrash} /></button>
                </td>
              </tr>
            ))}
            {activeTab === "Garsons" && garsons.map(g => (
              <tr key={g._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">{g.name}</td>
                <td>{g.email}</td>
                <td>{g.password}</td>
                <td>{g.role?.role}</td>
                <td>{g.phone}</td>
                <td className="flex justify-center gap-4">
                  <button onClick={() => openModal(g)} className="text-blue-500 hover:text-blue-700"><FontAwesomeIcon icon={faEdit} /></button>
                  <button onClick={() => handleDelete(null, g._id)} className="text-red-500 hover:text-red-700"><FontAwesomeIcon icon={faTrash} /></button>
                </td>
              </tr>
            ))}
            {activeTab === "Role" && role.map(r => (
              <tr key={r._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">{r.role}</td>
                <td>{(r.permissions || []).map(p => p.name || p).join(", ")}</td>
                <td className="flex justify-center gap-4">
                  <button onClick={() => openModal(r)} className="text-blue-500 hover:text-blue-700"><FontAwesomeIcon icon={faEdit} /></button>
                  <button onClick={() => handleDelete(null, r._id)} className="text-red-500 hover:text-red-700"><FontAwesomeIcon icon={faTrash} /></button>
                </td>
              </tr>
            ))}
            {activeTab === "Staff" && staff.map(s => (
              <tr key={s._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">{s.fullName}</td>
                <td>{s.phone}</td>
                <td>{s.address || "-"}</td>
                <td>{s.salary}</td>
                <td>{s.status}</td>
                <td className="flex justify-center gap-4">
                  <button onClick={() => openModal(s)} className="text-blue-500 hover:text-blue-700"><FontAwesomeIcon icon={faEdit} /></button>
                  <button onClick={() => handleDelete(null, s._id)} className="text-red-500 hover:text-red-700"><FontAwesomeIcon icon={faTrash} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-8">
        <Button onClick={() => openModal()}>{editItem ? "Update " + activeTab.slice(0, -1) : "Add " + activeTab.slice(0, -1)}</Button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white w-[500px] p-8 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold mb-6 text-yellow-600">{editItem ? "Update" : "Add"} {activeTab.slice(0, -1)}</h2>
              <button onClick={closeModal} className="text-black text-xl font-bold hover:text-gray-700">X</button>
            </div>

            <div className="flex flex-col gap-4 text-black mb-4">
              {/* Conditional Fields */}
              {activeTab === "Menus" && <>
                <InputField placeholder="Menu Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                <InputField placeholder="Category" value={newItem.catagory} onChange={e => setNewItem({ ...newItem, catagory: e.target.value })} />
              </>}
              {activeTab === "Tables" && <>
                <InputField placeholder="Table Number" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                <InputField type="number" placeholder="Capacity" value={newItem.capacity} onChange={e => setNewItem({ ...newItem, capacity: e.target.value })} />
              </>}
              {activeTab === "Garsons" && <>
                <InputField placeholder="Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                <InputField type="email" placeholder="Email" value={newItem.email} onChange={e => setNewItem({ ...newItem, email: e.target.value })} />
                <InputField type="password" placeholder="Password" value={newItem.password} onChange={e => setNewItem({ ...newItem, password: e.target.value })} />
                <select value={newItem.role} onChange={e => setNewItem({ ...newItem, role: e.target.value })} className="border p-2 rounded w-full">
                  <option value="">Select Role</option>
                  {role.map(r => <option key={r._id} value={r._id}>{r.role}</option>)}
                </select>
                <InputField type="number" placeholder="Phone" value={newItem.phone} onChange={e => setNewItem({ ...newItem, phone: e.target.value })} />
              </>}
              {activeTab === "Role" && <>
                <InputField placeholder="Role Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                <div className="flex flex-wrap gap-2 max-h-32 overflow-auto border p-2 rounded">
                  {permissions.map(p => (
                    <label key={p._id} className="flex items-center gap-1">
                      <input type="checkbox" checked={newItem.selectedPermissions.includes(p._id)} onChange={e => {
                        const selected = newItem.selectedPermissions;
                        setNewItem({ ...newItem, selectedPermissions: e.target.checked ? [...selected, p._id] : selected.filter(x => x !== p._id) });
                      }} />
                      {p.name}
                    </label>
                  ))}
                </div>
              </>}
              {activeTab === "Staff" && <>
                <InputField placeholder="Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                <InputField placeholder="Phone" value={newItem.phone} onChange={e => setNewItem({ ...newItem, phone: e.target.value })} />
                <InputField placeholder="Address" value={newItem.address} onChange={e => setNewItem({ ...newItem, address: e.target.value })} />
                <InputField placeholder="National ID" value={newItem.nationalId} onChange={e => setNewItem({ ...newItem, nationalId: e.target.value })} />
                <InputField placeholder="Salary" value={newItem.salary} onChange={e => setNewItem({ ...newItem, salary: e.target.value })} />
                <select value={newItem.status} onChange={e => setNewItem({ ...newItem, status: e.target.value })} className="border p-2 rounded w-full">
                  <option value="">Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="terminated">Terminated</option>
                </select>
                <select value={newItem.employmentType} onChange={e => setNewItem({ ...newItem, employmentType: e.target.value })} className="border p-2 rounded w-full">
                  <option value="">Employment Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                </select>
              </>}
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