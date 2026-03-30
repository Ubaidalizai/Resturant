import React from "react";

const Button = ({
  children,
  onClick,
  className = "",
  type = "button",
  variant = "primary",
  ...rest
}) => {
  const variantClasses = {
    primary: "bg-yellow-500 text-white hover:bg-yellow-600",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
