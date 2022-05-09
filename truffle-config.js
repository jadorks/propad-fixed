const HDWalletProvider = require("@truffle/hdwallet-provider");

const path = require("path");
require("dotenv").config();
const mnemonic = process.env["MNEMONIC"];
const infuraKey = process.env["INFURA_KEY"];

const mainnetMnemonic = process.env["MAINNET_MNEMONIC"];

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),

  networks: {
    development: {
      url: "http://127.0.0.1:7545",
      network_id: "*",
    },
    // for use with local environment -- use `npm runLocalArbitrum` to start
    // after you have installed the repo and run `npm runLocalEthereum`, which will run a test L1 chain
    arbitrum_local: {
      network_id: "*",
      gas: 8500000,
      provider: function () {
        return new HDWalletProvider({
          mnemonic: {
            phrase: mnemonic,
          },
          providerOrUrl: "http://127.0.0.1:8547/",
          addressIndex: 0,
          numberOfAddresses: 1,
        });
      },
    },
    arbitrum_testnet: {
      network_id: 421611,
      provider: function () {
        return new HDWalletProvider({
          mnemonic,
          providerOrUrl: "https://arbitrum-rinkeby.infura.io/v3/" + infuraKey,
          addressIndex: 0,
          numberOfAddresses: 1,
          network_id: 421611,
          chainId: 421611,
        });
      },
    },
    // requires a mainnet mnemonic; you can save this in .env or in whatever secure location
    // you wish to use
    arbitrum_mainnet: {
      network_id: 42161,
      chain_id: 42161,
      provider: function () {
        return new HDWalletProvider(
          mainnetMnemonic,
          "https://arbitrum-mainnet.infura.io/v3/" + infuraKey,
          0,
          1
        );
      },
    },
    ropsten:{
      provider: () => new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/" + infuraKey),
      network_id: 3,
      gas: 5500000
    }
  },
  compilers: {
    solc: {
      version: "0.8.4",
    },
  },
  plugins: ["truffle-plugin-verify"],
};
