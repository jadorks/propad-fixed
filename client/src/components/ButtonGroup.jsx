import React from "react";
import Button from "./Button";

function ButtonGroup({ image, buttonText, text, handleClick }) {
  return (
    <div onClick={handleClick} className="button-group">
      <h5 className="button-group__text">{text}</h5>
      <button className="button button__skewed">
        {buttonText} <img src={image} alt="Button icon" />
      </button>
    </div>
  );
}

export default ButtonGroup;
