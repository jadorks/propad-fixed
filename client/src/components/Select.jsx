import React from "react";
import chevronUp from "../assets/images/chevron-up.svg";
import chevronDown from "../assets/images/chevron-down.svg";
import elipsDeep from "../assets/images/elips-deep.svg";
import elipsDark from "../assets/images/elips-dark.svg";
function Select({
  icon,
  text,
  active = false,
  tagline,
  handleClick,
  type,
  seconIcon = false,
  children,
}) {
  return (
    <div onClick={handleClick} className={`select stretch ${type}`}>
      <div>
        <div className="simple-flex">
          <img className="select__icon" src={icon} alt="Select icon" />
          <p className="select__text">{text}</p>
        </div>
        {children && <span>{children}</span>}
      </div>

      {!active && !seconIcon && (
        <img src={chevronDown} alt="" className="select__icon" />
      )}
      {!active && seconIcon && (
        <img src={elipsDark} alt="" className="select__icon" />
      )}
      {active && !seconIcon && (
        <img src={chevronUp} alt="" className="select__icon" />
      )}
      {active && seconIcon && (
        <img src={elipsDeep} alt="" className="select__icon" />
      )}
      {tagline && <p className="select__tagline">{tagline}</p>}
    </div>
  );
}

export default Select;
