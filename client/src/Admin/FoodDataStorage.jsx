import { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import axios from "axios";
import { baseURL } from "../configs/baseURL.config";

function FoodDataStorage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [catagory, setCatagory] = useState("");
  const [image, setImage] = useState(null);
  const [enterFoodData, setEnterFoodData] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
 
  // Fetch existing foods from backend
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/v1/foods/all`);
        setEnterFoodData(res.data.data || []);
      } catch (err) {
        console.log(err.message);
        toast.error("Failed to fetch foods");
      }
    };
    fetchFoods();
  }, []);

  // Add Food
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !price || !catagory || !image) {
      toast.warn("Please fill all fields and select an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("catagory", catagory); 
      formData.append("image", image);

      const res = await axios.post(
        `${baseURL}/api/v1/foods/add`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setEnterFoodData((prev) => [...prev, res.data]);
      toast.success(`${res.data.data.name} was added successfully`);

      setName('');
      setPrice("");
      setCatagory("");
      setImage('null');
      setModal(null);
    } catch (err) {
      console.log(err);
      toast.error("Failed to add food");
    }
  };

  // Delete Food
  const deleteFood = async (foodId) => {
    try {
      await axios.delete(`${baseURL}/api/v1/foods/delete/${foodId}`);
      setEnterFoodData((prev) => prev.filter((food) => food._id !== foodId));
      toast.success("Food deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete food");
    }
  };

  // Update Food
  const updateFood = async () => {
    if (!name || !price || !catagory) {
      toast.warn("Please fill all fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("catagory", catagory);
      if (image instanceof File) {
        formData.append("image", image);
      }

      const res = await axios.put(
        `${baseURL}/api/v1/foods/${selectedFood._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedFoods = enterFoodData.map((food) =>
        food._id === selectedFood._id ? res.data : food
      );
      setEnterFoodData(updatedFoods);
      toast.success("Food updated successfully");

      setModal(null);
      setSelectedFood(null);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update food");
    }
  };

  // Safe filter to avoid undefined name errors
  const filteredFoods = enterFoodData.filter(
    (food) => food.name && food.name.toLowerCase().includes(search.toLowerCase())
  );
  console.log(filteredFoods);
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

      <input
        type="text"
        placeholder="Search food by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-4xl border-2 border-yellow-600 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-5xl">
        {filteredFoods.map((food) => (
          <div
            key={food._id}
            className="bg-white rounded-2xl shadow p-6 flex flex-col items-center"
          >
            <img
              src={`${baseURL}/${food.image}`}
              alt={food.name}
              className="w-24 h-24 rounded-full mb-4 object-cover"
            />
            <h2 className="text-xl font-bold text-gray-800">{food.name}</h2>
            <span className="px-4 py-1 rounded-full bg-yellow-100 text-yellow-800 mt-2">
              {food.catagory}
            </span>
            <p className="text-yellow-600 font-bold text-lg mt-2">${food.price}</p>

            <div className="flex space-x-4 mt-4">
              <AiOutlineEdit
                className="text-yellow-600 cursor-pointer text-xl"
                onClick={() => {
                  setSelectedFood(food);
                  setName(food.name);
                  setPrice(food.price);
                  setCatagory(food.catagory);
                  setImage(null); // reset image for editing
                  setModal("edit");
                }}
              />
              <AiOutlineDelete
                className="text-red-500 cursor-pointer text-xl"
                onClick={() => deleteFood(food._id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 backdrop-blur-sm"></div>
          <div className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl z-10">
            <button
              onClick={() => setModal(null)}
              className="absolute top-4 right-4 font-bold text-yellow-600 text-xl cursor-pointer"
            >
              X
            </button>

            {modal === "add" && (
              <form onSubmit={submitHandler} className="space-y-4 text-black">
                <h2 className="text-2xl font-bold text-yellow-600 text-center">
                  Add Food
                </h2>

                <input
                  type="text"
                  placeholder="Food Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-2 border-yellow-600 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                />

                <input
                  type="number"
                  placeholder="$Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border-2 border-yellow-600 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                />

                <select
                  value={catagory}
                  onChange={(e) => setCatagory(e.target.value)}
                  className="border-2 border-yellow-600 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                >
                  <option value="">Select Category</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="lunch">Lunch & Dinner</option>
                  <option value="Drinks">Drinks</option>
                </select>

                <label className="w-full border-2 border-dashed border-yellow-600 rounded-xl px-4 py-3 text-center cursor-pointer flex items-center justify-center hover:bg-yellow-50 transition">
                  <span className="font-semibold text-yellow-600">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>

                <button
                  type="submit"
                  className="bg-yellow-600 text-white font-bold py-3 rounded-xl w-full cursor-pointer hover:scale-105 transition"
                >
                  Add Food
                </button>
              </form>
            )}

            {modal === "edit" && selectedFood && (
              <div className="space-y-4 text-black">
                <h2 className="text-2xl font-bold text-yellow-600 text-center">
                  Edit Food
                </h2>

                <input
                  type="text"
                  placeholder={selectedFood.name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-2 border-yellow-600 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                />

                <input
                  type="number"
                  placeholder={selectedFood.price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border-2 border-yellow-600 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                />

                <select
                  placeholder={selectedFood.catagory}
                  onChange={(e) => setCatagory(e.target.value)}
                  className="border-2 border-yellow-600 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                >
                  <option value="">Select Category</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch & Dinner</option>
                  <option value="Drinks">Drinks</option>
                </select>

                <label className="w-full border-2 border-dashed border-yellow-600 rounded-xl px-4 py-3 text-center cursor-pointer flex items-center justify-center hover:bg-yellow-50 transition">
                  <span className="font-semibold text-yellow-600">Upload New Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>

                <button
                  onClick={updateFood}
                  className="bg-yellow-600 text-white font-bold py-3 rounded-xl w-full cursor-pointer hover:scale-105 transition"
                >
                  Update Food
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodDataStorage;
