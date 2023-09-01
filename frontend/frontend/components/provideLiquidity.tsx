import React from "react";
import { wallet1 } from "../constants/wallets";
import { LendingContract, MyTokenContract } from "../constants/wallets";
import { ethers } from "ethers";

export const ProvideLiquidity = () => {
  async function provideEthLiquidity() {
    const tx1 = await MyTokenContract.approve(LendingContract.address, ethers.constants.MaxUint256);
    const tx2 = await LendingContract.provideLiquidity(MyTokenContract.address, 1000);
    const tx3 = await LendingContract.provideNativeLiquidity({
      value: ethers.utils.parseEther("10"),
    });

    await tx1.wait();
    await tx2.wait();
    await tx3.wait();

    console.log("Provided liquidity");
    console.log("tx1", tx1);
    console.log("tx2", tx2);
    console.log("tx3", tx3);
  }

  return (
    <div className="p-4 rounded-md bg-white shadow-lg w-full max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4">Provide Liquidity</h1>
      <p className="text-gray-700 mb-6">
        Provide liquidity to the ETH/ERC20 pool on Lending Contract
      </p>
      <button 
        onClick={() => provideEthLiquidity()} 
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200"
      >
        Provide Liquidity
      </button>
    </div>
  );
};