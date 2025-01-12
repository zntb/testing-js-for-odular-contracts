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

const mintPrice = 0.00000000001; // Mint price per token in Ether
const amountToMint = 100; // Number of tokens to mint

// Correct total fee in Ether
const valueInEther = (mintPrice * amountToMint).toFixed(18); // 0.000000001
const valueInWei = BigInt(parseUnits(valueInEther, 'ether')); // Convert to Wei

// console.log('valueInEther:', valueInEther); // Should print: 0.000000001
// console.log('valueInWei:', valueInWei); // Should print: 1000000000000n

const transaction = prepareContractCall({
  contract,
  method: 'function mint(address to, uint256 amount, bytes data) payable',
  params: [
    '0x2a55160EC26125006b4F38D4f408ae342F1d2966', // Recipient
    BigInt(parseUnits('100', 'ether')), // Mint 100 tokens
    '0x', // Additional data
  ],
  value: valueInWei, // Correct fee in Wei
});

async function main() {
  // send transaction
  // console.log('sending mint transaction...');
  let result;
  try {
    result = await sendTransaction({
      transaction: transaction,
      account: account,
    });
    // console.log('Transaction sent:', result);
  } catch (error) {
    console.error('Transaction failed:', error);
    return;
  }

  try {
    const receipt = await waitForReceipt(result);
    console.log('Mint successful', receipt.transactionHash);
  } catch (error) {
    console.error('Failed to get receipt:', error);
  }
}

main();
