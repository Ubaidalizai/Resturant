import FoodCard from "./FoodCard";

function FoodGrid({ foods, cart, setCart, resetKey = 0 }) {
  if (!foods || foods.length === 0) {
    return <p className="text-slate-500">No foods available in this category.</p>;
  }

  return (
    <div className="food-card-grid">
      {foods.map((food) => (
        <FoodCard
          key={`${food._id}-${resetKey}`}
          food={food}
          cart={cart}
          setCart={setCart}
          resetKey={resetKey}
        />
      ))}
    </div>
  );
}

export default FoodGrid;
