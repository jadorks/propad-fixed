import React, { useState } from "react";
import Select from "./Select";
import SelectGroup from "./SelectGroup";
import Button from "./Button";
import uniswap from "../assets/images/uniswap.svg";
import sushiswap from "../assets/images/sushiswap.svg";
import arbitrum from "../assets/images/arbitrum.svg";
import rocket from "../assets/images/rocket.svg";
import cancel from "../assets/images/cancel.svg";
import arrow from "../assets/images/arrow-forward.svg";
import arrowBAck from "../assets/images/back-arrow.svg";
//Handle the toggline of the modal from the calling
//component
//Also handle the hide and disaply of the modal content
//based on the state of the user
// The behavior of modal currently is giving you the idea
//of how it should behave
function Modal({ hanbdleClose }) {
  const [step, setStep] = useState(1);

  const list = [
    {
      text: "Sushiswap",
      image: sushiswap,
    },
    {
      text: "Uniswap",
      image: uniswap,
    },
  ];

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div className="modal-container">
      <div className="modal">
        <div className="stretch modal__header">
          <div className="simple-flex">
            <img src={rocket} alt="A rocket" className="rocket" />
            <h3 className="modal__heading">Create A Launch Project</h3>
          </div>
          <img
            onClick={hanbdleClose}
            src={cancel}
            alt="Cancel Icon"
            className="cancel"
          />
        </div>
        <div className="modal__body">
          <Select text="Arbitrum" icon={arbitrum} />
          {step === 1 && (
            <SelectGroup
              list={list}
              tagline="Decentralized Exchange"
              type="select__bottom"
            />
          )}

          {step == 2 && (
            <div className="select select__bottom token-address">
              <input type="text" placeholder="Type here" />
              <p className="select__tagline">Token Address</p>
            </div>
          )}

          <div className="modal__button">
            {step > 1 && (
              <Button
                handleClick={handleBack}
                type="button__skewed-left button__full button__flex"
              >
                <img src={arrowBAck} /> Back
              </Button>
            )}
            <Button
              text="Next"
              icon={arrow}
              type={`button__skewed button__full button__flex
               ${step > 0 ? "next-button" : ""}`}
              handleClick={handleNext}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
