require('dotenv').config();
const { ethers } = require('hardhat');

const customHttpProvider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545", {
  name: 'custom',
  chainId: 97,
});

const customWallet = new ethers.Wallet("79a7210a43af2adda8da79d1aec95198cda359b2fe57be5c1381f5577a20c054", customHttpProvider);

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory('TaskContract'); //Replace with name of your smart contract
  const token = await Token.connect(customWallet).deploy();

  console.log('Token address:', token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
