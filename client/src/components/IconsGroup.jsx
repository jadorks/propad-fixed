import React from "react";
import max from "../assets/images/max.svg";
import baseline from "../assets/images/baseline.svg";
import eth from "../assets/images/Eth.svg";
function IconsGroup(props) {
  return (
    <div className="icons-group">
      <img src={max} alt="" className="icons-group__icon" />
      <img src={baseline} alt="" className="icons-group__icon" />
      <img src={eth} alt="" className="icons-group__icon" />
      <p className="icons-group__text">UNI-V2</p>
    </div>
  );
}

export default IconsGroup;
