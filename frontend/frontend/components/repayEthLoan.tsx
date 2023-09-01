import React from "react";
import { wallet1 } from "../constants/wallets";
import { LendingContract, MyTokenContract } from "../constants/wallets";
import { ethers } from "ethers";


async function repayEthLoan() {
    const repayAmount = (await LendingContract.getNativeRepayAmount());
    const tx = await LendingContract.repayNativeLoan(MyTokenContract.address,{value : repayAmount});
    await tx.wait();
    console.log("Repayed ETH Loan");
    console.log("tx", tx);
}

export const RepayEthLoan = () => {
    return (
        <div className="p-4 rounded-md bg-white shadow-lg w-full max-w-md mx-auto mt-8">
          <h1 className="text-2xl font-semibold mb-4">Repay ETH Loan</h1>
          <p className="text-gray-700 mb-4">Repay ETH Loan from the ETH/ERC20 pool on Lending Contract</p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={()=>repayEthLoan()} 
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
            >
              Repay ETH Loan
            </button>
          </div>
        </div>
      );
      
}