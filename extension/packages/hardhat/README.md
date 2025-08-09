# ERC-7857 Smart Contracts

## Environment Setup

1. **Copy the environment template:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Fill in your values in `.env.local`:**
   ```env
   # Required for testnet deployment
   PRIVATE_KEY=your_private_key_without_0x_prefix
   
   # Optional for Ethereum networks
   INFURA_KEY=your_infura_project_id
   
   # Optional for contract verification
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

## Supported Networks

### ✅ **Ready to Use (No API keys needed)**
- `hardhat` - Built-in Hardhat network
- `localhost` - Local Hardhat node (`npx hardhat node`)

### 🔧 **Testnet Networks (Requires PRIVATE_KEY)**
- `sapphireTestnet` - Oasis Sapphire (TEE verification)
- `arbitrumTestnet` - Arbitrum Sepolia (L2 scaling)
- `sepolia` - Ethereum Sepolia (requires INFURA_KEY or uses public RPC)
- `oasis` - Oasis Emerald (general purpose)

## Deployment

```bash
# Local development (no keys needed)
npx hardhat run scripts/deploy.js --network hardhat
npx hardhat run scripts/deploy.js --network localhost

# Testnet deployment (needs PRIVATE_KEY in .env.local)
npx hardhat run scripts/deploy.js --network sapphireTestnet
npx hardhat run scripts/deploy.js --network arbitrumTestnet
```

## Testing

```bash
npx hardhat test
```