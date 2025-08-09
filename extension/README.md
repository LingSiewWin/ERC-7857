# ERC-7857 AI Agents Extension

This extension adds ERC-7857 AI Agent NFT functionality to your Scaffold-ETH project with TEE (Trusted Execution Environment) verification support.

## What This Extension Adds

- **Smart Contracts**: Complete ERC-7857 implementation with Oasis TEE verification
- **Deployment Scripts**: Ready-to-use deployment for multiple networks
- **Test Suite**: Comprehensive tests covering all functionality
- **Network Configuration**: Pre-configured for Oasis and Sepolia testnets

## Features

- ✅ **ERC-7857 Compliance**: Full implementation of AI Agent NFT standard
- ✅ **TEE Integration**: Secure data verification using Trusted Execution Environments
- ✅ **Oasis ROFL Support**: Optimized for Oasis Privacy Layer
- ✅ **Multi-Network**: Supports Oasis, Sepolia, and local networks
- ✅ **Production Ready**: Comprehensive test coverage

## Contracts Added

1. **ERC7857AIAgents.sol** - Main contract implementing ERC-7857 standard
2. **OasisTEEVerifier.sol** - TEE verification contract for Oasis integration
3. **IDataVerifier.sol** - Interface for data verification

## Usage

After installation, you can:

1. **Deploy contracts**:
   ```bash
   yarn deploy --network oasis
   ```

2. **Run tests**:
   ```bash
   yarn hardhat:test
   ```

3. **Mint AI Agent NFTs**:
   ```javascript
   const proof = generateTEEOwnershipProof(agentData);
   await agentContract.mint([proof], ["AI Trading Bot"]);
   ```

## Environment Setup

Create `.env.local` with:
```env
DEPLOYER_PRIVATE_KEY=your_private_key_without_0x
```

## Networks Supported

- **Oasis Testnet** (recommended for hackathons)
- **Sepolia Testnet** 
- **Localhost**

## Use Cases

Perfect for building:
- **AI Agent Marketplaces**: Trade AI agents as NFTs
- **Decentralized AI Platforms**: Secure AI model ownership
- **TEE-Based Applications**: Privacy-preserving AI systems
- **Cross-Chain AI Solutions**: Multi-network AI agent deployment