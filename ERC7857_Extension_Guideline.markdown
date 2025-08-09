# Claude Code Prompt: Scaffold-ETH 2 Extension for ERC-7857

## Objective
Develop a Scaffold-ETH 2 extension (`scaffold-erc7857`) implementing the ERC-7857 standard for Intelligent Non-Fungible Tokens (INFTs), based on `INFT_ERC7857_Guide.md` and the `OG-Agent-NFT-Main` repository structure. The extension must be publishable to GitHub/npm, installable via `npx create-eth@latest -e LingSiewWin/ERC-7857`, and include core contracts, React components, and Hardhat scripts.

## Requirements
- **Smart Contracts**: Implement `INFT.sol` with ERC-7857 interfaces (`IERC7857.sol`, `IERC7857DataVerifier.sol`, `IERC7857Metadata.sol`) for minting, transferring, and authorizing INFTs.
- **Frontend**: Provide React components for minting, transferring, and viewing INFTs using Scaffold-ETH 2 hooks.
- **Testing**: Include Hardhat tests for contract functionality.
- **Deployment**: Support Sapphire and Arbitrum testnets.
- **Documentation**: Create a `README.md` with installation and usage instructions.
- **Compatibility**: Ensure compatibility with `subgraph`, `privy-widget`, `erc-20` extensions and Oasis Sapphire.

## Reference
- Use `INFT_ERC7857_Guide.md` for:
  - `INFT.sol` implementation.
  - `MetadataManager.js` for metadata encryption.
  - React components and deployment scripts.
- Use `OG-Agent-NFT-Main` for:
  - Interfaces: `IERC7857.sol`, `IERC7857DataVerifier.sol`, `IERC7857Metadata.sol`.
  - Mock TEE verification logic (simplified from `TEEVerifier.sol`).

## Project Structure
```
scaffold-erc7857/
├── contracts/
│   ├── interfaces/
│   │   ├── IERC7857.sol
│   │   ├── IERC7857DataVerifier.sol
│   │   ├── IERC7857Metadata.sol
│   └── INFT.sol
├── packages/
│   ├── hardhat/
│   │   ├── scripts/
│   │   │   └── deploy.js
│   │   └── test/
│   │       └── INFT.test.js
│   ├── nextjs/
│   │   ├── components/
│   │   │   ├── MintINFT.jsx
│   │   │   ├── TransferINFT.jsx
│   │   │   └── ViewINFT.jsx
│   │   └── pages/
│   │       └── index.js
├── README.md
├── package.json
```

## Tasks
1. **Smart Contracts**:
   - Implement `INFT.sol` from `INFT_ERC7857_Guide.md`, ensuring it uses `IERC7857.sol`, `IERC7857DataVerifier.sol`, and `IERC7857Metadata.sol` from `OG-Agent-NFT-Main`.
   - Add mock oracle for TEE verification:
     ```solidity
     contract MockOracle {
         function verifyProof(bytes calldata proof) external pure returns (bool) {
             return true; // Simulate TEE verification
         }
     }
     ```

2. **Frontend Components**:
   - Create `MintINFT.jsx`:
     ```jsx
     import { useState } from "react";
     import { useContractWrite, usePrepareContractWrite } from "wagmi";
     import INFTArtifact from "../contracts/INFT.json";

     const MintINFT = ({ contractAddress }) => {
         const [encryptedURI, setEncryptedURI] = useState("");
         const [metadataHash, setMetadataHash] = useState("");
         const { config } = usePrepareContractWrite({
             address: contractAddress,
             abi: INFTArtifact.abi,
             functionName: "mint",
             args: [/* recipient address */, encryptedURI, metadataHash],
         });
         const { write } = useContractWrite(config);

         return (
             <div>
                 <input
                     type="text"
                     value={encryptedURI}
                     onChange={(e) => setEncryptedURI(e.target.value)}
                     placeholder="Encrypted URI"
                 />
                 <input
                     type="text"
                     value={metadataHash}
                     onChange={(e) => setMetadataHash(e.target.value)}
                     placeholder="Metadata Hash"
                 />
                 <button onClick={() => write?.()}>Mint INFT</button>
             </div>
         );
     };
     export default MintINFT;
     ```
   - Create `TransferINFT.jsx` and `ViewINFT.jsx` for transfers and metadata display.

3. **Hardhat Scripts**:
   - Implement `deploy.js`:
     ```javascript
     const { ethers } = require("hardhat");

     async function main() {
         const [deployer] = await ethers.getSigners();
         console.log("Deploying with account:", deployer.address);

         const MockOracle = await ethers.getContractFactory("MockOracle");
         const oracle = await MockOracle.deploy();
         await oracle.deployed();

         const INFT = await ethers.getContractFactory("INFT");
         const inft = await INFT.deploy("AI Agent NFTs", "AINFT", oracle.address);
         await inft.deployed();

         console.log("Oracle deployed to:", oracle.address);
         console.log("INFT deployed to:", inft.address);
     }

     main().catch((error) => {
         console.error(error);
         process.exitCode = 1;
     });
     ```
   - Configure `hardhat.config.js`:
     ```javascript
     module.exports = {
         networks: {
             sapphireTestnet: { url: "https://testnet.sapphire.oasis.io", accounts: [process.env.PRIVATE_KEY] },
             arbitrumTestnet: { url: "https://sepolia-rollup.arbitrum.io/rpc", accounts: [process.env.PRIVATE_KEY] }
         },
         solidity: "0.8.19"
     };
     ```

4. **Testing**:
   - Create `INFT.test.js`:
     ```javascript
     const { expect } = require("chai");

     describe("INFT Contract", function () {
         let inft, oracle, owner;

         beforeEach(async () => {
             const MockOracle = await ethers.getContractFactory("MockOracle");
             oracle = await MockOracle.deploy();
             await oracle.deployed();

             const INFT = await ethers.getContractFactory("INFT");
             [owner] = await ethers.getSigners();
             inft = await INFT.deploy("AI Agent NFTs", "AINFT", oracle.address);
             await inft.deployed();
         });

         it("should mint INFT", async function () {
             const metadata = { uri: "ipfs://example", hash: ethers.utils.keccak256("0x1234") };
             await expect(inft.mint(owner.address, metadata.uri, metadata.hash)).to.emit(inft, "Transfer");
         });
     });
     ```

5. **Documentation**:
   - Create `README.md`:
     ```
     # Scaffold-ERC7857
     Scaffold-ETH 2 extension for ERC-7857 INFTs.

     ## Installation
     npx create-eth@latest -e LingSiewWin/ERC-7857

     ## Features
     - ERC-7857 INFT contract with interfaces.
     - React components for minting, transferring, viewing INFTs.
     - Sapphire and Arbitrum testnet support.

     ## Usage
     1. Deploy INFT.sol: `npx hardhat run scripts/deploy.js --network sapphireTestnet`.
     2. Use MintINFT.jsx for INFT creation.
     ```

6. **Publishing**:
   - Initialize with `npm init -y`.
   - Add dependencies in `package.json`:
     ```json
     {
         "name": "@lingsiewwin/scaffold-erc7857",
         "version": "1.0.0",
         "dependencies": {
             "@openzeppelin/contracts": "^4.9.0",
             "ethers": "^5.7.0",
             "wagmi": "^1.0.0"
         },
         "devDependencies": {
             "@nomicfoundation/hardhat-toolbox": "^2.0.0",
             "hardhat": "^2.10.0"
         }
     }
     ```
   - Publish to npm: `npm publish --access public`.
   - Push to GitHub: `LingSiewWin/ERC-7857`.

## Testing and Validation
- Test deployment: `npx hardhat run scripts/deploy.js --network sapphireTestnet`.
- Verify installation: `npx create-eth@latest -e LingSiewWin/ERC-7857`.
- Test components and contract interactions.