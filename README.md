# ERC-7857 AI Agents - Scaffold-ETH Extension

A production-ready Scaffold-ETH extension that adds ERC-7857 AI Agent NFT functionality with TEE verification support.

## Installation

```bash
npx create-eth@latest -e LingSiewWin/ERC-7857
```

## What You Get

This extension adds a complete ERC-7857 AI Agent NFT system to your Scaffold-ETH project:

### Smart Contracts
- **ERC7857AIAgents**: Main NFT contract implementing ERC-7857 standard
- **OasisTEEVerifier**: TEE verification for secure data handling  
- **IDataVerifier**: Interface for proof verification

### Features
- ✅ **ERC-7857 Compliant**: Full AI Agent NFT standard implementation
- ✅ **TEE Integration**: Secure data verification using Trusted Execution Environments
- ✅ **Oasis ROFL Support**: Optimized for Oasis Privacy Layer integration
- ✅ **Multi-Network**: Pre-configured for Oasis, Sepolia, localhost
- ✅ **Production Ready**: Comprehensive test suite (8/8 tests passing)
- ✅ **ERC-4337 Compatible**: Works with account abstraction for gasless transactions

## Quick Start

1. **Install the extension**:
   ```bash
   npx create-eth@latest -e LingSiewWin/ERC-7857
   cd your-project-name
   ```

2. **Set up environment**:
   ```bash
   # Add to .env.local
   DEPLOYER_PRIVATE_KEY=your_private_key_without_0x
   ```

3. **Deploy contracts**:
   ```bash
   yarn deploy --network oasis
   # or
   yarn deploy --network sepolia
   ```

4. **Run tests**:
   ```bash
   yarn hardhat:test
   ```

## Usage Examples

### Mint AI Agent NFT
```javascript
const proof = generateTEEOwnershipProof(agentData);
await agentContract.mint([proof], ["AI Trading Bot"]);
```

### Transfer Agent
```javascript
const transferProof = generateTEETransferProof(oldData, newData);
await agentContract.transfer(recipient, tokenId, [transferProof]);
```

### Clone Agent
```javascript
const cloneProof = generateTEETransferProof(sourceData, newData);
const newTokenId = await agentContract.clone(recipient, tokenId, [cloneProof]);
```

## Supported Networks

Pre-configured networks:
- **Oasis Testnet**: TEE verification with ROFL support
- **Sepolia**: Ethereum testnet
- **Localhost**: Local development

Deploy with:
```bash
yarn deploy --network <network-name>
```

## Key Functions

- `mint()` - Create new AI agent NFT with ownership proofs
- `transfer()` - Transfer ownership with validity proofs
- `clone()` - Clone agent data to new recipient
- `authorizeUsage()` - Grant usage permissions to users

## Environment Setup

Required environment variables:
```env
DEPLOYER_PRIVATE_KEY=your_private_key_without_0x
INFURA_KEY=your_infura_project_id  # optional, for custom RPC
```

## Development

The extension includes:
- Complete smart contract suite
- Comprehensive test coverage
- Deployment scripts for multiple networks
- Environment configuration templates

## License

MIT License

## Contributing

Contributions welcome! Please open issues and pull requests.
