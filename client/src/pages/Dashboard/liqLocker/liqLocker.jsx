import React, { useCallback, useEffect, useState } from "react";
import Table from "../../../components/Table";
import style from "./liqLocker.module.css";
import illustration from "../../../assets/images/lockerIllustration.svg";
import forwardArrow from "../../../assets/images/arrow-forward.svg";
import SearchGroup from "../../../components/SearchGroup";
import NewLockModal from "../../../components/NewLockModal";
import Button2 from "../../../components/Button2";
import getAllLocks from "../../../api/getAllLocks";
import Web3 from "web3";
import ArbiCryptLocker from "../../../contracts/ArbiCryptLocker.json";
import getSearchResult from "../../../api/getSearchResult";

const contractAddress = process.env.REACT_APP_LOCKER_CONTRACT;

function LiqLocker() {
  const [showModal, setShowModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [tokenLocks, setTokenLocks] = useState([]);
  const [newLockDetected, setNewLockDetected] = useState([]);

  const runGetAllLocks = useCallback(async () => {
    const locks = await getAllLocks();
    setTokenLocks(locks);
  }, []);

  useEffect(() => {
    runGetAllLocks();
  }, [runGetAllLocks, newLockDetected]);

  const initCreateLock = (e) => {
    setShowModal(true);
  };

  const closeModal = (e) => {
    setShowModal(false);
  };

  const listenForLocks = async () => {
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

      lockerContract.events
        .LogLock({ fromBlock: 0 })
        .on("data", (event) => {
          setNewLockDetected(true);
        })
        .on("error", (error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    listenForLocks();
  }, [tokenLocks]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    const meetsLimit = value.length === 42;

    const res = Web3.utils.isAddress(value);

    if (meetsLimit && res) {
      setIsSearching(true);
      const results = await getSearchResult(value);
      console.log(results);
      if (results?.returned) {
        setIsSearching(false);
      }
    }
  };
  return (
    <div className="LiqLocker mt-10">
      <div className={style.content__top}>
        <div className={style.content__top_container}>
          <h1 className={style.content_top_head}>
            Your Most Trusted Liquidity <br /> Locker
          </h1>
          <p className={style.content_top_text}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore.
          </p>
          <div className={`flex mt-12`}>
            <Button2
              handleClick={initCreateLock}
              className={`${style.new_lock}`}
            >
              <p className="text-white font-sans font-medium">Create Lock</p>
              <img src={forwardArrow} alt="locks" width="18" />
            </Button2>
          </div>
        </div>
        <img
          src={illustration}
          className={style.content_illustration}
          alt="Hero Illustration"
        />
      </div>
      <div className={style.content__mid}>
        <h1 className={style.content__mid_lp}>Liquidity Pools</h1>
        <div className={style.content__mid_search}>
          <SearchGroup
            isLoading={isSearching}
            handleChange={(e) => handleInputChange(e)}
            placeholder="Search by Lock address"
          />
        </div>
      </div>
      <div className={style.content__table}>
        <Table isLoading={true} locks={tokenLocks} />
      </div>
      {showModal && <NewLockModal hanbdleClose={closeModal} />}
    </div>
  );
}

export default LiqLocker;
