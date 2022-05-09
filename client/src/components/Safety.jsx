import React from "react";
import safety from "../assets/images/safety-icon.svg";
// Take care of how this component stretches on larger
// from the calling component
function Safety(props) {
  return (
    <div className="safety">
      <div className="simple-flex">
        <img src={safety} alt="Safety Icon" className="safety__icon" />
        <h6 className="safety__header">Safety alert</h6>
      </div>
      <div className="safety__content">
        <p className="safety__text">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem earum
          accusamus reiciendis voluptate, assumenda nesciunt cumque illum illo
          magnam quidem facilis quis rerum cupiditate consequuntur ad sequi nisi
          pariatur minima!
        </p>
      </div>
    </div>
  );
}

export default Safety;
