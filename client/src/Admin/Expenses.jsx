import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { baseURL } from "../configs/baseURL.config";

function Expenses() {

  //  CATEGORY STATES 
  const [categories, setCategories] = useState([]);
  const [showCatModal, setShowCatModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editCatId, setEditCatId] = useState(null);

  //  EXPENSE STATES 
  const [expenses, setExpenses] = useState([]);
  const [showExpModal, setShowExpModal] = useState(false);
  const [title, setTitle] = useState("");
  const [catagoryId, setCatagoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  //  GET CATEGORIES 
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/v1/expenseCatagories/all`);

      if (Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        setCategories(res.data.data || []);
      }

    } catch (err) {
      console.log(err);
      setCategories([]);
    }
  };

  //  GET EXPENSES 
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/v1/expenses/all`);

      if (Array.isArray(res.data)) {
        setExpenses(res.data);
        console.log(res)
      } else {
        setExpenses(res.data.data || []);
        console.log(res)
      }

    } catch (err) {
      console.log(err);
      setExpenses([]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, []);

  //  ADD / UPDATE CATEGORY 
  const saveCategory = async () => {
    if (!name) {
      toast.error("Category name required");
      return;
    }

    try {
      if (editCatId) {
        await axios.put(
          `${baseURL}/api/v1/expenseCatagories/update/${editCatId}`,
          { name, description }
        );
        toast.success("Category Updated");
      } else {
        await axios.post(
          `${baseURL}/api/v1/expenseCatagories/add`,
          { name, description }
        );
        toast.success("Category Added");
      }

      setName("");
      setDescription("");
      setEditCatId(null);
      setShowCatModal(false);
      fetchCategories();

    } catch (err) {
      console.log(err);
      toast.error("Operation failed");
    }
  };

  //  DELETE CATEGORY 
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/v1/expenseCatagories/delete/${id}`);
      toast.success("Category Deleted");
      fetchCategories();
    } catch (err) {
      console.log(err);
    }
  };

  //  EDIT CATEGORY 
  const editCategory = (cat) => {
    setEditCatId(cat._id);
    setName(cat.name);
    setDescription(cat.description);
    setShowCatModal(true);
  };

  //  ADD EXPENSE 
  const addExpense = async () => {

    if (!title || !catagoryId || !amount) {
      toast.error("Fill required fields");
      return;
    }

    try {
      console.log(catagoryId);
      await axios.post(`${baseURL}/api/v1/expenses/add`, {
        title,
        catagory: catagoryId,
        amount,
        expensesDate: date,
        note
      });

      toast.success('Expenses added successfully');
      setTitle("");
      setCatagoryId("");
      setAmount("");
      setDate("");
      setNote("");
      setShowExpModal(false);

      fetchExpenses();

    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  //  DELETE EXPENSE 
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/v1/expenses/delete/${id}`);
      toast.success("Expense Deleted");
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 text-black">

      <h1 className="text-3xl font-bold text-yellow-600 mb-6">
        Expenses Management
      </h1>

      {/* ADD CATEGORY BUTTON */}
      <button
        onClick={() => {
          setShowCatModal(true);
          setEditCatId(null);
          setName("");
          setDescription("");
        }}
        className="bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2 mb-6"
      >
        <AiOutlinePlus /> Add Category
      </button>

      {/* CATEGORY MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[350px] relative">

            <button className="absolute right-3 top-3" onClick={() => setShowCatModal(false)}>
              <AiOutlineClose size={20} />
            </button>

            <h2 className="text-xl mb-4">
              {editCatId ? "Edit Category" : "Add Category"}
            </h2>

            <input
              className="border p-2 w-full mb-3"
              placeholder="Category Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <input
              className="border p-2 w-full mb-4"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCatModal(false)} className="bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={saveCategory} className="bg-yellow-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CATEGORY TABLE */}
      <div className="bg-white shadow-2xl rounded-2xl p-6 mb-8 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>

        <table className="w-full border border-gray-200">
          <thead className="bg-yellow-50">
            <tr>
              <th className="p-3 border text-left">Name</th>
              <th className="p-3 border text-left">Description</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-6 text-gray-400">
                  No categories
                </td>
              </tr>
            ) : (
              categories.map(c => (
                <tr key={c._id}>
                  <td className="p-3 border">{c.name}</td>
                  <td className="p-3 border">{c.description}</td>
                  <td className="p-3 border text-center">
                    <div className="flex justify-center gap-4">
                      <AiOutlineEdit className="text-blue-500 cursor-pointer" size={20} onClick={() => editCategory(c)} />
                      <AiOutlineDelete className="text-red-500 cursor-pointer" size={20} onClick={() => deleteCategory(c._id)} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* EXPENSE TABLE */}
      <div className="bg-white shadow-2xl rounded-2xl p-6 overflow-x-auto">

        <div className="grid md:grid-cols-2 gap-4 mb-4 items-center">
          <h2 className="text-xl font-semibold">All Expenses</h2>

          <div className="flex md:justify-end">
            <button
              onClick={() => setShowExpModal(true)}
              className="bg-yellow-600 text-white px-4 py-2 rounded flex gap-2 items-center"
            >
              <AiOutlinePlus /> Add Expense
            </button>
          </div>
        </div>

        <table className="w-full border border-gray-200">
          <thead className="bg-yellow-50">
            <tr>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Note</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-400">
                  No expenses
                </td>
              </tr>
            ) : (
              expenses.map(e => (
                <tr key={e._id} className="text-center">
                  <td className="p-3 border">{e.title}</td>
                  <td className="p-3 border">{e.catagoryId?.name || "-"}</td>
                  <td className="p-3 border text-red-600">${e.amount}</td>
                  <td className="p-3 border">{e.expensesDate?.slice(0,10)}</td>
                  <td className="p-3 border">{e.note}</td>
                  <td className="p-3 border">
                    <AiOutlineDelete
                      className="text-red-500 cursor-pointer mx-auto"
                      size={20}
                      onClick={() => deleteExpense(e._id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* EXPENSE MODAL */}
      {showExpModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">

            <button className="absolute right-3 top-3" onClick={() => setShowExpModal(false)}>
              <AiOutlineClose />
            </button>

            <h2 className="text-xl mb-4">Add Expense</h2>

            <input className="border p-2 w-full mb-3" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />

            <select className="border p-2 w-full mb-3" value={catagoryId} onChange={e => setCatagoryId(e.target.value)}>
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <input className="border p-2 w-full mb-3" type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
            <input className="border p-2 w-full mb-3" type="date" value={date} onChange={e => setDate(e.target.value)} />
            <input className="border p-2 w-full mb-4" placeholder="Note" value={note} onChange={e => setNote(e.target.value)} />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowExpModal(false)} className="bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={addExpense} className="bg-yellow-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Expenses;
