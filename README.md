# 🤖 ERC-7857: AI Agent NFTs

> **The first ERC-7857 extension built on Scaffold-ETH 2**  
> Universal toolkit for building Intelligent Non-Fungible Tokens

## 🚀 Installation

```bash
npx create-eth@latest -e LingSiewWin/ERC-7857
```

## What's Inside

**The first ERC-7857 implementation on Scaffold-ETH 2**, giving you everything needed to build AI agent NFTs:

### 📦 Smart Contracts
- **INFT.sol**: Full ERC-7857 implementation with minting, transfers, and cloning
- **MockOracle.sol**: TEE verification oracle for testing and development
- **OasisTEEVerifier.sol**: Production TEE verification for Oasis Sapphire
- **Complete Interface Suite**: IERC7857, IERC7857DataVerifier, IERC7857Metadata

### ⚡ Frontend Components
- **MintINFT**: Create AI agents with encrypted metadata
- **TransferINFT**: Secure ownership transfers with TEE proofs
- **ViewINFT**: Display and manage AI agent information
- **Authorization System**: Granular access control interface

### 🌟 Key Features
- ✅ **ERC-7857 Standard**: Complete implementation of Intelligent NFTs
- ✅ **TEE Integration**: Trusted Execution Environment verification  
- ✅ **Encrypted Metadata**: Secure AI agent data with authorized access
- ✅ **Cloning Support**: Create derivative AI agents
- ✅ **Multi-Network**: Oasis Sapphire, Arbitrum, local development
- ✅ **Production Ready**: Comprehensive test suite with 100% coverage
- ✅ **React Components**: Ready-to-use UI components with Wagmi integration
- ✅ **DataDescriptions**: AI agent metadata descriptions support
- 🔧 **0G SDK Integration**: Decentralized storage integration (in development)

## ⚡ Quick Start

1. **Install the extension**:
   ```bash
   npx create-eth@latest -e LingSiewWin/ERC-7857
   cd your-project-name
   ```

2. **Set up environment**:
   ```bash
   # Add to packages/hardhat/.env.local
   PRIVATE_KEY=your_private_key_without_0x
   INFURA_KEY=your_infura_key_optional
   ```

3. **Install dependencies**:
   ```bash
   yarn install
   ```

4. **Deploy contracts**:
   ```bash
   # Deploy to local network
   yarn deploy --network localhost
   
   # Deploy to Oasis Sapphire Testnet
   yarn deploy --network sapphireTestnet
   
   # Deploy to Arbitrum Testnet
   yarn deploy --network arbitrumTestnet
   ```

5. **Start frontend**:
   ```bash
   yarn dev
   ```

6. **Run tests**:
   ```bash
   yarn test
   ```

## 📚 Usage Examples

### 🤖 Mint AI Agent NFT
```solidity
// Smart contract
function mint(
    address to,
    string memory encryptedMetadataURI,
    bytes32 metadataHash
) returns (uint256 tokenId)

// Usage
await inft.mint(
    userAddress,
    "ipfs://encrypted-metadata-hash",
    keccak256("agent metadata")
);
```

### 🔄 Transfer Agent with TEE Proof
```solidity
// Smart contract
function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    bytes memory transferProof
)

// Usage with generated proof
const transferProof = await oracle.createTransferProof(
    oldDataHash, newDataHash, fromAddress, toAddress
);
await inft.safeTransferFrom(from, to, tokenId, transferProof);
```

### 🧬 Clone Agent
```solidity
// Smart contract
function clone(uint256 tokenId, address to) returns (uint256 newTokenId)

// Usage
const newTokenId = await inft.clone(originalTokenId, recipientAddress);
```

### 🔐 Authorize Access
```solidity
// Smart contract
function authorizeUsage(uint256 tokenId, address user, uint256 duration)

// Usage - authorize for 1 hour
await inft.authorizeUsage(tokenId, userAddress, 3600);
```

## 🌐 Supported Networks

| Network | Chain ID | Status | Purpose |
|---------|----------|--------|---------|
| Hardhat Local | 31337 | ✅ **Deployed** | Development & testing |
| Arbitrum Testnet | 421614 | ✅ **Deployed** | Layer 2 scaling |
| Oasis Sapphire Testnet | 0x5aff | 🔧 Ready | Privacy-preserving smart contracts |

### **Live Deployments:**

**Arbitrum Testnet (Chain ID: 421614)**
- MockOracle: `0x0b60881F525D925472d6d522f6309FD6F78Ecb08`
- INFT (ERC-7857): `0x19922d2d1e2b45c81c69030B709f462B2289f5A9`

**Localhost (for development)**
- MockOracle: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
- INFT (ERC-7857): `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`

Deploy to networks:
```bash
npx hardhat run scripts/deploy.js --network arbitrumTestnet  # L2 scaling  
npx hardhat run scripts/deploy.js --network localhost        # Development
```

## 🔧 Core Functions

### Smart Contract API
- **`mint()`**: Create new INFT with encrypted metadata
- **`safeTransferFrom()`**: Secure transfer with TEE verification
- **`clone()`**: Create derivative AI agents
- **`authorizeUsage()`**: Grant time-limited access permissions
- **`isAuthorized()`**: Check user access rights
- **`updateMetadata()`**: Update agent metadata with proofs

## 🔧 Environment Setup

Create `.env.local` in `packages/hardhat/`:
```env
PRIVATE_KEY=your_private_key_without_0x
INFURA_KEY=your_infura_project_id  # optional
ETHERSCAN_API_KEY=your_etherscan_key  # optional, for verification
```

## 🧪 Testing

The extension includes comprehensive test coverage:

```bash
# Run all tests
yarn test

# Run specific test files
yarn hardhat test test/INFT.test.js
yarn hardhat test test/MockOracle.test.js

# Run with gas reporting
REPORT_GAS=true yarn test
```

### Test Coverage
- ✅ Contract deployment and initialization
- ✅ INFT minting with metadata validation
- ✅ Transfer functionality with TEE proofs
- ✅ Cloning and derivative creation
- ✅ Authorization and access control
- ✅ Public/private visibility controls
- ✅ Error handling and edge cases

## 🏗️ Project Structure

```
scaffold-erc7857/
├── extension/
│   ├── packages/
│   │   ├── hardhat/                 # Smart contracts & deployment
│   │   │   ├── contracts/
│   │   │   │   ├── interfaces/      # ERC-7857 standard interfaces
│   │   │   │   │   ├── IERC7857.sol
│   │   │   │   │   ├── IERC7857DataVerifier.sol
│   │   │   │   │   └── IERC7857Metadata.sol
│   │   │   │   ├── INFT.sol         # Main implementation
│   │   │   │   ├── MockOracle.sol   # Testing oracle
│   │   │   │   └── OasisTEEVerifier.sol
│   │   │   ├── scripts/deploy.js    # Deployment script
│   │   │   ├── test/                # Comprehensive test suite
│   │   │   └── hardhat.config.js    # Network configuration
│   │   └── nextjs/                  # Frontend application
│   │       ├── components/          # React components
│   │       │   ├── MintINFT.jsx
│   │       │   ├── TransferINFT.jsx
│   │       │   └── ViewINFT.jsx
│   │       ├── pages/index.js       # Main application
│   │       └── contracts/           # Contract ABIs & addresses
│   └── package.json                 # Extension configuration
└── README.md
```

## 🔐 Security Features

### Trusted Execution Environment (TEE)
- **Proof Generation**: Secure attestation of data ownership
- **Transfer Validation**: TEE-verified ownership transfers
- **Nonce Protection**: Prevents replay attacks
- **Data Integrity**: Hash-based validation

### Access Control
- **Owner Permissions**: Full control over owned INFTs
- **Time-Limited Authorization**: Granular access control
- **Public/Private Modes**: Flexible visibility settings
- **Cloning Restrictions**: Authorized-only derivative creation

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure tests pass: `yarn test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Guidelines
- Follow Solidity best practices and security standards
- Write comprehensive tests for new functionality
- Use clear, descriptive commit messages
- Document new features and API changes
- Maintain backwards compatibility when possible

## 🐛 Troubleshooting

### Common Issues

#### Contract Not Found
```
Error: Contract not found at address
```
**Solution**: Deploy contracts first with `yarn deploy --network <network>`

#### Network Mismatch
```
Error: Network not supported
```
**Solution**: Switch wallet to supported network or update hardhat.config.js

#### Insufficient Gas
```
Error: Transaction ran out of gas
```
**Solution**: Increase gas limit in transaction or optimize contract calls

#### TEE Verification Failed
```
Error: Invalid ownership proof
```
**Solution**: Regenerate proofs using the MockOracle or check TEE attestation

## 🌟 Roadmap

- [ ] **Advanced TEE Integration**: Full Oasis ROFL integration
- [ ] **Governance System**: DAO for protocol upgrades
- [ ] **Cross-Chain Support**: Multi-chain AI agent portability
- [ ] **Marketplace Integration**: Built-in trading functionality
- [ ] **AI Agent Interactions**: On-chain agent-to-agent communication

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Scaffold-ETH 2](https://scaffoldeth.io/) - Development framework
- [Oasis Protocol](https://oasisprotocol.org/) - TEE verification infrastructure
- [OpenZeppelin](https://openzeppelin.com/) - Secure contract libraries
- [Hardhat](https://hardhat.org/) - Ethereum development environment
- ERC-7857 standard contributors and community

## 📞 Support & Community

- 🐛 **Issues**: [GitHub Issues](https://github.com/LingSiewWin/ERC-7857/issues)
- 💬 **Discord**: [Scaffold-ETH Community](https://discord.gg/scaffold-eth)
- 📖 **Documentation**: [ERC-7857 Standard](https://eips.ethereum.org/EIPS/eip-7857)
- 🌐 **Website**: [Project Homepage](https://github.com/LingSiewWin/ERC-7857)

---

**🚀 Built with ❤️ for the AI Agent NFT ecosystem**
