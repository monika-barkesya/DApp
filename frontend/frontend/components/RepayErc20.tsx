import React from "react";
import { wallet1 } from "../constants/wallets";
import { LendingContract, MyTokenContract } from "../constants/wallets";
import { ethers } from "ethers";

async function repayErc20Loan() {
    const tx = await LendingContract.repayERC20Loan(MyTokenContract.address);
    await tx.wait();
    console.log("Repayed ERC20 Loan");
    console.log("tx", tx);
}

export const RepayErc20Loan = () => {
    return (
        <div className="p-4 rounded-md bg-white shadow-lg w-full max-w-md mx-auto mt-8">
          <h1 className="text-2xl font-semibold mb-4">Repay ERC20 Loan</h1>
          <p className="text-gray-700 mb-4">Repay ERC20 Loan from the ETH/ERC20 pool on Lending Contract</p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={()=>repayErc20Loan()} 
              className="bg-green-500 text-white p-2 rounded-md hover:bg-red-700"
            >
              Repay ERC20 Loan
            </button>
          </div>
        </div>
      );
      
}