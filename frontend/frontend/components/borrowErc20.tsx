import React from "react";
import { wallet1 } from "../constants/wallets";
import { LendingContract, MyTokenContract } from "../constants/wallets";
import { ethers } from "ethers";


async function borrowErc20(amount: number) {
    try{
    await MyTokenContract.approve(LendingContract.address, ethers.constants.MaxUint256);
    const tx = await LendingContract.borrowAgainstNativeCollateral(MyTokenContract.address, amount, {value : ethers.utils.parseEther((amount/1000).toString())});
    await tx.wait();
    console.log("Borrowed ERC20");
    console.log("tx", tx);
    }catch(e){
        console.log(e);
    }
}

export const BorrowErc20 = () => {
    
        const[amount, setAmount] = React.useState(0);
        
        return (
            <div className="p-4 rounded-md bg-white shadow-lg w-full max-w-md mx-auto mt-8">
              <h1 className="text-2xl font-semibold mb-4">Borrow ERC20</h1>
              <p className="text-gray-700 mb-4">Borrow ERC20 from the ETH/ERC20 pool on Lending Contract</p>
              <div className="flex flex-col gap-4">
                <input 
                  type="number" 
                  placeholder="Amount" 
                  onChange={(e)=>setAmount(parseInt(e.target.value))}
                  className="p-2 border rounded-md"
                />
                <button 
                  onClick={()=>borrowErc20(amount)} 
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700"
                >
                  Borrow {amount} ERC20
                </button>
              </div>
            </div>
          );
        }          
          
          
          