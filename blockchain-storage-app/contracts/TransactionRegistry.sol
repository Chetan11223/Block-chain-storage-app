// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title TransactionRegistry
 * @dev Optimized contract for storing transaction hashes and metadata
 * Stores minimal on-chain data to reduce gas costs
 * Full data stored off-chain with IPFS hash reference
 */
contract TransactionRegistry is Ownable, ReentrancyGuard {
    
    // Struct for minimal on-chain storage
    struct TransactionRecord {
        bytes32 transactionHash;    // Hash of full transaction data
        uint256 timestamp;          // Block timestamp
        address user;               // User address
        uint8 transactionType;      // 0: Bank, 1: Crypto, 2: Hybrid
        bool exists;                // Existence check
    }
    
    // Mapping from transaction ID to record
    mapping(bytes32 => TransactionRecord) public transactions;
    
    // User transaction tracking
    mapping(address => bytes32[]) public userTransactions;
    
    // Batch transaction support
    mapping(bytes32 => bytes32[]) public batchTransactions;
    
    // Events for off-chain indexing
    event TransactionRegistered(
        bytes32 indexed transactionId,
        bytes32 indexed transactionHash,
        address indexed user,
        uint8 transactionType,
        uint256 timestamp,
        string ipfsHash
    );
    
    event BatchRegistered(
        bytes32 indexed batchId,
        bytes32[] transactionIds,
        address indexed user,
        uint256 timestamp
    );
    
    // Counters for gas optimization
    uint256 public totalTransactions;
    uint256 public totalBatches;
    
    constructor() {
        totalTransactions = 0;
        totalBatches = 0;
    }
    
    /**
     * @dev Register a single transaction with minimal on-chain data
     * @param _transactionHash Hash of the complete transaction data
     * @param _user User address
     * @param _transactionType Type of transaction (0: Bank, 1: Crypto, 2: Hybrid)
     * @param _ipfsHash IPFS hash containing full transaction data
     */
    function registerTransaction(
        bytes32 _transactionHash,
        address _user,
        uint8 _transactionType,
        string memory _ipfsHash
    ) external nonReentrant returns (bytes32) {
        require(_user != address(0), "Invalid user address");
        require(_transactionType <= 2, "Invalid transaction type");
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");
        
        // Generate transaction ID
        bytes32 transactionId = keccak256(abi.encodePacked(
            _transactionHash,
            _user,
            block.timestamp,
            totalTransactions
        ));
        
        // Store minimal data
        transactions[transactionId] = TransactionRecord({
            transactionHash: _transactionHash,
            timestamp: block.timestamp,
            user: _user,
            transactionType: _transactionType,
            exists: true
        });
        
        // Update user transaction list
        userTransactions[_user].push(transactionId);
        
        totalTransactions++;
        
        emit TransactionRegistered(
            transactionId,
            _transactionHash,
            _user,
            _transactionType,
            block.timestamp,
            _ipfsHash
        );
        
        return transactionId;
    }
    
    /**
     * @dev Register multiple transactions in a single batch to save gas
     * @param _transactionHashes Array of transaction hashes
     * @param _users Array of user addresses
     * @param _transactionTypes Array of transaction types
     * @param _ipfsHashes Array of IPFS hashes
     */
    function registerBatchTransactions(
        bytes32[] memory _transactionHashes,
        address[] memory _users,
        uint8[] memory _transactionTypes,
        string[] memory _ipfsHashes
    ) external nonReentrant returns (bytes32) {
        require(
            _transactionHashes.length == _users.length &&
            _users.length == _transactionTypes.length &&
            _transactionTypes.length == _ipfsHashes.length,
            "Array length mismatch"
        );
        require(_transactionHashes.length > 0, "Empty batch");
        require(_transactionHashes.length <= 50, "Batch too large");
        
        bytes32[] memory transactionIds = new bytes32[](_transactionHashes.length);
        address batchUser = _users[0]; // Assume same user for batch
        
        for (uint256 i = 0; i < _transactionHashes.length; i++) {
            require(_users[i] != address(0), "Invalid user address");
            require(_transactionTypes[i] <= 2, "Invalid transaction type");
            require(bytes(_ipfsHashes[i]).length > 0, "IPFS hash required");
            
            bytes32 transactionId = keccak256(abi.encodePacked(
                _transactionHashes[i],
                _users[i],
                block.timestamp,
                totalTransactions + i
            ));
            
            transactions[transactionId] = TransactionRecord({
                transactionHash: _transactionHashes[i],
                timestamp: block.timestamp,
                user: _users[i],
                transactionType: _transactionTypes[i],
                exists: true
            });
            
            userTransactions[_users[i]].push(transactionId);
            transactionIds[i] = transactionId;
        }
        
        bytes32 batchId = keccak256(abi.encodePacked(
            transactionIds,
            batchUser,
            block.timestamp,
            totalBatches
        ));
        
        batchTransactions[batchId] = transactionIds;
        totalBatches++;
        totalTransactions += _transactionHashes.length;
        
        emit BatchRegistered(batchId, transactionIds, batchUser, block.timestamp);
        
        return batchId;
    }
    
    /**
     * @dev Verify transaction exists and get basic info
     */
    function getTransactionInfo(bytes32 _transactionId) 
        external 
        view 
        returns (
            bytes32 transactionHash,
            uint256 timestamp,
            address user,
            uint8 transactionType,
            bool exists
        ) 
    {
        TransactionRecord memory record = transactions[_transactionId];
        return (
            record.transactionHash,
            record.timestamp,
            record.user,
            record.transactionType,
            record.exists
        );
    }
    
    /**
     * @dev Get all transactions for a user
     */
    function getUserTransactions(address _user) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return userTransactions[_user];
    }
    
    /**
     * @dev Get transactions in a batch
     */
    function getBatchTransactions(bytes32 _batchId) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return batchTransactions[_batchId];
    }
    
    /**
     * @dev Get transaction count for gas estimation
     */
    function getTransactionCount() external view returns (uint256) {
        return totalTransactions;
    }
}
