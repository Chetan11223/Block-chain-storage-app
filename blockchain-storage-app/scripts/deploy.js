const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TransactionRegistry contract...");
  
  // Get the contract factory
  const TransactionRegistry = await ethers.getContractFactory("TransactionRegistry");
  
  // Deploy the contract
  const transactionRegistry = await TransactionRegistry.deploy();
  
  // Wait for deployment to complete
  await transactionRegistry.waitForDeployment();
  
  const contractAddress = await transactionRegistry.getAddress();
  console.log("TransactionRegistry deployed to:", contractAddress);
  
  // Save contract address and ABI for frontend
  const fs = require("fs");
  const contractData = {
    address: contractAddress,
    abi: transactionRegistry.interface.formatJson()
  };
  
  // Create frontend/contracts directory if it doesn't exist
  if (!fs.existsSync("../frontend/contracts")) {
    fs.mkdirSync("../frontend/contracts", { recursive: true });
  }
  
  fs.writeFileSync(
    "../frontend/contracts/TransactionRegistry.json",
    JSON.stringify(contractData, null, 2)
  );
  
  console.log("Contract ABI saved to frontend/contracts/TransactionRegistry.json");
  
  // Verify deployment
  console.log("Verifying contract deployment...");
  const owner = await transactionRegistry.owner();
  console.log("Contract owner:", owner);
  
  const transactionCount = await transactionRegistry.getTransactionCount();
  console.log("Initial transaction count:", transactionCount.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
