// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IERC7857DataVerifier
 * @dev Interface for data verification in ERC-7857 INFTs
 */
interface IERC7857DataVerifier {
    /**
     * @dev Structure for ownership proof output
     */
    struct OwnershipProofOutput {
        bytes32[] dataHashes;
        address owner;
        bool isValid;
        uint256 timestamp;
    }

    /**
     * @dev Structure for transfer validity proof output
     */
    struct TransferValidityProofOutput {
        bytes32[] oldDataHashes;
        bytes32[] newDataHashes;
        address from;
        address to;
        bytes pubKey;
        bytes sealedKey;
        bool isValid;
        uint256 timestamp;
    }

    /**
     * @dev Structure for data integrity proof
     */
    struct DataIntegrityProof {
        bytes32 dataHash;
        bytes signature;
        address signer;
        uint256 timestamp;
        bool isValid;
    }

    /**
     * @dev Emitted when ownership is verified
     */
    event OwnershipVerified(
        address indexed owner,
        bytes32 indexed dataHash,
        bool isValid
    );

    /**
     * @dev Emitted when transfer validity is verified
     */
    event TransferValidityVerified(
        address indexed from,
        address indexed to,
        bytes32 oldDataHash,
        bytes32 newDataHash,
        bool isValid
    );

    /**
     * @dev Emitted when data integrity is verified
     */
    event DataIntegrityVerified(
        bytes32 indexed dataHash,
        address indexed verifier,
        bool isValid
    );

    /**
     * @dev Verifies ownership of data
     * @param proof The ownership proof to verify
     * @return output The verification output
     */
    function verifyOwnership(
        bytes calldata proof
    ) external view returns (OwnershipProofOutput memory output);

    /**
     * @dev Verifies validity of a transfer
     * @param proof The transfer validity proof to verify
     * @return output The verification output
     */
    function verifyTransferValidity(
        bytes calldata proof
    ) external view returns (TransferValidityProofOutput memory output);

    /**
     * @dev Verifies data integrity
     * @param dataHash Hash of the data to verify
     * @param proof Integrity proof
     * @return isValid True if data integrity is verified
     */
    function verifyDataIntegrity(
        bytes32 dataHash,
        bytes calldata proof
    ) external view returns (bool isValid);

    /**
     * @dev Generates a proof for data ownership
     * @param dataHash Hash of the data
     * @param owner Address of the owner
     * @return proof The generated ownership proof
     */
    function generateOwnershipProof(
        bytes32 dataHash,
        address owner
    ) external view returns (bytes memory proof);

    /**
     * @dev Validates TEE attestation
     * @param attestation TEE attestation data
     * @return isValid True if attestation is valid
     */
    function validateTEEAttestation(
        bytes calldata attestation
    ) external view returns (bool isValid);

    /**
     * @dev Checks if a nonce has been used
     * @param nonce The nonce to check
     * @return used True if nonce has been used
     */
    function isNonceUsed(bytes32 nonce) external view returns (bool used);
}