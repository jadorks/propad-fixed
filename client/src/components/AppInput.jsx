import React from "react";

function AppInput({ placeholder, handleChange }) {
  return (
    <input
      onChange={handleChange}
      placeholder={placeholder}
      type="text"
      className="app-input select"
    />
  );
}

export default AppInput;
