import { useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import MintINFT from "../components/MintINFT";
import TransferINFT from "../components/TransferINFT";
import ViewINFT from "../components/ViewINFT";
import deployments from "../contracts/deployments.json";

// Contract ABIs (simplified for demo)
const INFT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function mint(address to, string memory encryptedMetadataURI, bytes32 metadataHash) returns (uint256)",
  "function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory transferProof)",
  "function clone(uint256 tokenId, address to) returns (uint256)",
  "function authorizeUsage(uint256 tokenId, address user, uint256 duration)",
  "function isAuthorized(uint256 tokenId, address user) view returns (bool)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function metadataHash(uint256 tokenId) view returns (bytes32)",
  "function getINFTData(uint256 tokenId) view returns (string memory, bytes32, address, uint256, uint256, bool)"
];

const ORACLE_ABI = [
  "function verifyProof(bytes calldata proof) pure returns (bool)",
  "function generateOwnershipProof(bytes32 dataHash, address owner) view returns (bytes memory)",
  "function createTransferProof(bytes32 oldDataHash, bytes32 newDataHash, address from, address to) view returns (bytes memory)"
];

export default function Home() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [activeTab, setActiveTab] = useState("mint");

  // Get deployed contract addresses for current network
  const getContractAddresses = () => {
    if (!chain) return null;
    
    const networkDeployments = deployments[chain.id];
    return networkDeployments || null;
  };

  const contracts = getContractAddresses();

  const tabs = [
    { id: "mint", name: "Mint INFT", icon: "⚡" },
    { id: "transfer", name: "Transfer", icon: "🔄" },
    { id: "view", name: "View INFT", icon: "👁️" }
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <h1 className="card-title text-3xl mb-4">ERC-7857 INFTs</h1>
            <p className="text-base-content/70 mb-6">
              Create and manage Intelligent Non-Fungible Tokens with AI capabilities
            </p>
            <ConnectButton />
          </div>
        </div>
      </div>
    );
  }

  if (!contracts) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">Network not supported</h3>
            <p className="text-sm">Please connect to Sapphire Testnet or Arbitrum Testnet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="navbar-start">
          <h1 className="text-xl font-bold">ERC-7857 INFTs</h1>
        </div>
        <div className="navbar-center">
          <div className="tabs tabs-boxed">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
        <div className="navbar-end">
          <ConnectButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          {activeTab === "mint" && (
            <MintINFT
              contractAddress={contracts.inft}
              contractABI={INFT_ABI}
            />
          )}
          
          {activeTab === "transfer" && (
            <TransferINFT
              contractAddress={contracts.inft}
              contractABI={INFT_ABI}
              oracleAddress={contracts.mockOracle}
              oracleABI={ORACLE_ABI}
            />
          )}
          
          {activeTab === "view" && (
            <ViewINFT
              contractAddress={contracts.inft}
              contractABI={INFT_ABI}
            />
          )}
        </div>
      </div>

      {/* Network Info */}
      <div className="fixed bottom-4 right-4">
        <div className="badge badge-info">
          {chain?.name || "Unknown Network"}
        </div>
      </div>

      {/* Contract Addresses Info */}
      <div className="fixed bottom-4 left-4">
        <details className="dropdown">
          <summary className="btn btn-sm btn-outline">Contract Info</summary>
          <div className="dropdown-content z-50 p-4 shadow bg-base-100 rounded-box w-80">
            <h4 className="font-semibold mb-2">Deployed Contracts</h4>
            <div className="space-y-2 text-xs">
              <div>
                <strong>INFT:</strong>
                <p className="font-mono break-all">{contracts.inft}</p>
              </div>
              <div>
                <strong>Mock Oracle:</strong>
                <p className="font-mono break-all">{contracts.mockOracle}</p>
              </div>
              <div>
                <strong>TEE Verifier:</strong>
                <p className="font-mono break-all">{contracts.verifier}</p>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}