import { ethers } from "ethers";
import LendingContractArtifact from "../../../artifacts/contracts/Lending.sol/Lending.json";
import MyTokenArtifact from "../../../artifacts/contracts/MyToken.sol/MyToken.json";

const mnemonic = "test test test test test test test test test test test junk";

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

const pvtkey1 = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/0");

export const wallet1 = new ethers.Wallet(pvtkey1.privateKey, provider);

export const LendingABI = LendingContractArtifact.abi;

export const MyTokenABI = MyTokenArtifact.abi;

export const LendingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const MyTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const LendingContract = new ethers.Contract(
    LendingAddress,
    LendingABI,
    wallet1
);

export const MyTokenContract = new ethers.Contract(
    MyTokenAddress,
    MyTokenABI,
    wallet1
);