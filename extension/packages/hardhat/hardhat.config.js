require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env.local" });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    // Add other networks as needed
    sepolia: {
      url: process.env.INFURA_KEY 
        ? `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`
        : "https://1rpc.io/sepolia",
      accounts: (process.env.PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY) ? [`0x${process.env.PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY}`] : [],
      timeout: 120000,
    },
    oasis: {
      url: "https://testnet.emerald.oasis.dev",
      accounts: (process.env.PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY) ? [`0x${process.env.PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY}`] : [],
      chainId: 0xa515,
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};