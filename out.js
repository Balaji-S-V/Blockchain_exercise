const Web3 = require('web3');
const FarmChain = require('./build/contracts/FarmChain.json');

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

const contractAddress = '0x15AdeAeD9ef2bBbf8147465A284F7dB2552aB6d6';
const farmChain = new web3.eth.Contract(FarmChain.abi, contractAddress);

const form = document.getElementById('form');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = form.elements['id'].value;

  try {
    const transaction = await farmChain.methods.getTransaction(id).call();
        resultDiv.innerHTML = `Name: ${transaction.name}<br>ID: ${transaction.id}<br>Amount: ${transaction.amount}`;
  } catch (error) {
    resultDiv.innerHTML = `Error: ${error.message}`;
  }
});
