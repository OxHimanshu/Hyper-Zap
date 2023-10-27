require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    mumbai: {
      url: "https://rpc.ankr.com/polygon_mumbai",
      accounts: ["c64e2f1fd05d7612dde0f5d4d9f56593a38e0a15078a65c03c42335d4d19aad6"]
    },
    scrollSepolia: {
      url: "https://scroll-sepolia.blockpi.network/v1/rpc/public",
      accounts: ["c64e2f1fd05d7612dde0f5d4d9f56593a38e0a15078a65c03c42335d4d19aad6"]
    }
  },
  etherscan: {
    apiKey: {
      scrollSepolia: "CNUMYB8QAISI4IHT3YDR4AP4N5C1EVIWDI"
    },
    customChains: [
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://sepolia.scrollscan.dev/apis",
          browserURL: "https://sepolia.scrollscan.dev/"
        }
      }
    ]
  }
};
