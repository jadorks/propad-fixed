import Web3 from "web3";
import ArbiCryptLocker from "../contracts/ArbiCryptLocker.json";
import { depositsByTokenAddress } from "../utils/lockerUtils";

const fromAddress = process.env.REACT_APP_ADDRESS_ZERO;
const contractAddress = process.env.REACT_APP_LOCKER_CONTRACT;

const getSearchResult = async (address) => {
  const locks = [];
  try {
    const web3 = new Web3(
      new Web3.providers.WebsocketProvider(process.env.REACT_APP_INFURA_WSS_URL)
    );

    const lockerContract = new web3.eth.Contract(
      ArbiCryptLocker.abi,
      contractAddress
    );

    const tokenLocksInContract = await depositsByTokenAddress(
      lockerContract,
      address,
      fromAddress
    );
    console.log(tokenLocksInContract);

    if (tokenLocksInContract?.length > 0) {
      for (let lockId of tokenLocksInContract) {
        const lock = { address, lockId };
        locks.push(lock);
      }

      return {
        foundLocks: true,
        returned: true,
        locks,
      };
    }
    return {
      foundLocks: false,
      returned: true,
      locks,
    };
  } catch (error) {
    return {
      foundLocks: false,
      returned: true,
      locks,
    };
  }
};

export default getSearchResult;
