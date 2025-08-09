import { ZeroGStorage } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";

class MetadataManager {
  constructor(rpcUrl, storageUrl) {
    this.storage = new ZeroGStorage({ rpcUrl, storageUrl });
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      try {
        await this.storage.connect();
        this.initialized = true;
      } catch (error) {
        console.error("Failed to initialize 0G Storage:", error);
        throw error;
      }
    }
  }

  /**
   * Creates an AI agent with encrypted metadata storage
   * @param {Object} aiModelData - The AI model data
   * @param {string} ownerPublicKey - Owner's public key for encryption
   * @returns {Object} Contains encryptedURI, metadataHash, and dataDescriptions
   */
  async createAIAgent(aiModelData, ownerPublicKey) {
    await this.initialize();

    const metadata = {
      model: aiModelData.model || "Unknown Model",
      weights: aiModelData.weights || "",
      description: aiModelData.description || "AI Agent Description",
      capabilities: aiModelData.capabilities || [],
      version: aiModelData.version || "1.0.0",
      createdAt: new Date().toISOString(),
      owner: ownerPublicKey
    };

    const data = JSON.stringify(metadata);
    
    // Generate encryption key
    const encryptionKey = this.generateEncryptionKey();
    
    // Encrypt the data
    const encryptedData = await this.encryptData(data, encryptionKey);
    
    try {
      // Store encrypted data using 0G SDK
      const storageResult = await this.storage.store(encryptedData);
      
      // Generate metadata hash
      const metadataHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(data));

      return {
        encryptedURI: storageResult.uri || `0g://${storageResult.hash}`,
        metadataHash,
        dataDescriptions: [metadata.description],
        encryptionKey: encryptionKey.toString('hex'), // Store for later decryption
        storageHash: storageResult.hash
      };
    } catch (error) {
      console.error("Failed to store data with 0G SDK:", error);
      
      // Fallback to IPFS-style storage
      const fallbackURI = this.createFallbackURI(encryptedData);
      const metadataHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(data));
      
      return {
        encryptedURI: fallbackURI,
        metadataHash,
        dataDescriptions: [metadata.description],
        encryptionKey: encryptionKey.toString('hex')
      };
    }
  }

  /**
   * Retrieves and decrypts AI agent metadata
   * @param {string} encryptedURI - The encrypted URI from 0G storage
   * @param {string} encryptionKey - Encryption key (hex string)
   * @returns {Object} Decrypted metadata
   */
  async retrieveAIAgent(encryptedURI, encryptionKey) {
    await this.initialize();

    try {
      let encryptedData;
      
      if (encryptedURI.startsWith('0g://')) {
        // Retrieve from 0G storage
        const hash = encryptedURI.replace('0g://', '');
        encryptedData = await this.storage.retrieve(hash);
      } else {
        // Handle fallback storage
        encryptedData = await this.retrieveFromFallback(encryptedURI);
      }

      // Decrypt the data
      const decryptedData = await this.decryptData(
        encryptedData, 
        Buffer.from(encryptionKey, 'hex')
      );

      return JSON.parse(decryptedData);
    } catch (error) {
      console.error("Failed to retrieve AI agent metadata:", error);
      throw error;
    }
  }

  /**
   * Updates existing AI agent metadata
   * @param {string} originalURI - Original encrypted URI
   * @param {string} originalKey - Original encryption key
   * @param {Object} updates - Updates to apply
   * @returns {Object} New encrypted URI and metadata hash
   */
  async updateAIAgent(originalURI, originalKey, updates) {
    // Retrieve original metadata
    const originalMetadata = await this.retrieveAIAgent(originalURI, originalKey);
    
    // Apply updates
    const updatedMetadata = {
      ...originalMetadata,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: this.incrementVersion(originalMetadata.version)
    };

    // Store updated metadata
    return await this.createAIAgent(updatedMetadata, originalMetadata.owner);
  }

  /**
   * Encrypts data using AES encryption
   * @param {string} data - Data to encrypt
   * @param {Buffer} key - Encryption key
   * @returns {Buffer} Encrypted data
   */
  async encryptData(data, key) {
    // For demo purposes, using base64 encoding
    // In production, use proper AES encryption
    const encrypted = Buffer.from(data).toString('base64');
    return Buffer.from(encrypted);
  }

  /**
   * Decrypts data using AES decryption
   * @param {Buffer} encryptedData - Encrypted data
   * @param {Buffer} key - Decryption key
   * @returns {string} Decrypted data
   */
  async decryptData(encryptedData, key) {
    // For demo purposes, using base64 decoding
    // In production, use proper AES decryption
    const base64Data = encryptedData.toString();
    return Buffer.from(base64Data, 'base64').toString();
  }

  /**
   * Generates a random encryption key
   * @returns {Buffer} Random encryption key
   */
  generateEncryptionKey() {
    // Generate 32-byte encryption key
    return Buffer.from(ethers.utils.randomBytes(32));
  }

  /**
   * Creates a fallback URI for data storage
   * @param {Buffer} data - Data to store
   * @returns {string} Fallback URI
   */
  createFallbackURI(data) {
    const hash = ethers.utils.keccak256(data);
    return `data:application/json;base64,${data.toString('base64')}`;
  }

  /**
   * Retrieves data from fallback storage
   * @param {string} uri - Fallback URI
   * @returns {Buffer} Retrieved data
   */
  async retrieveFromFallback(uri) {
    if (uri.startsWith('data:application/json;base64,')) {
      const base64Data = uri.replace('data:application/json;base64,', '');
      return Buffer.from(base64Data, 'base64');
    }
    throw new Error("Unsupported fallback URI format");
  }

  /**
   * Increments version string
   * @param {string} version - Current version (e.g., "1.0.0")
   * @returns {string} Incremented version
   */
  incrementVersion(version) {
    const parts = version.split('.');
    const patch = parseInt(parts[2] || 0) + 1;
    return `${parts[0] || 1}.${parts[1] || 0}.${patch}`;
  }

  /**
   * Validates AI model data structure
   * @param {Object} aiModelData - Data to validate
   * @returns {boolean} True if valid
   */
  validateAIModelData(aiModelData) {
    const required = ['model', 'description'];
    return required.every(field => aiModelData[field] && aiModelData[field].length > 0);
  }

  /**
   * Creates metadata for testing
   * @returns {Object} Test metadata
   */
  createTestMetadata() {
    return {
      model: "GPT-4",
      weights: "https://example.com/weights",
      description: "Advanced AI language model for text generation",
      capabilities: ["text-generation", "question-answering", "summarization"],
      version: "1.0.0"
    };
  }
}

export default MetadataManager;