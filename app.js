const Web3 = require('web3');
const FarmChain = require('./build/contracts/FarmChain.json');

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

const contractAddress = '0x15AdeAeD9ef2bBbf8147465A284F7dB2552aB6d6';
const farmChain = new web3.eth.Contract(FarmChain.abi, contractAddress);

const transactionForm = document.getElementById('transaction-form');
const statusDiv = document.getElementById('status');

transactionForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = transactionForm.elements['name'].value;
  const id = transactionForm.elements['id'].value;
  const amount = transactionForm.elements['amount'].value;

  // Create the transaction data
  const data = farmChain.methods.addTransaction(name, id, amount).encodeABI();

  // Get the officer's address from the contract
  const officerAddress = await farmChain.methods.officer().call();

  // Create the transaction object
  const txObject = {
    from: officerAddress,
    to: contractAddress,
    gas: 2000000,
    gasPrice: web3.utils.toWei('10', 'gwei'),
    data: data
  };

  // Sign and send the transaction
  web3.eth.accounts.signTransaction(txObject, '<private-key>').then(signedTx => {
    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      .on('receipt', (receipt) => {
        statusDiv.innerHTML = `Transaction successful. Transaction hash: ${receipt.transactionHash}`;
      })
      .on('error', (error) => {
        statusDiv.innerHTML = `Transaction failed: ${error.message}`;
      });
  });
});
