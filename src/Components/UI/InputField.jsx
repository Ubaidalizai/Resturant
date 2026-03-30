import React from "react";

// simple controlled input wrapper
// props: value, onChange, placeholder, type, className, ...rest
const InputField = React.forwardRef(({
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  ...rest
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border p-2 rounded w-full ${className}`}
      {...rest}
    />
  );
});

InputField.displayName = "InputField";
export default InputField;
