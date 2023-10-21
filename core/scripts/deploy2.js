// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const bitcoin = await hre.ethers.deployContract("BITCOIN", ["100000000000000000000000"]);

  await bitcoin.waitForDeployment();

  console.log(
    `bitcoin with deployed to ${bitcoin.target}`
  );

  const dai = await hre.ethers.deployContract("DAI", ["100000000000000000000000"]);

  await dai.waitForDeployment();

  console.log(
    `dai with deployed to ${dai.target}`
  );

  const link = await hre.ethers.deployContract("LINK", ["100000000000000000000000"]);

  await link.waitForDeployment();

  console.log(
    `link with deployed to ${link.target}`
  );

  const usdt = await hre.ethers.deployContract("USDT", ["100000000000000000000000"]);

  await usdt.waitForDeployment();

  console.log(
    `usdt with deployed to ${usdt.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
