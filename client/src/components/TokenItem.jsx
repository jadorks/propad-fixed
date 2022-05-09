import React from "react";
import Button from "./Button";
import sushiswap from "../assets/images/sushiswap.svg";
import edit from "../assets/images/edit-bg.svg";
import eth from "../assets/images/Eth.svg";

//take care of how this component stretches from the
//calling component.
function TokenItem(props) {
  return (
    <div className="tokens-box">
      <div className="token-item simple-flex">
        <div className="token-item__box-one">
          <h5 className="token__network">Selected Decentralized Network</h5>
        </div>
        <div className="token-item__box-two stretch">
          <div className="simple-flex token__icon-container">
            <img src={sushiswap} alt="Sushiswap" className="token__icon" />
            <p className="token__name">Sushiswap</p>
          </div>
          <Button type="button__skewed button__small button__flex">
            <img src={edit} /> Edit
          </Button>
        </div>
      </div>
      <div className="token-item simple-flex">
        <div className="token-item__box-one">
          <h5 className="token__network">Selected Token</h5>
        </div>
        <div className="token-item__box-two stretch">
          <div className="simple-flex token__icon-container">
            <img src={eth} alt="Sushiswap" className="token__icon" />
            <p className="token__name">Ethereum</p>
          </div>
          <Button type="button__skewed button__small button__flex">
            <img src={edit} /> Edit
          </Button>
        </div>
      </div>
      <div className="token-item simple-flex">
        <div className="token-item__box-one">
          <h5 className="token__network">Selected Token</h5>
        </div>
        <div className="token-item__box-two stretch">
          <div className="simple-flex token__icon-container">
            <p className="token__name">
              0xc89C669357D161d57B0b255C94eA96E179999919
            </p>
          </div>
          <Button type="button__skewed button__small button__flex">
            <img src={edit} /> Edit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TokenItem;
