import React, { useContext, useEffect, useState } from "react";
import arrow from "../assets/images/arrow-forward.svg";
import Button2 from "./Button2";
import withdraw from "../assets/images/withdraw.svg";
import style from "./Withdraw.module.css";
import cancel from "../assets/images/cancel.svg";
import { useHistory } from "react-router";
import Web3 from "web3";
import ContractsContext from "../context/ContractsContext";
import { withdrawTokens } from "../utils/lockerUtils";
import ArbiCryptLocker from "../contracts/ArbiCryptLocker.json";

const contractAddress = process.env.REACT_APP_LOCKER_CONTRACT;

function Withdraw({ hanbdleClose, lockId, address }) {

  const history = useHistory();

  const [isWithdrawing, setIsWithdrawing] = useState(false);



  const withdrawTheTokens = async () => {
    try {
      const web3 = new Web3(
        new Web3.providers.WebsocketProvider(
          process.env.REACT_APP_INFURA_WSS_URL
        )
      );

      const lockerContract = new web3.eth.Contract(
        ArbiCryptLocker.abi,
        contractAddress
      );

      setIsWithdrawing(true);

      await withdrawTokens(lockerContract, lockId, address);

      lockerContract.events
        .LogWithdrawal({ fromBlock: 0 })
        .on("data", ({ returnValues }) => {
          if(returnValues.SentToAddress === address) {
            setIsWithdrawing(false);

            history.push(`/app/locker/${address}`);
            hanbdleClose();
          }
        });
    } catch (error) {
      setIsWithdrawing(false);

      console.log(error);
    }
  };

  return (
    <div className="modal-container">
      <div className="modal lock-modal">
        <div className="stretch modal__header">
          <div className="simple-flex">
            <img src={withdraw} alt="A Transfer" className="rocket" />
            <h3 className="modal__heading">Withdraw</h3>
          </div>
          <img
            onClick={hanbdleClose}
            src={cancel}
            alt="Cancel Icon"
            className="cancel"
          />
        </div>
        <div className="modal__body">
          <h4 className="modal__tagline">
            Please click on Withdraw to confirm withdrawal.
          </h4>
          <Button2 handleClick={withdrawTheTokens} type={"right-skewed"} className="lock-approve">
            <p className="text-white font-sans font-medium">Withdraw</p>
            <img src={arrow} alt="locks" width="18" />
          </Button2>
        </div>
      </div>
    </div>
  );
}

export default Withdraw;
