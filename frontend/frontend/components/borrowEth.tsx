import React from "react";
import { wallet1 } from "../constants/wallets";
import { LendingContract, MyTokenContract } from "../constants/wallets";
import { ethers } from "ethers";

async function borrowEth(amount: string) {
    try{
    const tx = await MyTokenContract.approve(LendingContract.address, ethers.constants.MaxUint256);
    await tx.wait();
    const tx1 = await LendingContract.borrowAgaintERC20Token(MyTokenContract.address,amount);
    await tx1.wait();
    console.log("Borrowed ETH");
    console.log("tx1", tx1);
    }catch(e){
        console.log(e);
    }
}

export const BorrowEth = () => {

    const[amount, setAmount] = React.useState("0");
    
    return (
        <div className="p-4 rounded-md bg-white shadow-lg w-full max-w-md mx-auto mt-8">
          <h1 className="text-2xl font-semibold mb-4">Borrow ETH</h1>
          <p className="text-gray-700 mb-4">Borrow ETH from the ETH/ERC20 pool on Lending Contract</p>
          <div className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Amount" 
              onChange={(e)=>setAmount(e.target.value)}
              className="p-2 border rounded-md"
            />
            <button 
              onClick={()=>borrowEth(amount)} 
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
            >
              Borrow {amount} ETH
            </button>
          </div>
        </div>
      );
      
};