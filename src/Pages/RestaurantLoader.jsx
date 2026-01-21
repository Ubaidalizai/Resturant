import { FaUtensils } from "react-icons/fa";

function RestaurantLoader({ message = "  Preparing your menu..." }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
      <FaUtensils className="text-yellow-500 text-6xl animate-spin mb-4" />
      <p className="text-white text-xl font-semibold tracking-wide">
        {message}
      </p>
    </div>
  );
}

export default RestaurantLoader;
