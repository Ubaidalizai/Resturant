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
    primary: "btn-primary",
    secondary: "btn-secondary",
    cancel: "btn-cancel",
    danger: "btn-danger",
    success: "btn-success",
    outline: "btn-secondary",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-medium disabled:cursor-not-allowed disabled:opacity-55 ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
