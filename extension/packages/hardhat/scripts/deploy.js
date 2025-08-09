const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying ERC-7857 contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy MockOracle for testing
  const MockOracle = await ethers.getContractFactory("MockOracle");
  console.log("Deploying MockOracle...");
  const oracle = await MockOracle.deploy();
  await oracle.deployed();
  console.log("MockOracle deployed to:", oracle.address);

  // Deploy INFT contract
  const INFT = await ethers.getContractFactory("INFT");
  console.log("Deploying INFT...");
  const inft = await INFT.deploy("AI Agent NFTs", "AINFT", oracle.address);
  await inft.deployed();
  console.log("INFT deployed to:", inft.address);

  // Note: OasisTEEVerifier and ERC7857AIAgents can be added in extended implementations
  // For now, we have the core INFT contract implementing ERC-7857

  // Verify deployment
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", network.name);
  console.log("MockOracle:", oracle.address);
  console.log("INFT (ERC-7857):", inft.address);
  
  // Test basic functionality
  console.log("\n=== Testing Contracts ===");
  console.log("INFT name:", await inft.name());
  console.log("INFT symbol:", await inft.symbol());
  console.log("Data Verifier:", await inft.dataVerifier());

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.config.chainId,
    mockOracle: oracle.address,
    inft: inft.address,
    deploymentTime: new Date().toISOString()
  };

  console.log("\n=== Deployment Info ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });