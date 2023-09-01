// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const lending = await ethers.getContractFactory("Lending");
    const mytoken = await ethers.getContractFactory("MyToken");
    
    const lendingContract1 = await lending.deploy();
    const mytokenContract1 = await mytoken.deploy();

    console.log("Lending deployed to:", lendingContract1.target);
    console.log("MyToken deployed to:", mytokenContract1.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
