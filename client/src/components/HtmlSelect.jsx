import React, { useState } from "react";
import chevronDown from "../assets/images/chevron-down-white.svg";
import chevronUp from "../assets/images/chevron-top-white.svg";

//Take care of how this component stretches from the
//calling component.

function HtmlSelect({ placeholder, handleClick, options, icon }) {
  const [option, setOption] = useState({ label: placeholder, value: "" });
  const [active, setActive] = useState(false);
  const handleSelectClick = () => {
    setActive(!active);
  };

  const handleOptionSelect = (option) => {
    setOption(option);
    setActive(false);
    // handleClick(option) This will come from calling component
  };

  return (
    <div>
      <div onClick={handleSelectClick} className="select normal-select stretch">
        <div className="simple-flex">
          {icon && <img src={icon} alt="" className="normal-select__image" />}
          <p>{option.label}</p>
        </div>
        <div>
          <img
            className="normal-select__chevron"
            src={chevronUp}
            alt="Top Arrow"
          />
          <img
            className="normal-select__chevron"
            src={chevronDown}
            alt="Down Arrow"
          />
        </div>
      </div>

      {active &&
        options.map(({ label, value }) => (
          <div
            onClick={() => handleOptionSelect({ label, value })}
            className="normal-select-item"
          >
            <p className="normal-select-item__text">{label}</p>
          </div>
        ))}
    </div>
  );
}

export default HtmlSelect;
