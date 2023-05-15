const { error } = require('console');
const fs = require('fs');
const solc = require('solc');
const version = '0.8.19'
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

function compile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const input = {
    language: 'Solidity',
    sources: {
      [filePath]: {
        content: source
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  return output.contracts[filePath];
}
function getAccount() 
{
    return web3.eth.accounts[0];
}

const filePath = 'D:/Trufflechain/contracts/FarmChain.sol';
const compiledContract = compile(filePath);
console.log('compiledContract:', compiledContract);
if(compiledContract.errors){
  console.error(compiledContract.errors);
  return;
}

const abi = compiledContract['FarmChain'].abi;
const bytecode = '0x' + compiledContract['FarmChain'].evm.bytecode.object;
let officers = [];

// Get accounts from Ganache test network
web3.eth.getAccounts().then(accounts => {
  officers = accounts.slice(0, 3); // Take first three accounts as officers
  console.log('Officers:', officers);
}).catch(error => {
  console.log(error);
});

web3.eth.getAccounts().then(accounts =>
  {
const account = web3.eth.accounts[0];
const gas = 2000000;
const contract = new web3.eth.Contract(abi);
console.log('Deploying the contract');
const from = accounts[5];
console.log('Account: ',account);
contract.deploy({arguments: [officers],data: bytecode})
.send({ from: from, gas: 1500000,
  gasPrice:web3.utils.toWei('0.00003','ether')
})
.on('error', function(error) {
    console.log(error);
})
.on('transactionHash', function(transactionHash) {
    console.log('Transaction hash: ' + transactionHash);
})
.on('receipt', function(receipt) 
{
    console.log('Contract address: ' + receipt.contractAddress);
    const farmChainInstance = new web3.eth.Contract(abi, receipt.contractAddress);
    const farmerAddress = web3.eth.accounts[4];
    farmChainInstance.methods.getTransactionCount(farmerAddress).call().then(count => {
      console.log('Number of transactions for farmer at address ' + farmerAddress + ': ' + count);
    }).catch(error => {
      console.log(error);
    });
  
    farmChainInstance.methods.addOfficer(...officers).send({ from: officers[5], gas: gas })
    .on('error', function(error) {
      console.log(error);
    })
    .on('receipt', function(receipt) {
      console.log(receipt);
    });

})
.then(function(newContractInstance) {
    console.log('New contract instance address: ' + newContractInstance.options.address);
});
  }).catch(error=>
    {console.log(error)});
