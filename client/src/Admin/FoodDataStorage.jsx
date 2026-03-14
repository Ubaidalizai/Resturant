import { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { useApi } from "../context/ApiContext";
import InputField from "../Components/UI/InputField";
import Button from "../Components/UI/Button";

function FoodDataStorage() {
  const { get, post, put, del, baseURL } = useApi();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(""); 
  const [image, setImage] = useState(null);
  const [enterFoodData, setEnterFoodData] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);

  // Fetch foods (extracted so it can be called on demand)
  const fetchFoods = async () => {
    try {
      const res = await get('/api/v1/foods/all');
      setEnterFoodData(res.data.data || []);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch foods");
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Fetch categories from DB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await get('/api/v1/menues/all');
        setCategories(res.data.data || []);
      } catch (err) {
        console.log(err.message);
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  // Add Food
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name || !price || !category || !image) {
      toast.warn("Please fill all fields and select an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);

      formData.append("catagory", category); // send id, not name

      formData.append("image", image);

      const res = await post(`/api/v1/foods/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // backend returns the new food in res.data.data
      const created = res.data.data;
      // refresh list instead of manual push so filters/search remain accurate
      await fetchFoods();
      setSearch("");
      toast.success(`${created.name} was added successfully`);

      setName("");
      setPrice("");
      setCategory("");
      setImage(null);
      setModal(null);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to add food");
    }
  };

  // Update Food
  const updateFood = async () => {
    if (!name || !price || !category) {
      toast.warn("Please fill all fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("catagory", category); // send id
      if (image instanceof File) {
        formData.append("image", image);
      }

      const res = await put(
        `/api/v1/foods/update/${selectedFood._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedFoods = enterFoodData.map((food) =>
        food._id === selectedFood._id ? res.data.data : food
      );
      setEnterFoodData(updatedFoods);
      // also refresh from backend to pick up any server side changes (e.g. new image path)
      fetchFoods();
      toast.success("Food updated successfully");

      setModal(null);
      setSelectedFood(null);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to update food");
    }
  };

  // Delete Food
  const deleteFood = async () => {
    // selectedFood must be set by caller
    if (!selectedFood) return;
    try {
      const res = await del(`/api/v1/foods/delete/${selectedFood._id}`);
      toast.success(res.data?.message || "Food deleted successfully");
      setEnterFoodData((prev) => prev.filter((f) => f._id !== selectedFood._id));
      fetchFoods();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to delete food");
    } finally {
      setModal(null);
      setSelectedFood(null);
    }
  };

  const filteredFoods = enterFoodData.filter(
    (food) => food.name && food.name.toLowerCase().includes(search.toLowerCase())
  );
    // CHECK PERMISSIONS
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center space-y-8">
      <h1 className="text-4xl font-extrabold text-yellow-600 text-center">
        Foods Storage
      </h1>

      <button
        onClick={() => setModal("add")}
        className="bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:scale-105 transition"
      >
        Add Food
      </button>

      <InputField
        type="text"
        placeholder="Search food by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-4xl border-2 border-yellow-600 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
      />

      {/* Food Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-5xl">
        {filteredFoods.map((food) => (
          <div
            key={food._id}
            className="bg-white rounded-2xl shadow p-6 flex flex-col items-center"
          >
            <img
              src={
                food.image
                  ? `${baseURL}${food.image}`
                  : "https://via.placeholder.com/96?text=No+Image"
              }
              alt={food.name || "Food"}
              className="w-24 h-24 rounded-full mb-4 object-cover"
            />
            <h2 className="text-xl font-bold text-gray-800">{food.name}</h2>
            <p className="text-yellow-600 font-bold text-lg mt-2">${food.price}</p>

            <div className="flex space-x-4 mt-4">
              <AiOutlineEdit
                className="text-yellow-600 cursor-pointer text-xl"
                onClick={() => {
                  setSelectedFood(food);
                  setName(food.name);
                  setPrice(food.price);
                  setCategory(food.catagory._id || food.catagory);
                  setImage(null);
                  setModal("edit");
                }}
              />
              <AiOutlineDelete
                className="text-red-500 cursor-pointer text-xl"
                onClick={() => {
                  setSelectedFood(food);
                  setModal("delete");
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && modal !== "delete" && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 backdrop-blur-sm"></div>
          <div className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl z-10">
            <button
              onClick={() => setModal(null)}
              className="absolute top-4 right-4 font-bold text-yellow-600 text-xl cursor-pointer"
            >
              X
            </button>

            <form
              onSubmit={modal === "add" ? submitHandler : (e) => e.preventDefault()}
              className="space-y-4 text-black"
            >
              <h2 className="text-2xl font-bold text-yellow-600 text-center">
                {modal === "add" ? "Add Food" : "Edit Food"}
              </h2>

              <InputField
                type="text"
                placeholder="Food Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-yellow-600 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
              />

              <InputField
                type="number"
                placeholder="$Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border-2 border-yellow-600 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border-2 border-yellow-600 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <label className="w-full border-2 border-dashed border-yellow-600 rounded-xl px-4 py-3 text-center cursor-pointer flex items-center justify-center hover:bg-yellow-50 transition">
                <span className="font-semibold text-yellow-600">
                  Upload Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>

              <Button
                onClick={modal === "edit" ? updateFood : null}
                type={modal === "add" ? "submit" : "button"}
                className="w-full"
              >
                {modal === "add" ? "Add Food" : "Update Food"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* delete confirmation modal */}
      {modal === "delete" && selectedFood && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="bg-white rounded-3xl p-8 w-full max-w-xs relative shadow-2xl z-10 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Delete Food</h2>
            <p className="mb-6 text-black">
              Are you sure you want to remove "{selectedFood.name}"?
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => { setModal(null); setSelectedFood(null); }}
                className="bg-gray-300 text-black"
              >
                Cancel
              </Button>
              <Button
                onClick={deleteFood}
                className="bg-red-600 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodDataStorage;