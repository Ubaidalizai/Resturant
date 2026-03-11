import React from "react";

// basic button component with tailwind defaults
const Button = ({ children, onClick, className = "", type = "button", ...rest }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 bg-yellow-500 text-white rounded-xl shadow-lg hover:scale-105 hover:bg-yellow-600 transition ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
