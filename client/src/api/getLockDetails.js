import Web3 from "web3";
import CoinGecko from "coingecko-api";
import ArbiCryptLocker from "../contracts/ArbiCryptLocker.json";
import UNIV2PAIR from "../utils/UNIV2PAIR.json";
import ERC20ABI from "../utils/ERC20ABI.json";
import {
  depositsByTokenAddress,
  getDepositDetails,
} from "../utils/lockerUtils";
import { tokenDetails } from "../utils/tokenContractUtitls";
import { pairDetails } from "../utils/univ2PairUtils";
import {
  getPercentage,
  getUSDValue,
  numberOfDaysToDateString,
} from "../utils/utils";

const fromAddress = process.env.REACT_APP_ADDRESS_ZERO;
const contractAddress = process.env.REACT_APP_LOCKER_CONTRACT;

const lockTypeIsLiquidity = async (
  web3,
  _lockType,
  _tokenAddress,
  _tokenAmount,
  _unlockTime,
  totalLockedTokens,
  unlockDate,
  _withdrawn,
  EthUSD,
  address
) => {
  const pairContract = new web3.eth.Contract(UNIV2PAIR, _tokenAddress);
  const { totalSupply, token0, token1, symbol } = await pairDetails(
    pairContract,
    contractAddress
  );

  // get instance of the pair tokens
  // TOKEN 0
  const token0Intance = new web3.eth.Contract(ERC20ABI, token0);
  const token0Details = await tokenDetails(token0Intance, address);

  // TOKEN 1
  const token1Intance = new web3.eth.Contract(ERC20ABI, token1);
  const token1Details = await tokenDetails(token1Intance, address);

  const percentageLocked = getPercentage(_tokenAmount, totalSupply);
  const totalValue = getUSDValue(token1Details.balanceOf, EthUSD);
  const lockedValue = (totalValue * percentageLocked) / 100;
  const totalTokensSupply = web3.utils.fromWei(totalSupply);

  return {
    lock_type: _lockType,
    token_0_symbol: token0Details?.symbol || null,
    token_1_symbol: token1Details?.symbol || null,
    token_0_name: token0Details?.name || null,
    token_1_name: token1Details?.name || null,
    toke_0_address: token0 || null,
    toke_1_address: token1 || null,
    pair_symbol: symbol || null,
    total_locked_tokens: totalLockedTokens || 0,
    total_token_supply: totalTokensSupply || 0,
    percentage_locked: percentageLocked || 0,
    locked_value: lockedValue || 0,
    total_value: totalValue || 0,
    unlock_days: _unlockTime,
    unlock_date: unlockDate,
    widthdrawn: _withdrawn,
    hasError: false,
    error: null,
  };
};

const lockTypeIsToken = async (
  web3,
  _lockType,
  _tokenAddress,
  _tokenAmount,
  _unlockTime,
  _withdrawn,
  unlockDate,
  totalLockedTokens
) => {
  const tokenContract = new web3.eth.Contract(ERC20ABI, _tokenAddress);
  const { totalSupply, symbol, name } = await tokenDetails(
    tokenContract,
    fromAddress
  );

  const percentageLocked = getPercentage(_tokenAmount, totalSupply);
  //   const totalValue = getUSDValue(token1Details.balanceOf, EthUSD);
  //   const lockedValue = (totalValue * percentageLocked) / 100;
  const totalTokensSupply = web3.utils.fromWei(totalSupply);
  return {
    lock_type: _lockType,
    token_0_symbol: symbol || null,
    token_0_name: name || null,
    pair_symbol: symbol || null,
    total_locked_tokens: totalLockedTokens || 0,
    total_token_supply: totalTokensSupply || 0,
    percentage_locked: percentageLocked || 0,
    locked_value: null || 0,
    total_value: null || 0,
    unlock_days: _unlockTime,
    unlock_date: unlockDate,
    widthdrawn: _withdrawn,
    hasError: false,
    error: null,
  };
};

const getLockDetails = async (address, id) => {
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

    // const { _lockType, _tokenAddress, _tokenAmount, _unlockTime, _withdrawn } =
    //   await getDepositDetailsByAddress(lockerContract, address, fromAddress);

    const tokenLocksInContract = await depositsByTokenAddress(
      lockerContract,
      address,
      fromAddress
    );

    if (tokenLocksInContract.includes(id.toString())) {
      const {
        _lockType,
        _tokenAddress,
        _tokenAmount,
        _unlockTime,
        _withdrawn,
      } = await getDepositDetails(lockerContract, id, fromAddress);

      const unlockDate = numberOfDaysToDateString(_unlockTime);
      const totalLockedTokens = web3.utils.fromWei(_tokenAmount);

      // using the _lockType, get the locked token info
      if (_lockType === "Liquidity") {
        const liquidityLock = await lockTypeIsLiquidity(
          web3,
          _lockType,
          _tokenAddress,
          _tokenAmount,
          _unlockTime,
          totalLockedTokens,
          unlockDate,
          _withdrawn,
          EthUSD,
          address
        );
        return { ...liquidityLock };
      } else {
        const tokenLock = await lockTypeIsToken(
          web3,
          _lockType,
          _tokenAddress,
          _tokenAmount,
          _unlockTime,
          _withdrawn,
          unlockDate,
          totalLockedTokens
        );
        return { ...tokenLock };
      }
    } else {
      throw new Error("Lock Not Found");
    }
  } catch (error) {
    const errorStr = error.toString();
    let errorMessage;
    if (
      errorStr.includes("This contract object doesn't have address set yet")
    ) {
      errorMessage = "Error: can't load contract";
    } else if (errorStr.includes("execution reverted")) {
      errorMessage = "Invalid address, check and try again";
    } else {
      errorMessage = errorStr;
    }
    return {
      hasError: true,
      error: errorMessage,
    };
  }
};

export default getLockDetails;
