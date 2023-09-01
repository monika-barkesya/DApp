import React from "react";
import { wallet1 } from "../constants/wallets";
import { LendingContract, MyTokenContract } from "../constants/wallets";
import { ethers } from "ethers";

async function getLiveBalance() {
    const ethBalance = (await wallet1.getBalance()).toString();
    const erc20Balance = (await MyTokenContract.balanceOf(wallet1.address)).toString();
    return {ethBalance, erc20Balance};
}

export const LiveBalance = () => {
    const [balance, setBalance] = React.useState({ethBalance: "0", erc20Balance: "0"});

    //update balance evry 1 sec
    React.useEffect(()=>{
        const interval = setInterval(async ()=>{
            const balance = await getLiveBalance();
            setBalance(balance);
        }, 1000);
        return ()=>clearInterval(interval);
    },[]);
    return (
        <div className="p-4 rounded-md bg-white shadow-lg w-full max-w-xl mx-auto mt-8">
            <h1 className="text-2xl font-semibold mb-4">Live Balance</h1>
            <p className="text-gray-700 mb-4">Live balance of ETH and ERC20 updated every second</p>
            <div className="grid grid-cols-2 gap-4">
                <div className="text-gray-700">
                    <p>ETH Balance:</p>
                </div>
                <div className="text-black">
                    <p>{balance.ethBalance}</p>
                </div>
                <div className="text-gray-700">
                    <p>ERC20 Balance:</p>
                </div>
                <div className="text-black">
                    <p>{balance.erc20Balance}</p>
                </div>
            </div>
        </div>
    );
};