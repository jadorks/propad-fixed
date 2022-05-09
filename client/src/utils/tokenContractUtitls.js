import Web3 from "web3";

export const tokenDetails = async (tokenContractInstance, address) => {
  try {
    const totalSupply = await tokenContractInstance.methods
      .totalSupply()
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

    return { totalSupply, symbol, name, balanceOf: balance };
  } catch (error) {
    return { totalSupply: 0, symbol: null, name: null, balanceOf: 0 };
  }
};

export const approveSpendLimit = async (
  tokenContractInstance,
  spender,
  amount,
  address
) => {
  return tokenContractInstance.methods
    .approve(spender, amount.toString())
    .send({ from: address });
};

export const balanceOf = async (tokenContractInstance, address) => {
  return tokenContractInstance.methods
    .balanceOf(address)
    .call({ from: address });
};
