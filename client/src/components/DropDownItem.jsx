import React from "react";

function DropDownItem({ image, text, handleClick, type }) {
  return (
    <div onClick={handleClick} className={`drop-down-item simple-flex ${type}`}>
      <img src={image} alt="Option" className="drop-down-item__image" />
      <p className="drop-down-item__text">{text}</p>
    </div>
  );
}

export default DropDownItem;
