const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying ERC-7857 AI Agents contracts...");

  // Deploy the verifier contract first
  const OasisTEEVerifier = await ethers.getContractFactory("OasisTEEVerifier");
  console.log("Deploying OasisTEEVerifier...");
  const verifier = await OasisTEEVerifier.deploy();
  await verifier.waitForDeployment();
  console.log("OasisTEEVerifier deployed to:", await verifier.getAddress());

  // Deploy the main ERC7857AIAgents contract
  const ERC7857AIAgents = await ethers.getContractFactory("ERC7857AIAgents");
  console.log("Deploying ERC7857AIAgents...");
  const agentContract = await ERC7857AIAgents.deploy(await verifier.getAddress());
  await agentContract.waitForDeployment();
  console.log("ERC7857AIAgents deployed to:", await agentContract.getAddress());

  // Verify deployment
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", network.name);
  console.log("OasisTEEVerifier:", await verifier.getAddress());
  console.log("ERC7857AIAgents:", await agentContract.getAddress());
  
  // Test basic functionality
  console.log("\n=== Testing Contract ===");
  console.log("Contract name:", await agentContract.name());
  console.log("Contract symbol:", await agentContract.symbol());
  console.log("Verifier address:", await agentContract.verifier());

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.config.chainId,
    verifier: await verifier.getAddress(),
    agentContract: await agentContract.getAddress(),
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