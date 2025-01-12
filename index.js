require('dotenv').config();
const { privateKeyToAccount } = require('thirdweb/wallets');
const { defineChain } = require('thirdweb/chains');
const {
  createThirdwebClient,
  getContract,
  prepareContractCall,
  sendTransaction,
  waitForReceipt,
} = require('thirdweb');

const { parseUnits } = require('ethers');

// Create the client with your clientId, or secretKey if in a server environment
const client = createThirdwebClient({
  clientId: process.env.THIRDWEB_CLIENT_ID,
});

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const TARGET_TOKEN_CORE_ADDRESS = '0x0f42596c99112FFDbb11d409a1Eefc65f3Ce056f';

const account = privateKeyToAccount({
  client,
  privateKey: PRIVATE_KEY,
});

const contract = getContract({
  client,
  address: TARGET_TOKEN_CORE_ADDRESS,
  chain: defineChain(11155111),
});

const valueInEther = '0.000001';
const valueInWei = BigInt(parseUnits(valueInEther, 'ether'));

const transaction = prepareContractCall({
  contract,
  method: 'function mint(address to, uint256 amount, bytes data) payable',
  params: ['0x2a55160EC26125006b4F38D4f408ae342F1d2966', 50000, '0x'],
  // value: valueInWei,
});

async function main() {
  // send transaction
  const result = await sendTransaction({
    transaction: transaction,
    account: account,
  });

  const receipt = await waitForReceipt(result);

  console.log('mint successfully', receipt.transactionHash);
}

main();
