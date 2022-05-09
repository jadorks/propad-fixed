import Web3 from "web3";

export const pairDetails = async (tokenContractInstance, address) => {
  const totalSupply = await tokenContractInstance.methods
    .totalSupply()
    .call({ from: address });

  const factory = await tokenContractInstance.methods
    .factory()
    .call({ from: address });

  const token0 = await tokenContractInstance.methods
    .token0()
    .call({ from: address });

  const token1 = await tokenContractInstance.methods
    .token1()
    .call({ from: address });

  const symbol = await tokenContractInstance.methods
    .symbol()
    .call({ from: address });

  const name = await tokenContractInstance.methods
    .name()
    .call({ from: address });

  const _balanceOf = await tokenContractInstance.methods
    .balanceOf(address)
    .call({ from: address });

  const balance = Web3.utils.fromWei(_balanceOf);

  return {
    totalSupply,
    token0,
    token1,
    symbol,
    name,
    balanceOf: balance,
    factory,
  };
};

export const balanceOf = async (tokenContractInstance, address) => {
  return tokenContractInstance.methods
    .balanceOf(address)
    .call({ from: address });
};

export const isValidUniv2Pair = async (
  tokenContractInstance,
  token0,
  token1,
  address
) => {
  return tokenContractInstance.methods
    .getPair(token0, token1)
    .call({ from: address });
};
