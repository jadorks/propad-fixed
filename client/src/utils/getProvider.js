import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const getProvider = () => {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.REACT_APP_INFURA_KEY,
      },
    },
  };

  return new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions,
  });
};

export default getProvider;
