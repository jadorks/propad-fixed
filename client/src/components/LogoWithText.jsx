import React from "react";
import logo from "../assets/images/propad-footer-logo.svg";
function LogoWithText({ height }) {
  const size_px = `${height || 60}px`;
  return (
    <img
      src={logo}
      alt="App Logo Text"
      className="logo"
      style={{ width: "auto", height: size_px }}
    />
  );
}

export default LogoWithText;
