import React, { useContext, useEffect, useState } from "react";
import arrow from "../assets/images/arrow-forward.svg";
import Button2 from "./Button2";
import SearchGroup from "./SearchGroup";
import transferOwnership from "../assets/images/transfer-ownership.svg";
import style from "./TransferOwnership.module.css";
import cancel from "../assets/images/cancel.svg";
import Web3 from "web3";
import ArbiCryptLocker from "../contracts/ArbiCryptLocker.json";
import { useHistory } from "react-router";
import {transferLocks} from "../utils/lockerUtils"

const contractAddress = process.env.REACT_APP_LOCKER_CONTRACT;

function TransferOwnership({ hanbdleClose, lockId, address }) {

  const history = useHistory();

  const [isTransferring, setIsTransferring] = useState(false);


  const transferTheTokens = async () => {
    try{
      const web3 = new Web3(
        new Web3.providers.WebsocketProvider(
          process.env.REACT_APP_INFURA_WSS_URL
        )
      );

      const lockerContract = new web3.eth.Contract(
        ArbiCryptLocker.abi,
        contractAddress
      );

      setIsTransferring(true);

      await transferLocks(lockerContract, lockId, address);

      lockerContract.events.Transfer({ fromBlock: 0 }).on("data", ({ returnValues }) => {
        if(returnValues.to === address){

        setIsTransferring(false);

        history.push(`/app/locker/${address}`);
        hanbdleClose();
      }});
    } catch(error){
      setIsTransferring(false);

      console.log(error);
    }
  }

  return (
    <div className="modal-container">
      <div className="modal lock-modal">
        <div className="stretch modal__header">
          <div className="simple-flex">
            <img src={transferOwnership} alt="A Transfer" className="rocket" />
            <h3 className="modal__heading">Transfer Ownership</h3>
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
            Enter the new owner address and click on “Transfer”.
          </h4>
          <SearchGroup placeholder="New owner address..." />
          <h4 className={style.modalText}>
            e.g 0dbz8e98dinih8ewrhtfuihnjgrn jvnu7484678478
          </h4>
          <Button2 handleClick={transferTheTokens} type={"right-skewed"} className="lock-approve">
            <p className="text-white font-sans font-medium">Transfer</p>
            <img src={arrow} alt="locks" width="18" />
          </Button2>
        </div>
      </div>
    </div>
  );
}

export default TransferOwnership;
