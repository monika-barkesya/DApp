import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { ProvideLiquidity } from '../components/provideLiquidity';
import { BorrowEth } from '../components/borrowEth';
import { RepayEthLoan } from '../components/repayEthLoan';
import { BorrowErc20 } from '../components/borrowErc20';
import { RepayErc20Loan } from '../components/RepayErc20';
import { LiveBalance } from '../components/LiveBalance';


const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 text-gray-800 flex flex-col items-center justify-center">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-semibold mb-8 text-center text-white">Your DeFi Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 rounded-md bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400">
          <ConnectButton />
          <div className="col-span-2">
  <LiveBalance />
</div>

          <ProvideLiquidity />
          <BorrowEth />
          <RepayEthLoan />
          <BorrowErc20 />
          <RepayErc20Loan />
        </div>
      </div>
    </div>
  );
};



export default Home;
