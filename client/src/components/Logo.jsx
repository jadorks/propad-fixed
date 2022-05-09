import React from "react";
import logo from "../assets/images/propad-logo.svg";
function Logo({ size }) {
  const size_px = `${size || 30}px`;
  return (
    <img
      src={logo}
      alt="App Logo"
      className="logo"
      style={{ width: size_px, height: size_px }}
    />
  );
}

export default Logo;
