import Web3 from "web3";
import CoinGecko from "coingecko-api";
import ArbiCryptLocker from "../contracts/ArbiCryptLocker.json";
import ERC20ABI from "../utils/ERC20ABI.json";
import UNIV2PAIR from "../utils/UNIV2PAIR.json";

import { allDepositIds, getDepositDetails } from "../utils/lockerUtils";
import { tokenDetails } from "../utils/tokenContractUtitls";
import { pairDetails } from "../utils/univ2PairUtils";
import { getPercentage, getUSDValue } from "../utils/utils";

const fromAddress = process.env.REACT_APP_ADDRESS_ZERO;
const contractAddress = process.env.REACT_APP_LOCKER_CONTRACT;

const getAllLocks = async () => {
  const locks = [];
  const CoinGeckoClient = new CoinGecko();
  const { data } = await CoinGeckoClient.simple.price({
    ids: ["ethereum"],
    vs_currencies: ["usd"],
  });

  const EthUSD = data.ethereum.usd;

  try {
    const web3 = new Web3(
      new Web3.providers.WebsocketProvider(process.env.REACT_APP_INFURA_WSS_URL)
    );

    const lockerContract = new web3.eth.Contract(
      ArbiCryptLocker.abi,
      contractAddress
    );

    const lockIds = await allDepositIds(lockerContract, fromAddress);

    if (lockIds) {
      for (let id of lockIds) {
        const lockDetail = await getDepositDetails(
          lockerContract,
          id,
          fromAddress
        );
        if (lockDetail._lockType === "Liquidity") {
          const tokenContract = new web3.eth.Contract(
            UNIV2PAIR,
            lockDetail._tokenAddress
          );

          const { totalSupply, symbol, token0, token1 } = await pairDetails(
            tokenContract,
            fromAddress
          );

          const token0Intance = new web3.eth.Contract(ERC20ABI, token0);
          const token1Intance = new web3.eth.Contract(ERC20ABI, token1);

          const { name } = await tokenDetails(token0Intance, fromAddress);

          const { balanceOf } = await tokenDetails(
            token1Intance,
            lockDetail._tokenAddress
          );
          const percentageLocked = getPercentage(
            lockDetail._tokenAmount,
            totalSupply
          );
          const totalValue = getUSDValue(balanceOf, EthUSD);
          const lockedValue = (totalValue * percentageLocked) / 100;

          locks.push({
            ...lockDetail,
            _id: id,
            _symbol: symbol,
            _name: name,
            _value: lockedValue,
            _percentage: percentageLocked,
          });
        } else {
          const tokenContract = new web3.eth.Contract(
            ERC20ABI,
            lockDetail._tokenAddress
          );

          const { totalSupply, symbol, name } = await tokenDetails(
            tokenContract,
            fromAddress
          );

          const percentageLocked = getPercentage(
            lockDetail._tokenAmount,
            totalSupply
          );
          const lockedValue = 0;

          locks.push({
            ...lockDetail,
            _id: id,
            _symbol: symbol,
            _name: name,
            _value: lockedValue,
            _percentage: percentageLocked,
          });
        }
      }
    }
    return locks;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getAllLocks;
