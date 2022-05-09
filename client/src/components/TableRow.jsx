import React from "react";
import startGreen from "../assets/images/start-green.svg";
import lockGreen from "../assets/images/lock-green.svg";
import lockRed from "../assets/images/lock-red.svg";
import startRed from "../assets/images/start-red.svg";
import startGold from "../assets/images/start-gold.svg";
import lockGold from "../assets/images/lock-gold.svg";
import { Link } from "react-router-dom";
import shortedAddress from "../utils/shortenAddress";
import Web3 from "web3";
import { numFormatter, usdFormatter } from "../utils/utils";

//You only need one row here for the job.
// Then pass the content to the component via
// the properties prop. There are three rows here
// to serve the purpose of the design
function TableRow({ lock }) {
  const unlocked =
    Date.now() > new Date(Number(lock?._unlockDateTime)).getTime();

  const unlockDateTime = new Date(
    Number(lock?._unlockDateTime)
  ).toLocaleString();

  return (
    <>
      <div className="table-row">
        <div className="table-column">
          <p className="table-column__text">{lock?._lockType || null}</p>
        </div>
        <div className="table-column">
          <div>
            <p className="table-column__text">{lock?._symbol}</p>
            <p className="table-column__text-sub">{lock?._name} </p>
          </div>
        </div>
        <div className="table-column">
          <p className="table-column__text">{lock?._lockDate || null}</p>
        </div>
        <div className="table-column">
          <div>
            <p className="table-column__text">
              {numFormatter(
                Number(Web3.utils.fromWei(lock?._tokenAmount || "0")).toFixed(2)
              )}
            </p>
            <p className="table-column__text-sub">{lock?._percentage}% </p>
          </div>
        </div>
        <div className="table-column">
          <p className="table-column__text">
            {usdFormatter.format(lock?._value)}
          </p>
        </div>
        <div className="table-column">
          <div>
            <p className="table-column__text">
              {lock?._unlockDays > 365
                ? `${(lock?._unlockDays / 365).toFixed(2)} Years`
                : `${lock?._unlockDays} ${
                    lock?._unlockDays > 1 ? "Days" : "Day"
                  }`}
            </p>
            <p className="table-column__text-sub">{unlockDateTime}</p>
          </div>
          {lock?._unlockDays > 200 && <img src={startGreen} alt="best" />}
          {lock?._unlockDays > 50 && lock?._unlockDays < 200 && (
            <img src={startGold} alt="good" />
          )}
          {lock?._unlockDays < 50 && <img src={startRed} alt="critical" />}
        </div>
        {lock?._withdrawn && (
          <div className="table-column">
            <p className="table-column__text text-red">Withdrawn</p>
            <img src={lockRed} alt="withdrawn" />
          </div>
        )}
        {!lock?._withdrawn && unlocked ? (
          <div className="table-column">
            <p className="table-column__text text-gold">Unlocked</p>
            <img src={lockGold} alt="unlocked" />
          </div>
        ) : (
          <div className="table-column">
            <p className="table-column__text text-green">Locked</p>
            <img src={lockGreen} alt="locked" />
          </div>
        )}
        <div className="table-column">
          <Link to={`/app/locker/${lock?._tokenAddress}/${lock?._id}`}>
            <p className="table-column__text text-blue">
              {shortedAddress(lock?._tokenAddress || "") || null}
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}

export default TableRow;
