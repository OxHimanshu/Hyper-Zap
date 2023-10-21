require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    mumbai: {
      url: "https://rpc.ankr.com/polygon_mumbai",
      accounts: ["c64e2f1fd05d7612dde0f5d4d9f56593a38e0a15078a65c03c42335d4d19aad6"]
    }
  },
};
