// SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Lending {
    mapping(address => mapping(address => uint256)) public balances;
    mapping(address => uint256) public nativeBalances;
    mapping(address => uint256) public poolBalances;
    mapping(address => bool) public loanActive;
    mapping(address => uint256) public nativeCollateralAmount;
    mapping(address => uint256) public erc20CollateralAmount;
    mapping(address => uint256) public nativeLoanAmount;
    mapping(address => uint256) public erc20LoanAmount;
    mapping(address => uint256) public loanStartTime;

    event Borrowed(address indexed borrower, uint256 amount);
    event Repaid(address indexed borrower, uint256 amount);
    event LiquidityProvided(address indexed provider, uint256 amount);
    event LiquidityWithdrawn(address indexed provider, uint256 amount);

    uint256 public constant INTEREST_RATE = 5;
    uint256 public constant COLLATERALIZATION_RATE = 150;
    uint256 public constant LIQUIDATION_RATE = 110;
    uint256 public constant EXCHANGE_RATE = 1000; //1ETH == 1000USDC

    function provideLiquidity(address _token, uint256 _amount) external {
        ERC20(_token).transferFrom(msg.sender, address(this), _amount);
        balances[msg.sender][_token] += _amount;
        poolBalances[_token] += _amount;
        emit LiquidityProvided(msg.sender, _amount);
    }

    function withdrawLiquidity(address _token, uint256 _amount) external {
        require(
            balances[msg.sender][_token] >= _amount,
            "Insufficient balance"
        );
        ERC20(_token).transfer(msg.sender, _amount);
        balances[msg.sender][_token] -= _amount;
        poolBalances[_token] -= _amount;
        emit LiquidityWithdrawn(msg.sender, _amount);
    }

    function provideNativeLiquidity() external payable {
        require(msg.value > 0, "Insufficient amount");
        nativeBalances[msg.sender] += msg.value;
    }

    function withdrawNativeLiquidity(uint256 _amount) external {
        require(nativeBalances[msg.sender] >= _amount, "Insufficient balance");
        nativeBalances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    function borrowAgainstNativeCollateral(
        address _token,
        uint256 amount
    ) public payable {
        require(loanActive[msg.sender] == false, "Loan already active");
        uint256 collateral = (amount / EXCHANGE_RATE)*1e18;
        require(msg.value == collateral, "Insufficient collateral");
        require(poolBalances[_token] >= amount, "Insufficient liquidity");
        poolBalances[_token] -= amount;
        ERC20(_token).transfer(msg.sender, amount);
        nativeCollateralAmount[msg.sender] = collateral;
        erc20LoanAmount[msg.sender] = amount;
        loanActive[msg.sender] = true;
        loanStartTime[msg.sender] = block.timestamp;
        emit Borrowed(msg.sender, amount);
    }

    function borrowAgaintERC20Token(
        address _token,
        uint256 amount
    ) public payable {
        require(loanActive[msg.sender] == false, "Loan already active");
        uint256 collateral = (amount * COLLATERALIZATION_RATE * EXCHANGE_RATE) /
            100;
        require(
            ERC20(_token).balanceOf(msg.sender) >= collateral,
            "Insufficient collateral"
        );
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed.");
        ERC20(_token).transferFrom(msg.sender, address(this), collateral);
        erc20CollateralAmount[msg.sender] = collateral;
        nativeLoanAmount[msg.sender] = amount;
        poolBalances[_token] += collateral;
        loanActive[msg.sender] = true;
        loanStartTime[msg.sender] = block.timestamp;
        emit Borrowed(msg.sender, amount);
    }

    function getNativeRepayAmount() public view returns (uint256) {
        uint256 repayAmount = nativeLoanAmount[msg.sender] *
            1e18 +
            ((nativeLoanAmount[msg.sender] * INTEREST_RATE * 1e18) / 100);
        return repayAmount;
    }

    function getERC20RepayAmount() public view returns (uint256) {
        uint256 repayAmount = erc20LoanAmount[msg.sender] +
            ((erc20LoanAmount[msg.sender] * INTEREST_RATE) / 100);
        return repayAmount;
    }

    function repayNativeLoan(address _token) public payable {
        require(loanActive[msg.sender] == true, "No active loan");
        require(nativeLoanAmount[msg.sender] > 0, "Incorrect amount");
        require(erc20CollateralAmount[msg.sender] > 0, "Incorrect amount");
        uint256 repayAmount = getNativeRepayAmount();
        require(msg.value == repayAmount, "Incorrect amount");
        ERC20(_token).transfer(msg.sender, erc20CollateralAmount[msg.sender]);
        poolBalances[_token] -= erc20CollateralAmount[msg.sender];
        nativeLoanAmount[msg.sender] = 0;
        loanActive[msg.sender] = false;
        erc20CollateralAmount[msg.sender] = 0;
        emit Repaid(msg.sender, repayAmount);
    }

    function repayERC20Loan(address _token) public payable {
        require(loanActive[msg.sender] == true, "No active loan");
        require(erc20LoanAmount[msg.sender] > 0, "Incorrect amount");
        require(nativeCollateralAmount[msg.sender] > 0, "Incorrect amount");
        uint256 repayAmount = getERC20RepayAmount();
        ERC20(_token).transferFrom(msg.sender, address(this), repayAmount);
        (bool success, ) = msg.sender.call{
            value: nativeCollateralAmount[msg.sender]
        }("");
        require(success, "Transfer failed.");
        nativeCollateralAmount[msg.sender] = 0;
        erc20LoanAmount[msg.sender] = 0;
        loanActive[msg.sender] = false;
        emit Repaid(msg.sender, repayAmount);
    }
}
