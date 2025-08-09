// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IERC7857Metadata
 * @dev Interface for metadata management in ERC-7857 INFTs
 */
interface IERC7857Metadata {
    /**
     * @dev Structure for INFT metadata
     */
    struct INFTMetadata {
        string name;
        string description;
        string encryptedDataURI;
        bytes32 dataHash;
        string modelType;
        string[] capabilities;
        uint256 version;
        uint256 createdAt;
        uint256 lastUpdated;
        mapping(string => string) attributes;
    }

    /**
     * @dev Structure for encrypted metadata
     */
    struct EncryptedMetadata {
        bytes encryptedData;
        bytes32 dataHash;
        string encryptionMethod;
        bytes publicKey;
    }

    /**
     * @dev Emitted when metadata is created
     */
    event MetadataCreated(
        uint256 indexed tokenId,
        string name,
        bytes32 dataHash
    );

    /**
     * @dev Emitted when metadata is updated
     */
    event MetadataUpdated(
        uint256 indexed tokenId,
        bytes32 oldHash,
        bytes32 newHash,
        uint256 version
    );

    /**
     * @dev Emitted when metadata is encrypted
     */
    event MetadataEncrypted(
        uint256 indexed tokenId,
        bytes32 dataHash,
        string encryptionMethod
    );

    /**
     * @dev Emitted when metadata is decrypted for authorized user
     */
    event MetadataDecrypted(
        uint256 indexed tokenId,
        address indexed authorizedUser
    );

    /**
     * @dev Sets metadata for an INFT
     * @param tokenId ID of the INFT
     * @param name Name of the INFT
     * @param description Description of the INFT
     * @param encryptedDataURI URI to encrypted data
     * @param dataHash Hash of the metadata
     */
    function setMetadata(
        uint256 tokenId,
        string memory name,
        string memory description,
        string memory encryptedDataURI,
        bytes32 dataHash
    ) external;

    /**
     * @dev Updates metadata for an INFT
     * @param tokenId ID of the INFT
     * @param newMetadataURI New metadata URI
     * @param newDataHash New metadata hash
     * @return version New version number
     */
    function updateMetadata(
        uint256 tokenId,
        string memory newMetadataURI,
        bytes32 newDataHash
    ) external returns (uint256 version);

    /**
     * @dev Gets metadata for an INFT
     * @param tokenId ID of the INFT
     * @return name Name of the INFT
     * @return description Description of the INFT
     * @return encryptedDataURI URI to encrypted data
     * @return dataHash Hash of the metadata
     * @return version Version number
     */
    function getMetadata(uint256 tokenId) external view returns (
        string memory name,
        string memory description,
        string memory encryptedDataURI,
        bytes32 dataHash,
        uint256 version
    );

    /**
     * @dev Encrypts metadata for an INFT
     * @param tokenId ID of the INFT
     * @param data Data to encrypt
     * @param publicKey Public key for encryption
     * @return encryptedData Encrypted data
     * @return dataHash Hash of encrypted data
     */
    function encryptMetadata(
        uint256 tokenId,
        bytes memory data,
        bytes memory publicKey
    ) external returns (bytes memory encryptedData, bytes32 dataHash);

    /**
     * @dev Decrypts metadata for authorized user
     * @param tokenId ID of the INFT
     * @param encryptedData Encrypted data to decrypt
     * @param privateKey Private key for decryption
     * @return decryptedData Decrypted data
     */
    function decryptMetadata(
        uint256 tokenId,
        bytes memory encryptedData,
        bytes memory privateKey
    ) external view returns (bytes memory decryptedData);

    /**
     * @dev Sets an attribute for INFT metadata
     * @param tokenId ID of the INFT
     * @param key Attribute key
     * @param value Attribute value
     */
    function setAttribute(
        uint256 tokenId,
        string memory key,
        string memory value
    ) external;

    /**
     * @dev Gets an attribute from INFT metadata
     * @param tokenId ID of the INFT
     * @param key Attribute key
     * @return value Attribute value
     */
    function getAttribute(
        uint256 tokenId,
        string memory key
    ) external view returns (string memory value);

    /**
     * @dev Sets capabilities for an INFT
     * @param tokenId ID of the INFT
     * @param capabilities Array of capability strings
     */
    function setCapabilities(
        uint256 tokenId,
        string[] memory capabilities
    ) external;

    /**
     * @dev Gets capabilities of an INFT
     * @param tokenId ID of the INFT
     * @return capabilities Array of capability strings
     */
    function getCapabilities(
        uint256 tokenId
    ) external view returns (string[] memory capabilities);
}