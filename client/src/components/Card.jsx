import React from "react";
import start from "../assets/images/start.svg";
import progress from "../assets/images/progress.svg";
function Card(props) {
  return (
    <div className="card">
      <div className="card__header stretch">
        <div className="simple-flex">
          <div className="card__logo"></div>
          <h3 className="card__head">Latom</h3>
        </div>
        <div className="simple-flex">
          <img className="start-icon" src={start} alt="Started Icon" />
          <p className="start">Started</p>
        </div>
      </div>
      <p className="card__tagline">A multichain Defi Platform</p>
      <div className="stretch tokens-container">
        <h4 className="tokens-text">Tokens Offered:</h4>
        <h4 className="tokens-value">5,000 BNB</h4>
      </div>
      <div className="stretch tokens-container">
        <h4 className="tokens-text"> Sale price</h4>
        <h4 className="tokens-value">5,000 BNB</h4>
      </div>
      <div className="stretch">
        <h5 className="participant">Total committed</h5>
        <h5 className="participant">Participants</h5>
      </div>
      <div className="stretch">
        <h6 className="tokens-value">5,000 BNB</h6>
        <h6 className="tokens-value">20,000</h6>
      </div>
      <div className="progress-indicator">
        <p>60% Progress</p>
      </div>
      <img className="progress-icon" src={progress} alt="Progress Icon" />
    </div>
  );
}

export default Card;
