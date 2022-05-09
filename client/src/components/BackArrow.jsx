import React from "react";
import arrow from "../assets/images/back-arrow.svg";
function BackArrow({ handleClick }) {
  return (
    <div onClick={handleClick} className="simple-flex back-arrow">
      <img src={arrow} alt="Back Icon" className="back-icon" />
      <p className="back-text">Back</p>
    </div>
  );
}

export default BackArrow;
