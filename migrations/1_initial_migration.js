var ArbiCryptLocker = artifacts.require("./ArbiCryptLocker.sol");
var ERC20Factory = artifacts.require("./ERC20Factory.sol");
const factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

module.exports = async function (deployer, network, accounts) {
  // If deploying to dev network, create mock tokens and use them for locking contract.
  if (network == "development") {
    await deployer.deploy(ERC20Factory);
    const erc20factory = await ERC20Factory.deployed();
    await erc20factory.createToken("ArbiCrypt", "ACT");

    const tokens = await erc20factory.getTokens();
    console.log(tokens);
    await deployer.deploy(ArbiCryptLocker, factory);
  } else {
    await deployer.deploy(ArbiCryptLocker, factory);
  }
};
