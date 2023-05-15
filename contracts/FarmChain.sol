// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
contract FarmChain {

    struct Transaction {
        string farmerName;
        uint256 amount;
        bool approved;
    }

    mapping(address => bool) private authorizedOfficers;
    mapping(address => Transaction[]) private transactions;

    event TransactionAdded(string indexed farmerName, uint256 amount);
    event TransactionApproved(address indexed officer, string indexed farmerName, uint256 amount);

    constructor(address[] memory officers) {
        for (uint i = 0; i < officers.length; i++) {
            authorizedOfficers[officers[i]] = true;
        }
    }

    modifier onlyAuthorizedOfficer() {
        require(authorizedOfficers[msg.sender], "Unauthorized");
        _;
    }

    function addOfficer(address officer) public onlyAuthorizedOfficer {
        authorizedOfficers[officer] = true;
    }

    function removeOfficer(address officer) public onlyAuthorizedOfficer {
        authorizedOfficers[officer] = false;
    }

    function addTransaction(string memory farmerName, uint256 amount) public {
        Transaction memory transaction = Transaction(farmerName, amount, false);
        transactions[msg.sender].push(transaction);
        emit TransactionAdded(farmerName, amount);
    }

    function approveTransaction(address farmerAddress, uint256 index) public onlyAuthorizedOfficer {
        Transaction storage transaction = transactions[farmerAddress][index];
        require(transaction.amount > 0, "Transaction does not exist");
        require(!transaction.approved, "Transaction already approved");
        transaction.approved = true;
        emit TransactionApproved(msg.sender, transaction.farmerName, transaction.amount);
    }

    function getTransactionCount(address farmerAddress) public view returns (uint256) {
        return transactions[farmerAddress].length;
    }

    function getTransaction(address farmerAddress, uint256 index) public view returns (string memory, uint256, bool) {
        Transaction memory transaction = transactions[farmerAddress][index];
        return (transaction.farmerName, transaction.amount, transaction.approved);
    }

    function getTransactionsByFarmer(address farmerAddress) public view returns (Transaction[] memory) {
        return transactions[farmerAddress];
    }
}
