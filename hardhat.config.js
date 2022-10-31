require("dotenv").config();

require("@nomicfoundation/hardhat-toolbox"); 
//NOTE: The below commented out are all enabled by hard-toolbox already
// require("@nomiclabs/hardhat-ethers");
// require("@nomiclabs/hardhat-etherscan");
// require("hardhat-gas-reporter");
// require("solidity-coverage");
// require("@typechain/hardhat");
// require("@nomicfoundation/hardhat-chai-matchers");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
  console.log(`Total of ${accounts.length} accounts`);
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      },
      outputSelection: {
        "*": {
          "*": [
            "evm.bytecode",
            "evm.deployedBytecode",
            "devdoc",
            "userdoc",
            "metadata",
            "abi"
          ]
        }
      },
      metadata: {
        "useLiteralContent": true
      },
      libraries: {}
    }
  },
  networks: {
    hardhat: {
      accounts: {
        count: 10
      }
    },
    goerli: {
      url:`https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      accounts:[process.env.PRIVATE_KEY, process.env.PRIVATE_KEY2, process.env.PRIVATE_KEY3],
      chainId:5,
      gas: "auto",
      gasPrice:"auto"
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    gasPriceApi: "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
    coinmarketcap: process.env.COIN_MARKET_CAP
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
