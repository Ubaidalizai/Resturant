import FoodCard from "./FoodCard";

function FoodGrid({ foods, cart, setCart }) {
  if (!foods || foods.length === 0) {
    return <p className="text-gray-500">No foods available in this category.</p>;
  }

  return (
    <div className="flex gap-5 flex-wrap ">
      {foods.map(food => (
        <FoodCard
          key={food._id}
          food={food}
          cart={cart}
          setCart={setCart}
        />
      ))}
    </div>
  );
}

export default FoodGrid;