import React from "react";
import mask from "../assets/images/mask.svg";
import Button from "./Button";
function MaskCard(props) {
  return (
    <div className="mask-card">
      <div className="mas-card__header">
        <img src={mask} alt="Mask Icon" className="mask-card__image" />
      </div>
      <div className="mask-card__body stretch">
        <div>
          <h4 className="mask-card__tagline">Total Raised</h4>
          <h4 className="mask-card__value"> 5,000,000 BNB</h4>
        </div>
        <Button text="Reserve Your Spot" type="button__skewed button__small" />
      </div>
    </div>
  );
}

export default MaskCard;
