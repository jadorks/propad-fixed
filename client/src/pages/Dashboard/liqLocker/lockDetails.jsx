import React, { useCallback, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import style from "./lockDetails.module.css";
import ethLogo from "../../../assets/images/Eth.svg";
import unknown_token from "../../../assets/images/unknow-token.png";
import lock from "../../../assets/images/lock-light-purple.svg";
import bars from "../../../assets/images/bars.svg";
import copy from "../../../assets/images/copy.svg";
import largeLock from "../../../assets/images/large-lock-purple.svg";
import guard from "../../../assets/images/guard.svg";
// import defined from "../../../assets/images/defined.png";
import Button2 from "../../../components/Button2";
import TransferOwnership from "../../../components/TransferOwnership";
import Withdraw from "../../../components/Withdraw";
import shortedAddress from "../../../utils/shortenAddress";
import loading from "../../../assets/images/loading.svg";
import withdraw from "../../../assets/images/withdraw.svg";
import exploreTx from "../../../assets/images/explore-tx.svg";
import wallet from "../../../assets/images/wallet.svg";
import transferOwnership from "../../../assets/images/transfer-ownership.svg";
// import BlockchainContext from "../../../context/BlockchainContext";
// import ContractsContext from "../../../context/ContractsContext";
// import { getDepositDetailsByAddress } from "../../../utils/lockerUtils";
import getLockDetails from "../../../api/getLockDetails";
import { defaultLockDetailsState } from "../../../utils/defaultLockDetailsState";
import { numFormatter, usdFormatter } from "../../../utils/utils";

function LockDetails() {
  // const blockchainContext = useContext(BlockchainContext);
  // const contractsContext = useContext(ContractsContext);
  // const { address, web3Arb } = blockchainContext;
  // const { lockerContract, lockerAddress } = contractsContext;

  const [lockDetails, setTokenDetails] = useState(defaultLockDetailsState);

  const { address, id } = useParams();
  const [showTransfer, setShowTransfer] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isLPLock = lockDetails?.lock_type === "Liquidity";

  const runGetLockDetails = useCallback(async () => {
    setIsLoading(true);
    const lockInfo = await getLockDetails(address, id);
    setTokenDetails(lockInfo);
    if (lockInfo.unlock_days != null) setIsLoading(false);
    if (lockInfo.hasError) setHasError(true);
  }, [address, id]);

  useEffect(() => {
    runGetLockDetails();
  }, [runGetLockDetails]);

  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const onClick = () => setIsActive(!isActive);

  useEffect(() => {
    const pageClickEvent = (e) => {
      // If the active element exists and is clicked outside of
      if (
        dropdownRef.current !== null &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsActive(!isActive);
      }
    };

    // If the item is active (ie open) then listen for clicks
    if (isActive) {
      window.addEventListener("click", pageClickEvent);
    }

    return () => {
      window.removeEventListener("click", pageClickEvent);
    };
  }, [isActive]);

  const initTransferOwnership = (e) => {
    setShowTransfer(true);
    setIsActive(false);
  };

  const initWithdraw = (e) => {
    setShowWithdraw(true);
    setIsActive(false);
  };

  const closeTransfer = (e) => {
    setShowTransfer(false);
    setIsActive(true);
  };

  const closeWithdraw = (e) => {
    setShowWithdraw(false);
    setIsActive(true);
  };

  return (
    <div className="LiqLocker mt-20">
      <div className={style.content}>
        <div className={style.content__top}>
          <div className={style.content__top_pair}>
            <div className={style.content__pair_icons}>
              <img
                className={style.pair__token1}
                src={unknown_token}
                alt="token0"
              />
              {isLPLock && (
                <img className={style.pair__weth} src={ethLogo} alt="token1" />
              )}
            </div>
            <p className={style.content_pair_symbol}>
              {`${lockDetails?.token_0_symbol}`}
              {isLPLock && `/ ${lockDetails?.token_1_symbol}`}
            </p>
          </div>
          <div className={style.content__top_button}>
            <Button2 handleClick={onClick} className={`${style.new_lock}`}>
              <img src={lock} alt="locks" />
              <p className=" text-arbPurple-tLight font-sans font-medium">
                Manage Lock
              </p>
            </Button2>

            <nav
              ref={dropdownRef}
              className={`${style.menu} ${
                isActive ? style.activeMenu : style.inactiveMenu
              }`}
            >
              <ul className={style.list}>
                <li className={style.listItemFirst}>
                  <a href="#" onClick={initWithdraw} className={style.listLink}>
                    <img src={withdraw} className={style.listImage} />
                    Withdraw
                  </a>
                </li>
                <li className={style.listItem}>
                  <a href="#" className={style.listLink}>
                    <img src={exploreTx} className={style.listImage} />
                    Explore Tx
                  </a>
                </li>
                <li className={style.listItem}>
                  <a href="#" className={style.listLink}>
                    <img src={wallet} className={style.listImage} />
                    Connect Wallet
                  </a>
                </li>
                <li className={style.listItemLast}>
                  <a
                    href="#"
                    onClick={initTransferOwnership}
                    className={style.listLink}
                  >
                    <img src={transferOwnership} className={style.listImage} />
                    Transfer Ownership
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className={style.content__contract}>
          <div className={style.content__contract_pair}>
            <p className={style.pair_names}>
              {`${lockDetails?.token_0_name}`}
              {isLPLock && `/${lockDetails?.token_1_name}`}
            </p>
            <p className={style.pair_token1}>
              {shortedAddress(address)} <img src={copy} alt="copy" />
            </p>
          </div>
          <div className={style.content__contract_urls}>
            <a
              href={`https://arbiscan.io/address/${address}`}
              target="_blank"
              rel="noreferrer"
            >
              <span>Arbiscan</span>
              <img src={bars} alt="cols" />
            </a>

            {isLPLock ? (
              <a
                href={`https://v2.info.uniswap.org/pair/${address}`}
                target="_blank"
                rel="noreferrer"
              >
                <span>Uniswap V2</span>
                <img src={bars} alt="cols" />
              </a>
            ) : (
              <a
                href={`https://info.uniswap.org/#/tokens/${address}`}
                target="_blank"
                rel="noreferrer"
              >
                <span>Uniswap</span>
                <img src={bars} alt="cols" />
              </a>
            )}
            {isLPLock ? (
              <a
                href={`https://www.defined.fi/arb/${lockDetails?.toke_0_address}`}
                target="_blank"
                rel="noreferrer"
              >
                {/* <img src={defined} alt="cols" /> */}
                <span>Defined</span>
                <img src={bars} alt="cols" />
              </a>
            ) : (
              <a
                href={`https://www.defined.fi/arb/${address}`}
                target="_blank"
                rel="noreferrer"
              >
                {/* <img src={defined} alt="cols" /> */}
                <span>Defined</span>
                <img src={bars} alt="cols" />
              </a>
            )}
          </div>
        </div>
        <div className={style.content__lock}>
          <div className={style.content__lock_widget}>
            <img src={largeLock} alt="lock" />
            <p
              className={style.lock_percentage}
            >{`${lockDetails?.percentage_locked}% LOCKED`}</p>
            <p className={style.lock_amounts}>
              <span
                className={style.lock_amounts_locked}
              >{`${usdFormatter.format(lockDetails?.locked_value)}`}</span>
              <span
                className={style.lock_amounts_total}
              >{`/ ${usdFormatter.format(lockDetails?.total_value)}`}</span>
            </p>
          </div>
          <div className={style.content__lock_summary}>
            <div className={style.summary__lp}>
              <p>
                {isLPLock ? "Total LP supply" : "Total supply"}
                <span>{numFormatter(lockDetails?.total_locked_tokens)}</span>
              </p>
              <p>
                {isLPLock ? "Total locked LP" : "Total locked tokens"}
                <span>{numFormatter(lockDetails?.total_token_supply)}</span>
              </p>
            </div>
            <div className={style.summary__security}>
              <h1 className={style.security__head}>Liquidity/Token Locks</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod ipsum dolor sit amet
              </p>
            </div>
          </div>
        </div>

        <div className={style.content__bottom}>
          <div className={style.bottom__heads}>
            <p className={style.bottom__16px}>Value</p>
            <p className={style.bottom__16px}>Unlock date</p>
          </div>
          {/* incase of multiple locks for same token */}
          <div className={style.bottom__summary}>
            <div className={style.bottom__summary_left}>
              <p className={style.bottom_amount}>{`${usdFormatter.format(
                lockDetails?.locked_value
              )}`}</p>
              <p className={style.bottom__16px}>{`${numFormatter(
                lockDetails?.total_locked_tokens
              )} ${lockDetails?.pair_symbol}`}</p>
            </div>
            <div className={style.bottom__summary_right}>
              <p className={style.bottom_duration}>
                <img src={guard} alt="lock" />
                <span>{`in ${lockDetails?.unlock_days} Days`}</span>
              </p>
              <p className={style.bottom__16px}>{lockDetails?.unlock_date}</p>
            </div>
          </div>
        </div>
        {isLoading && !hasError && (
          <div className={style.loading_layer}>
            <img className={style.loading_image} src={loading} alt="Loading" />
          </div>
        )}

        {hasError && (
          <div className={style.error_layer}>
            <p>An error occured</p>
            <code>{lockDetails.error}</code>
          </div>
        )}
      </div>

      {showTransfer && <TransferOwnership hanbdleClose={closeTransfer} lockId={id} address={address} />}
      {showWithdraw && <Withdraw hanbdleClose={closeWithdraw} lockId={id} address={address} />}
    </div>
  );
}

export default LockDetails;
