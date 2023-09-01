const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lending Contract", async function () {
  
  let lendingContract;
  let mytokenContract;
  
  async function deployContracts() {
    const lending = await ethers.getContractFactory("Lending");
    const mytoken = await ethers.getContractFactory("MyToken");
    
    const [owner, acc1, acc2] = await ethers.getSigners();

    const lendingContract1 = await lending.deploy();
    const mytokenContract1 = await mytoken.deploy();

    console.log("Lending deployed to:", lendingContract1.target);
    console.log("MyToken deployed to:", mytokenContract1.target);

    lendingContract = lendingContract1;
    mytokenContract = mytokenContract1;
  }
  it("Should deploy Lending and MyToken", async function () {
    await loadFixture(deployContracts);
  });

  it("should provide liquidity", async function () {
    const [owner, acc1, acc2] = await ethers.getSigners();

    await mytokenContract.approve(lendingContract.target, 1000);
    await lendingContract.provideLiquidity(mytokenContract.target, 1000);
    await lendingContract.provideNativeLiquidity({value : ethers.parseEther("10")});
    expect(await mytokenContract.balanceOf(lendingContract.target)).to.equal(1000);
    expect(await lendingContract.nativeBalances(owner.address)).to.equal(ethers.parseEther("10"));
  });

  it("should borrow eth", async function () {
    const [owner, acc1, acc2] = await ethers.getSigners();
    await mytokenContract.connect(owner).approve(lendingContract.target, 100000000);
    await lendingContract.provideLiquidity(mytokenContract.target, 1000);
    await lendingContract.provideNativeLiquidity({value : ethers.parseEther("10")});
    await lendingContract.connect(owner).borrowAgaintERC20Token(mytokenContract.target, 1);
    expect(await lendingContract.erc20CollateralAmount(owner.address)).to.equal(1500);
  });

  it("should repay the loan", async function () {
    const [owner, acc1, acc2] = await ethers.getSigners();
    const preBalance = (await mytokenContract.balanceOf(lendingContract.target))
    await mytokenContract.connect(owner).approve(lendingContract.target, 100000000);
    await lendingContract.provideNativeLiquidity({value : ethers.parseEther("10")});
    const repayAmount = (await lendingContract.getNativeRepayAmount());
    await lendingContract.connect(owner).repayNativeLoan(mytokenContract.target,{value : repayAmount});
    expect(await lendingContract.loanActive(owner.address)).to.false;
    const postBalance = (await mytokenContract.balanceOf(lendingContract.target));
    //collateral is released
    expect(postBalance).to.lessThan(preBalance);
  })

  it("should borrow erc20 token", async function () {
    const [owner, acc1, acc2] = await ethers.getSigners();
    const preerc20Balance = (await mytokenContract.balanceOf(owner.address));
    await mytokenContract.connect(owner).approve(lendingContract.target, ethers.MaxInt256);
    await lendingContract.connect(owner).borrowAgainstNativeCollateral(mytokenContract.target, 1000, {value : ethers.parseEther("1")});
    const posterc20Balance = (await mytokenContract.balanceOf(owner.address));
    expect(posterc20Balance).to.greaterThan(preerc20Balance);
    expect(await lendingContract.loanActive(owner.address)).to.true;
  });

  it("should repay the loan", async function () {
    const [owner, acc1, acc2] = await ethers.getSigners();
    const repayAmount = (await lendingContract.getERC20RepayAmount());
    await lendingContract.connect(owner).repayERC20Loan(mytokenContract.target);
    expect(await lendingContract.loanActive(owner.address)).to.false;
  });

});
