require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.VITE_SEPOLIA_URL || "",
      accounts: process.env.VITE_PRIVATE_KEY ? [process.env.VITE_PRIVATE_KEY] : [],
    },
  },
};
