// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./AggregatorV3Interface.sol";

interface IMailbox {
    function dispatch(
        uint32 _destinationDomain,
        bytes32 _recipientAddress,
        bytes calldata _messageBody
    ) external returns (bytes32);

    function process(bytes calldata _metadata, bytes calldata _message)
        external;
}

interface IInterchainQueryRouter {
    /**
     * @param _destinationDomain Domain of destination chain
     * @param target The address of the contract to query on destination chain.
     * @param queryData The calldata of the view call to make on the destination
     * chain.
     * @param callback Callback function selector on `msg.sender` and optionally
     * abi-encoded prefix arguments.
     * @return messageId The ID of the Hyperlane message encoding the query.
     */
    function query(
        uint32 _destinationDomain,
        address target,
        bytes calldata queryData,
        bytes calldata callback
    ) external returns (bytes32);

}

interface IInterchainGasPaymaster {
    /**
     * @notice Emitted when a payment is made for a message's gas costs.
     * @param messageId The ID of the message to pay for.
     * @param gasAmount The amount of destination gas paid for.
     * @param payment The amount of native tokens paid.
     */
    event GasPayment(
        bytes32 indexed messageId,
        uint256 gasAmount,
        uint256 payment
    );

    /**
     * @notice Deposits msg.value as a payment for the relaying of a message
     * to its destination chain.
     * @dev Overpayment will result in a refund of native tokens to the _refundAddress.
     * Callers should be aware that this may present reentrancy issues.
     * @param _messageId The ID of the message to pay for.
     * @param _destinationDomain The domain of the message's destination chain.
     * @param _gasAmount The amount of destination gas to pay for.
     * @param _refundAddress The address to refund any overpayment to.
     */
    function payForGas(
        bytes32 _messageId,
        uint32 _destinationDomain,
        uint256 _gasAmount,
        address _refundAddress
    ) external payable;

    /**
     * @notice Quotes the amount of native tokens to pay for interchain gas.
     * @param _destinationDomain The domain of the message's destination chain.
     * @param _gasAmount The amount of destination gas to pay for.
     * @return The amount of native tokens required to pay for interchain gas.
     */
    function quoteGasPayment(uint32 _destinationDomain, uint256 _gasAmount)
        external
        view
        returns (uint256);
}

interface IMessageRecipient {
    /**
     * @notice Handle an interchain message
     * @param _origin Domain ID of the chain from which the message came
     * @param _sender Address of the message sender on the origin chain as bytes32
     * @param _body Raw bytes content of message body
     */
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _body
    ) external;
}

contract GasTransfer is IMessageRecipient {
    // Custom errors to provide more descriptive revert messages.
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); // Used to make sure contract has enough balance.

    // Event emitted when a message is sent to another chain.
    event Sent(
        bytes32 messageId,
        uint32 indexed destinationChainSelector, // The chain selector of the destination chain.
        uint32 sourceChainSelector,
        address receiver, // The address of the receiver on the destination chain.
        uint256 fees, // The fees paid for sending the CCIP message.
        bytes message
    );

    event Received(uint32 origin, address sender, bytes body);

    AggregatorV3Interface internal dataFeed;

    mapping(address => uint) private stakes;
    mapping(address => uint) private stakesForReward;
    uint public totalStaked;
    uint public totalRewards;
    address immutable mailbox;
    address immutable igp;
    address immutable iqsRouter;
    uint256 public gasAmount = 200000;
    uint public destChainNativeTokenUsdAmount;
    uint32 public immutable sourceChainSelector;

    constructor(address _dataFeed, address _mailbox, address _igp, address _iqsRouter, uint32 _sourceChainSelector) {
        mailbox = _mailbox;
        igp = _igp;
        iqsRouter = _iqsRouter;
        dataFeed = AggregatorV3Interface(
            _dataFeed
        );
        sourceChainSelector = _sourceChainSelector;
    }

    error InsufficientFunds();
    error InvalidArguments();

    modifier onlyMailbox() {
        require(msg.sender == mailbox);
        _;    
    }

    /// @notice Only allow this function to be called via an IQS callback.
    modifier onlyCallback() {
        require(msg.sender == iqsRouter);
        _;
    }

    function getUsdBalance() public view returns (uint) {
        uint nativeAmount = address(this).balance;
        return (nativeAmount * getLatestData()) / 10e8;
    }

    function getLatestData() public view returns (uint) {
        // (
        //     /* uint80 roundID */,
        //     int answer,
        //     /*uint startedAt*/,
        //     /*uint timeStamp*/,
        //     /*uint80 answeredInRound*/
        // ) = dataFeed.latestRoundData();
        // return uint(answer);
        return 38031900;
    }

    function getTotalRewards(address user) public view returns(uint) {
        uint myStakes = stakesForReward[user];
        if(myStakes == 0 || (myStakes > totalStaked)) {
            return 0;
        }

        uint rewards = (myStakes * totalRewards) / totalStaked;
        return rewards;
    }
    
    // alignment preserving cast
    function addressToBytes32(address _addr) public pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    // alignment preserving cast
    function bytes32ToAddress(bytes32 _buf) public pure returns (address) {
        return address(uint160(uint256(_buf)));
    }

    function claimRewards() external {
        uint rewards = getTotalRewards(msg.sender);

        if(rewards > 0) {
            totalRewards = totalRewards - rewards;
            totalStaked = totalStaked - stakesForReward[msg.sender];
            stakesForReward[msg.sender] = 0;

            payable(msg.sender).transfer(rewards);
        }
    }

    function getFee(uint amount) external pure returns(uint, uint) {
        if(amount == 0) {
            revert InvalidArguments();
        } 

        uint nativeTokenAmount = (amount * 95) / 100;
        uint fees = amount - nativeTokenAmount;
        return (nativeTokenAmount, fees);
    }

    function getDeposits(address user) external view returns(uint) {
        return stakes[user];
    }

    function Deposit() external payable {
        if(msg.value == 0) {
            revert InvalidArguments();
        } 

        stakes[msg.sender] = stakes[msg.sender] + msg.value;  
        stakesForReward[msg.sender] = stakesForReward[msg.sender] + msg.value;
        totalStaked = totalStaked + msg.value;      
    }

    function Withdraw(uint withdrawAmount) external {
        if(stakes[msg.sender] < withdrawAmount) {
            revert InvalidArguments();
        }

        if(address(this).balance < withdrawAmount) {
            revert InsufficientFunds();
        }

        stakes[msg.sender] = stakes[msg.sender] - withdrawAmount;

        payable(msg.sender).transfer(withdrawAmount);
    }

    function bridgeGas(uint32 destinationChainSelector, address receiver) external payable {
        if(msg.value == 0 || msg.value <= gasAmount) {
            revert InvalidArguments();
        }

        if(destinationChainSelector == 0 || address(0) == receiver) {
            revert InvalidArguments();
        }

        uint bridgeAmount = msg.value;

        uint256 quote = IInterchainGasPaymaster(igp).quoteGasPayment(
            destinationChainSelector,
            gasAmount
        );

        uint nativeTokenAmount = bridgeAmount - quote;

        nativeTokenAmount = (nativeTokenAmount * 95) / 100;
        totalRewards = totalRewards + (bridgeAmount - nativeTokenAmount);

        uint nativeTokenUsdAmount = (nativeTokenAmount * getLatestData()) / 10e8;
        bytes memory message = abi.encode(nativeTokenUsdAmount, msg.sender, block.timestamp);
        _sendMessage(destinationChainSelector, quote, receiver, message);
    }

    function safeBridgeGas(uint32 destinationChainSelector, address receiver) external payable {
        if(msg.value == 0 || msg.value <= gasAmount) {
            revert InvalidArguments();
        }

        if(destinationChainSelector == 0 || address(0) == receiver) {
            revert InvalidArguments();
        }

        uint bridgeAmount = msg.value;

        uint256 quote = IInterchainGasPaymaster(igp).quoteGasPayment(
            destinationChainSelector,
            gasAmount
        );

        uint nativeTokenAmount = bridgeAmount - (quote);

        nativeTokenAmount = (nativeTokenAmount * 95) / 100;
        totalRewards = totalRewards + (bridgeAmount - nativeTokenAmount);
        uint nativeTokenUsdAmount = (nativeTokenAmount * getLatestData()) / 10e8; 

        bytes memory _callback = abi.encodePacked(
            this.callbackInitateBridge.selector, 
            nativeTokenUsdAmount, 
            msg.sender,
            destinationChainSelector,
            quote,
            receiver
        );

        // Dispatch the call. Will result in a view call of ENS.ownerOf() on Ethereum, 
        // and a callback to this.writeOwner(_label, _owner).
        bytes32 messageId = IInterchainQueryRouter(iqsRouter).query(
            destinationChainSelector,
            receiver,
            abi.encodePacked(this.getUsdBalance.selector),
            _callback
        );

        // // Pay from the contract's balance
        IInterchainGasPaymaster(igp).payForGas{ value: quote }(
            messageId, // The ID of the message that was just dispatched
            destinationChainSelector, // The destination domain of the message
            80000,
            address(msg.sender) // refunds are returned to this contract
        );
    }

    function callbackInitateBridge(
        uint nativeTokenUsdAmount, 
        address sender, 
        uint32 destinationChainSelector, 
        uint32 quote, 
        address receiver,
        uint destNativeTokenUsdAmount
    )  onlyCallback() external {
        if(nativeTokenUsdAmount > destNativeTokenUsdAmount) {
            revert InsufficientFunds();
        }
        destChainNativeTokenUsdAmount = destNativeTokenUsdAmount;
        bytes memory message = abi.encode(nativeTokenUsdAmount, sender);
        _sendMessage(destinationChainSelector, quote, receiver, message);
    }

    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _body
    ) external onlyMailbox {

        uint nativeTokenAmount;
        uint nativeTokenUsdAmount;
        address msgSender = bytes32ToAddress(_sender);
        address origin;

        (nativeTokenUsdAmount, origin, ) = abi.decode(_body,(uint, address, uint));
        nativeTokenAmount = (nativeTokenUsdAmount / getLatestData()) * 10e8;
        _unlockToken(nativeTokenAmount, payable(origin));

        emit Received(_origin, msgSender, _body);
    }

    function getGasQuote(uint32 domain) public view returns (uint256) {
        return IInterchainGasPaymaster(igp).quoteGasPayment(
            domain,
            gasAmount
        );
    }

    // To send message to multichain contract
    function _sendMessage(
        uint32 domain, 
        uint256 quote,
        address receiver,
        bytes memory _message
    ) private {

        bytes32 messageId = IMailbox(mailbox).dispatch(
            domain,
            addressToBytes32(receiver),
            _message
        );

        // Pay from the contract's balance
        IInterchainGasPaymaster(igp).payForGas{ value: quote }(
            messageId, // The ID of the message that was just dispatched
            domain, // The destination domain of the message
            gasAmount,
            address(msg.sender) // refunds are returned to this contract
        );

        emit Sent(
            messageId,
            domain,
            sourceChainSelector,
            receiver,
            quote,
            _message
        );
    }

    function _unlockToken(uint nativeTokenAmount, address payable msgSender) private {
        if(address(this).balance < nativeTokenAmount) revert InsufficientFunds();
        msgSender.transfer(nativeTokenAmount);
    }
}