import React from "react";

const InputField = React.forwardRef(({
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  label = "",
  error = "",
  ...rest
}, ref) => {
  return (
    <div className="form-field">
      {label && <label className="erp-label">{label}</label>}
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`erp-input ${error ? "erp-input-error" : ""} ${className}`}
        {...rest}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
});

InputField.displayName = "InputField";
export default InputField;
