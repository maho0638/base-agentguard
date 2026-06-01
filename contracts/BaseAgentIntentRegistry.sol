// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title BaseAgentIntentRegistry
/// @notice Minimal Base Sepolia proof contract for recording hashed AI-agent
/// intent receipts. It stores no private data and does not execute wallet
/// actions.
contract BaseAgentIntentRegistry {
    event IntentRecorded(
        address indexed recorder,
        bytes32 indexed intentHash,
        uint256 chainId,
        uint8 riskScore,
        string actionType,
        string metadataURI
    );

    mapping(bytes32 => bool) public recorded;

    function recordIntent(
        bytes32 intentHash,
        uint8 riskScore,
        string calldata actionType,
        string calldata metadataURI
    ) external {
        require(intentHash != bytes32(0), "empty intent");
        require(riskScore <= 100, "risk score");
        require(!recorded[intentHash], "already recorded");

        recorded[intentHash] = true;
        emit IntentRecorded(
            msg.sender,
            intentHash,
            block.chainid,
            riskScore,
            actionType,
            metadataURI
        );
    }
}
