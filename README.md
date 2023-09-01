The above project is an implementation of lending pool using solidity and typescript along with required libraries for blockchain interaction
the Tech used are : Typescript, Solidity, Hardhat

The protocol implements the following functions :
1) Providing liquidity to the pool - transfers 1000ERC20 token and 10 eth to the pool initially
2) Borrow ETH against ERC20 : Allows the user to take a loan of ETH by giving ERC20 Tokens as collateral as rate of 150%, while repayment, the interest levied is 5%
3) Borrow ERC20 against ETH : Allows the user to take a loan of ERC20 by giving ETH as collateral as rate of 150%, while repayment, the interest levied is 5%
   
```shell
npm i
npx hardhat
npm i -g yarn
 yarn deploy

//for the frontend
npm i
npm run dev
```
