import React from "react";
//provided the list from the calling components
// also provide the title of the card from the
//calling parent.
//current data are just here to get the desired
//feel
//list should be an array so that it could be looped.
//Also on wider screens, specify the width of this
//component by wrapping it in an element then give it
// it width
function TokenomicsCard({ list, title }) {
  if (!list) {
    list = [
      { title: "Hard cap", value: "3,700,000" },
      {
        title: "Initia Circulating supply",
        value: "18% of Total token supply",
      },
      {
        title: "Public sale token price",
        value: "0.075 USD",
      },
      {
        title: "Tokens Offered",
        value: "500 C98",
      },
      {
        title: "Hard cap per user",
        value: "2000 USD",
      },
      {
        title: "Token sale vesting period",
        value: "no lockup",
      },
      {
        title: "Token Type",
        value: "BEP20, ERC20",
      },
      {
        title: "Token Distribution",
        value: "After the end of token sale",
      },
      {
        title: "Total token supply",
        value: "1,000,000,000 C98",
      },
    ];
  }

  return (
    <div className="token-card">
      <div className="token-card__header">
        <h2>Tokenomics</h2>
      </div>
      {list.map((l) => (
        <div key={l.title} className="token-card__item">
          <h5 className="token-card__grid-item">{l.title}</h5>
          <h5 className="token-card__grid-item">{l.value}</h5>
        </div>
      ))}
    </div>
  );
}

export default TokenomicsCard;
