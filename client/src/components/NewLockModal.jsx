import React, { useContext, useEffect, useState } from "react";
import Select from "./Select";
import SearchGroup from "./SearchGroup";
import lock from "../assets/images/giant-lock.svg";
import cancel from "../assets/images/cancel.svg";
import arbitrum from "../assets/images/arbitrum.svg";
import arrow from "../assets/images/arrow-forward.svg";
import unicorn from "../assets/images/unicorn.svg";
import ContractsContext from "../context/ContractsContext";
import BlockchainContext from "../context/BlockchainContext";
import Web3 from "web3";
import ERC20ABI from "../utils/ERC20ABI.json";
import UNIV2PAIR from "../utils/UNIV2PAIR.json";
import UNIV2FACTORY from "../utils/UNIV2FACTORY.json";
import {
  approveSpendLimit,
  tokenDetails as TokenDetails,
} from "../utils/tokenContractUtitls";
import { onInputNumberChange, numberOfDaysToDateString } from "../utils/utils";
import baseline from "../assets/images/baseline.svg";
import eth from "../assets/images/Eth.svg";
import Button2 from "./Button2";
import ConnectionContext from "../context/ConnectionContext";
import { lockTokens } from "../utils/lockerUtils";
import { useHistory } from "react-router";
import { isValidUniv2Pair, pairDetails } from "../utils/univ2PairUtils";

function NewLockModal({ hanbdleClose }) {
  const history = useHistory();

  const [step, setStep] = useState(1);
  const [lockType, setLockType] = useState("lp"); //lp or tokens
  const [tokenAddress, setTokenAddress] = useState(undefined);
  const [lpAddress, setLpAddress] = useState(undefined);
  const [tokenDetails, setTokenDetails] = useState(undefined);
  const [lockAmount, setLockAmount] = useState(1); //defaults to 1 token
  const [lockDays, setLockDays] = useState(365); // defaults to a year
  const [dateString, setDateString] = useState(
    numberOfDaysToDateString(lockDays)
  ); // defaults to a year

  const [isValidAddress, setIsValidAddress] = useState(true);
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [hasApproved, setHasApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [tokenInstance, setTokenInstance] = useState(undefined);

  const blockchainContext = useContext(BlockchainContext);
  const contractsContext = useContext(ContractsContext);
  const connectionContext = useContext(ConnectionContext);
  const { address, web3Arb } = blockchainContext;
  const { lockerContract, lockerAddress } = contractsContext;
  const { onConnect } = connectionContext;

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const meetsLimit = value.length === 42;

    const res = Web3.utils.isAddress(value);

    if (meetsLimit && res) {
      if (lockType === "lp") {
        setLpAddress(value);
      } else {
        setTokenAddress(value);
      }

      getTokenDetails(value);
      setIsValidAddress(true);
    }

    if (!res) {
      setIsValidAddress(false);
    }
  };

  const getTokenDetails = async (_tokenAddress) => {
    setIsLoadingToken(true);
    if (web3Arb) {
      if (lockType === "tokens") {
        try {
          const tokenInstance = new web3Arb.eth.Contract(
            ERC20ABI,
            _tokenAddress
          );

          const tokenInfo = await TokenDetails(tokenInstance, address);

          setTokenInstance(tokenInstance);
          setTokenDetails(tokenInfo);
          setIsLoadingToken(false);
          setIsValidToken(true);
        } catch (error) {
          setIsValidToken(false);
          setIsLoadingToken(false);
          console.log(error);
        }
      } else if (lockType === "lp") {
        try {
          const v2pairInstance = new web3Arb.eth.Contract(
            UNIV2PAIR,
            _tokenAddress
          );

          const tokenInfo = await pairDetails(v2pairInstance, address);

          const v2Factory = await new web3Arb.eth.Contract(
            UNIV2FACTORY,
            tokenInfo.factory
          );

          const pair = await isValidUniv2Pair(
            v2Factory,
            tokenInfo.token0,
            tokenInfo.token1,
            address
          );

          setTokenInstance(v2pairInstance);
          setTokenDetails(tokenInfo);
          setIsLoadingToken(false);
          if (pair.toUpperCase() === _tokenAddress.toUpperCase())
            setIsValidToken(true);
        } catch (error) {
          setIsValidToken(false);
          setIsLoadingToken(false);
          console.log(error);
        }
      }
    }
  };

  useEffect(() => {
    if (web3Arb && tokenAddress)
      (async () => {
        await getTokenDetails(tokenAddress);
      })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, tokenAddress]);

  const handleDayChange = (value) => {
    setLockDays(value);
    setDateString(numberOfDaysToDateString(value));
  };

  const handleLockAmountChange = (amount) => {
    setLockAmount(amount);
  };

  const approveSpend = async () => {
    try {
      setIsApproving(true);
      const amountToLock = Web3.utils.toWei(lockAmount).toString();
      await approveSpendLimit(
        tokenInstance,
        lockerAddress,
        amountToLock,
        address
      );

      tokenInstance.events
        .Approval({ filter: { owner: address }, fromBlock: 0 })
        .on("data", (event) => {
          setIsApproving(false);
          setHasApproved(true);
        })
        .on("error", (error) => {
          setIsApproving(false);
          setHasApproved(false);
        });

      setIsApproving(false);
      setHasApproved(true);
    } catch (error) {
      setIsApproving(false);
      setHasApproved(false);
    }
  };

  const lockTheTokens = async () => {
    try {
      setIsLocking(true);
      const amountToLock = Web3.utils.toWei(lockAmount).toString();
      const _locktype = lockType === "lp" ? 1 : 2;
      const addressToLock = lockType === "lp" ? lpAddress : tokenAddress;

      await lockTokens(
        lockerContract,
        addressToLock,
        amountToLock,
        lockDays,
        _locktype,
        address
      );

      lockerContract.events
        .LogLock({ fromBlock: 0 })
        .on("data", ({ returnValues }) => {
          if (returnValues._withdrawalAddress === address) {
            setIsLocking(false);
            // history.push(`/app/locker/${returnValues._tokenAddress}`);
            history.push(`/app/locker/${tokenAddress}`);
            hanbdleClose();
          }
        })
        .on("error", (error) => {
          setIsLocking(false);
          console.log(error);
        });

      setIsLocking(false);
    } catch (error) {
      setIsLocking(false);

      console.log(error);
    }
  };
  return (
    <div className="modal-container">
      <div className="modal lock-modal">
        <div className="stretch modal__header">
          <div className="simple-flex">
            <img src={lock} alt="A rocket" className="rocket" />
            {step < 4 && <h3 className="modal__heading">Create new Lock</h3>}
            {step === 4 && <h3 className="modal__heading">Configure Lock</h3>}
            {step > 4 && <h3 className="modal__heading">Confirm new Lock</h3>}
          </div>
          <img
            onClick={hanbdleClose}
            src={cancel}
            alt="Cancel Icon"
            className="cancel"
          />
        </div>
        {step === 1 && (
          <div className="modal__body">
            <h4 className="modal__tagline">
              Select the type of token you would like to create a lock for. You
              can create multiple locks with different settings for each one
            </h4>
            <Select
              handleClick={() => setLockType("lp")}
              type="select--lock"
              text="Liquidity Tokens"
              icon={arbitrum}
              seconIcon={true}
              active={lockType === "lp"}
            >
              UNI-V2 LP Tokens generated from Uniswap Pool
            </Select>
            <Select
              handleClick={() => setLockType("tokens")}
              type="select--lock"
              text="Project Tokens"
              icon={arbitrum}
              seconIcon={true}
              active={lockType === "tokens"}
            >
              Regular ERC-20 Project Tokens
            </Select>

            {!web3Arb ? (
              <Button2
                handleClick={onConnect}
                type={"right-skewed"}
                className="lock-approve"
              >
                <p className="text-white font-sans font-medium">
                  Connect Wallet
                </p>
                <img src={arrow} alt="locks" width="18" />
              </Button2>
            ) : (
              <Button2 handleClick={handleNext} className="lock-approve">
                <p className="text-white font-sans font-medium">Next</p>
                <img src={arrow} alt="locks" width="18" />
              </Button2>
            )}
          </div>
        )}
        {step === 2 && (
          <div className="modal__body">
            <h4 className="modal__tagline">
              Enter the uniswap pair address you would like to lock liquidity
              for
            </h4>
            {lockType === "tokens" ? (
              <SearchGroup
                handleChange={(e) => handleInputChange(e)}
                placeholder="Token address"
              />
            ) : (
              <SearchGroup
                handleChange={(e) => handleInputChange(e)}
                placeholder="Uniswap pair address"
              />
            )}
            <p className="eg">e.g 0x00000000000000000000000000000000</p>
            <Button2
              handleClick={isValidAddress && isValidToken ? handleNext : null}
              className="lock-approve"
              disabled={!isValidAddress || !isValidToken}
              isLoading={isLoadingToken}
            >
              {isValidAddress && isValidToken && (
                <>
                  <p className="text-white font-sans font-medium">Next</p>
                  <img src={arrow} alt="locks" width="18" />
                </>
              )}

              {!isValidToken && (
                <p className="text-white font-sans font-medium">
                  {lockType === "lp" ? "Invalid Uni-V2 Pair" : "Invalid token"}
                </p>
              )}

              {!isValidAddress && (
                <p className="text-white font-sans font-medium">
                  Invalid address
                </p>
              )}
            </Button2>
          </div>
        )}
        {step === 3 && (
          <div className="modal__body">
            <div className="stretch">
              <h5 className="configure-lock__text">Lock Amount</h5>
              <h5 className="configure-lock__text text-blue">
                Balance: {tokenDetails?.balanceOf || 0}
              </h5>
            </div>
            <div className="stretch  configure-buttons">
              <div className="gradient-border">
                <input
                  type="number"
                  value={lockAmount}
                  onChange={(e) => {
                    onInputNumberChange(e, handleLockAmountChange);
                  }}
                  className="input-number"
                />
              </div>

              <div className="lock-button-group">
                <div className="gradient-border">
                  <button
                    className="lock-max-button"
                    onClick={() => setLockAmount(tokenDetails?.balanceOf)}
                  >
                    MAX
                  </button>
                </div>
                <img src={baseline} alt="" className="lock-icons" />
                <img src={eth} alt="" className="lock-icons" />
                <p className="lock-symbol">{tokenDetails?.symbol || "Null"}</p>
              </div>
            </div>
            <div className="stretch">
              <h5 className="configure-lock__text">Unlock Date</h5>
              <h5 className="configure-lock__text text-blue">{dateString}</h5>
            </div>
            <div className="stretch  configure-buttons">
              <div className="gradient-border">
                <input
                  type="number"
                  value={lockDays}
                  onChange={(e) => {
                    onInputNumberChange(e, handleDayChange);
                  }}
                  className="input-number"
                />
              </div>
              <div className="simple-flex">
                <p className="configure-days">Days</p>
              </div>
            </div>
            <Button2
              disabled={lockDays > 0 && lockAmount > 0 ? false : true}
              handleClick={lockDays > 0 && lockAmount > 0 ? handleNext : null}
              className="lock-approve"
            >
              <p className="text-white font-sans font-medium">
                Complete Locking
              </p>
            </Button2>
          </div>
        )}
        {step === 4 && (
          <div className="modal__body">
            <div className="stretch">
              <h5 className="configure-lock__text confirm-lock__text">
                Blockchain selected
              </h5>
              <h5 className="configure-lock__text confirm-lock__text">
                Type of token
              </h5>
            </div>
            <div className="stretch  configure-buttons gap-16">
              <div className="gradient-border w-full">
                <p className=" lock-final-text">
                  <img src={arbitrum} alt="" className="icons-group__icon" />
                  Arbitrum
                </p>
              </div>
              <div className="gradient-border w-full">
                <p className=" lock-final-text">
                  <img src={arbitrum} alt="" className="icons-group__icon" />
                  {lockType === "lp" ? "Liquidity Tokens" : "Project Tokens"}
                </p>
              </div>
            </div>
            <div className="stretch">
              <h5 className="configure-lock__text confirm-lock__text">
                {lockType === "lp" ? "Uniswap pair address" : "Token address"}
              </h5>
              <div className="simple-flex">
                <img src={unicorn} alt="" className="icons-group__icon" />
                <img src={arbitrum} alt="" className="icons-group__icon" />
                <p className="icons-group__text confirm-lock__text">
                  {tokenDetails?.symbol || "Null"}
                  {/* {lockType === "lp" ? "/ WETH" : ""} */}
                </p>
              </div>
            </div>
            <div className="search-group__container">
              <div className="gradient-border w-full">
                {lockType === "tokens" && (
                  <p className=" lock-final-text">
                    {tokenAddress || "invalid address"}
                  </p>
                )}
                {lockType === "lp" && (
                  <p className=" lock-final-text">
                    {lpAddress || "invalid address"}
                  </p>
                )}
              </div>
            </div>
            <div className="lock-approve-confirm">
              <Button2
                type="right-skewed"
                handleClick={approveSpend}
                className="lock-approve bg-arbPurple-tDark6"
                disabled={!isValidToken || hasApproved}
                isLoading={isApproving}
              >
                <p className="text-white font-sans font-medium">
                  {hasApproved ? "Approved" : "Approve Lock"}
                </p>
              </Button2>

              <Button2
                handleClick={lockTheTokens}
                isLoading={isLocking}
                className="lock-approve"
                disabled={!hasApproved}
              >
                <p className="text-white font-sans font-medium">Confirm Lock</p>
              </Button2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewLockModal;
