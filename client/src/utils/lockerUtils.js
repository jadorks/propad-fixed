import { numberOfDaysTimeStamp, timestampToNumberOfDay } from "./utils";

export const lockerAddress = async (lockerIntance, address) => {
  return lockerIntance.methods
    ._arbicryptLockerAddress()
    .call({ from: address });
};

export const getTotalTokenBalance = async (
  lockerIntance,
  tokenaddress,
  address
) => {
  return lockerIntance.methods
    .getTotalTokenBalance(tokenaddress)
    .call({ from: address });
};

export const getTokenBalanceByAddress = async (
  lockerInstance,
  tokenAddress,
  address
) => {
  return lockerInstance.methods
    .getTokenBalanceByAddress(tokenAddress, address)
    .call({ from: address });
};

export const depositsByWithdrawalAddress = async (
  lockerInstance,
  withdrawalAddres,
  address
) => {
  return lockerInstance.methods
    .getDepositsByWithdrawalAddress(withdrawalAddres)
    .call({ from: address });
};

export const depositsByTokenAddress = async (
  lockerInstance,
  tokenAddres,
  address
) => {
  return lockerInstance.methods
    .getDepositsByTokenAddress(tokenAddres)
    .call({ from: address });
};

export const totalLockedTokensByTokenAddress = async (
  lockerInstance,
  tokenAddres,
  address
) => {
  return lockerInstance.methods
    .getTotalLockedTokensByTokenAddress(tokenAddres)
    .call({ from: address });
};

export const totalLockedWithdrawalByTokenAddress = async (
  lockerInstance,
  withdrawalAddress,
  address
) => {
  return lockerInstance.methods
    .getTotalLockedTokensByWithdrawalAddress(withdrawalAddress)
    .call({ from: address });
};

export const totalLockedTokens = async (lockerInstance, address) => {
  return lockerInstance.methods.getTotalLockedTokens().call({ from: address });
};

export const allDepositIds = async (lockerInstance, address) => {
  return lockerInstance.methods.getAllDepositIds().call({ from: address });
};

export const getDepositDetailsByAddress = async (
  lockerInstance,
  tokenAddress,
  address
) => {
  const {
    _tokenAddress_,
    _withdrawalAddress,
    _tokenAmount,
    _unlockTime,
    _lockDate,
    _lockType,
    _withdrawn,
  } = await lockerInstance.methods
    .getDepositDetailsByAddress(tokenAddress)
    .call({ from: address });

  const unlockedDays = timestampToNumberOfDay(_unlockTime);
  const lockDate = new Date(Number(_lockDate));
  const lockType = Number(_lockType) === 1 ? "Liquidity" : "Token";

  return {
    _tokenAddress: _tokenAddress_,
    _withdrawalAddress,
    _tokenAmount,
    _unlockTime: unlockedDays,
    _lockDate: lockDate,
    _lockType: lockType,
    _withdrawn,
  };
};

// export const getDepositDetails = async (lockerInstance, lockId, address) => {
//   const {
//     _tokenAddress,
//     _withdrawalAddress,
//     _tokenAmount,
//     _unlockTime,
//     _lockDate,
//     _lockType,
//     _withdrawn,
//   } = await lockerInstance.methods
//     .getDepositDetailsById(lockId)
//     .call({ from: address });

//   const unlockedDays = timestampToNumberOfDay(_unlockTime);
//   // const unlockedDateTime = new Date(Number(_unlockTime)).toLocaleString();
//   const lockDate = new Date(Number(_lockDate)).toLocaleString();
//   const lockType = Number(_lockType) === 1 ? "Liquidity" : "Token";

//   return {
//     _tokenAddress,
//     _withdrawalAddress,
//     _tokenAmount,
//     _unlockDays: unlockedDays,
//     _unlockDateTime: _unlockTime,
//     _lockDate: lockDate,
//     _lockType: lockType,
//     _withdrawn,
//   };
// };

export const getDepositDetails = async (lockerInstance, lockId, address) => {
  const {
    _tokenAddress,
    _withdrawalAddress,
    _tokenAmount,
    _unlockTime,
    _lockDate,
    _lockType,
    _withdrawn,
  } = await lockerInstance.methods
    .getDepositDetailsById(lockId)
    .call({ from: address });

  const unlockedDays = timestampToNumberOfDay(_unlockTime);
  const lockDate = new Date(Number(_lockDate)).toLocaleString();
  const lockType = Number(_lockType) === 1 ? "Liquidity" : "Token";

  return {
    _tokenAddress,
    _withdrawalAddress,
    _tokenAmount,
    _unlockTime: unlockedDays,
    _unlockDays: unlockedDays,
    _unlockDateTime: _unlockTime,
    _lockDate: lockDate,
    _lockType: lockType,
    _withdrawn,
  };
};

export const lockTokens = async (
  lockerInstance,
  tokenaddress,
  amountToLock,
  numberOfDays,
  lockType,
  address
) => {
  if (numberOfDays > 0) {
    const lockDuration = numberOfDaysTimeStamp(numberOfDays);
    return lockerInstance.methods
      .lockTokens(tokenaddress, address, amountToLock, lockDuration, lockType)
      .send({ from: address });
  } else {
    return;
  }
};

export const extendLockDuration = async (
  lockerInstance,
  lockId,
  newNumberOfDays,
  address
) => {
  if (newNumberOfDays > 0) {
    const lockDuration = numberOfDaysTimeStamp(newNumberOfDays);
    return lockerInstance.methods
      .extendLockDuration(lockId, lockDuration)
      .send({ from: address });
  } else {
    return;
  }
};

export const transferLocks = async (
  lockerInstance,
  tokenId,
  receiverAddress,
  address
) => {
  return lockerInstance.methods
    .transferLocks(tokenId, receiverAddress)
    .send({ from: address });
};

export const withdrawTokens = async (lockerInstance, lockId, address) => {
  return lockerInstance.methods.withdrawTokens(lockId).send({ from: address });
};
