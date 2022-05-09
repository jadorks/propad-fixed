import React, { useState } from "react";
import DropDownItem from "./DropDownItem";
import Select from "./Select";
function SelectGroup({
  list,
  handleSelection,
  tagline,
  type,
  icon = false,
  optionType = "",
}) {
  const [current, setCurrent] = useState(list[0]);
  const [active, setActive] = useState(false);

  const handleOption = (option) => {
    setCurrent(option);
    setActive(false);
    // handleSelection(item) This will come from the calling
    //component to tract the values to be sent to the server
  };

  const handleSelect = () => {
    setActive(!active);
  };

  return (
    <div className="select-group">
      <Select
        icon={current.image}
        text={current.text}
        active={active}
        handleClick={handleSelect}
        tagline={tagline}
        type={type}
        seconIcon={icon}
      />
      {active &&
        list.map((l) => (
          <DropDownItem
            handleClick={() => handleOption(l)}
            image={l.image}
            text={l.text}
            type={optionType}
          />
        ))}
    </div>
  );
}

export default SelectGroup;
