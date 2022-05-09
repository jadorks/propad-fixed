import React from "react";
// Use these classes to get the various styles
// button__small button__skewed
function Button({ text, handleClick, type, icon, children }) {
  return (
    <button onClick={handleClick} className={`button ${type}`}>
      {!children && text}
      {!children && icon && <img src={icon} alt="icon" />}
      {children && children}
    </button>
  );
}

export default Button;
