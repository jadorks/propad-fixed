import React, { useContext } from "react";
import BlockchainContext from "../context/BlockchainContext";
import ConnectionContext from "../context/ConnectionContext";
import shortedAddress from "../utils/shortenAddress";
import Button2 from "./Button2";
import style from "./ConnectWallet.module.css";

function ConnectWallet() {
  const connectionContext = useContext(ConnectionContext);
  const blockchainContext = useContext(BlockchainContext);
  const { onConnect } = connectionContext;
  const { address } = blockchainContext;

  return (
    <div className={style.connectWallet}>
      <p className={style.connectWallet__text}>
        {address ? (
          shortedAddress(address)
        ) : (
          <span className={style.connectWallet__text_span}>Connect Wallet</span>
        )}
      </p>
      <Button2 handleClick={onConnect} className={style.connectWallet_button}>
        <p className={style.connectWallet__network}>ETH</p>
      </Button2>
    </div>
  );
}

export default ConnectWallet;
