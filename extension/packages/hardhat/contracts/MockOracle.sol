// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IERC7857DataVerifier.sol";

/**
 * @title MockOracle
 * @dev Mock implementation of TEE verification for testing purposes
 */
contract MockOracle is IERC7857DataVerifier {
    mapping(bytes32 => bool) private _usedNonces;
    mapping(bytes32 => DataIntegrityProof) private _integrityProofs;

    event MockProofVerified(bytes32 indexed proofHash, bool isValid);

    /**
     * @dev Simulates TEE verification - always returns true for testing
     */
    function verifyProof(bytes calldata proof) external pure returns (bool) {
        require(proof.length > 0, "Proof cannot be empty");
        return true;
    }

    /**
     * @dev Verifies ownership of data
     */
    function verifyOwnership(
        bytes calldata proof
    ) external view override returns (OwnershipProofOutput memory) {
        require(proof.length > 0, "Invalid proof");

        // Decode the proof (simplified for mock)
        (
            bytes32[] memory dataHashes,
            address owner,
            bytes32 nonce
        ) = abi.decode(proof, (bytes32[], address, bytes32));

        require(!_usedNonces[nonce], "Nonce already used");
        require(dataHashes.length > 0, "No data hashes provided");
        require(owner != address(0), "Invalid owner address");

        return OwnershipProofOutput({
            dataHashes: dataHashes,
            owner: owner,
            isValid: true,
            timestamp: block.timestamp
        });
    }

    /**
     * @dev Verifies validity of a transfer
     */
    function verifyTransferValidity(
        bytes calldata proof
    ) external view override returns (TransferValidityProofOutput memory) {
        require(proof.length > 0, "Invalid proof");

        // Decode the proof (simplified for mock)
        (
            bytes32[] memory oldDataHashes,
            bytes32[] memory newDataHashes,
            address from,
            address to,
            bytes memory pubKey,
            bytes memory sealedKey,
            bytes32 nonce
        ) = abi.decode(
            proof,
            (bytes32[], bytes32[], address, address, bytes, bytes, bytes32)
        );

        require(!_usedNonces[nonce], "Nonce already used");
        require(oldDataHashes.length > 0, "No old data hashes");
        require(newDataHashes.length > 0, "No new data hashes");
        require(from != address(0), "Invalid from address");
        require(to != address(0), "Invalid to address");

        return TransferValidityProofOutput({
            oldDataHashes: oldDataHashes,
            newDataHashes: newDataHashes,
            from: from,
            to: to,
            pubKey: pubKey,
            sealedKey: sealedKey,
            isValid: true,
            timestamp: block.timestamp
        });
    }

    /**
     * @dev Verifies data integrity
     */
    function verifyDataIntegrity(
        bytes32 dataHash,
        bytes calldata proof
    ) external view override returns (bool isValid) {
        require(dataHash != bytes32(0), "Invalid data hash");
        require(proof.length > 0, "Invalid proof");

        // Simplified verification for mock
        DataIntegrityProof memory integrityProof = _integrityProofs[dataHash];
        return integrityProof.isValid && integrityProof.dataHash == dataHash;
    }

    /**
     * @dev Generates a proof for data ownership
     */
    function generateOwnershipProof(
        bytes32 dataHash,
        address owner
    ) external view override returns (bytes memory proof) {
        require(dataHash != bytes32(0), "Invalid data hash");
        require(owner != address(0), "Invalid owner address");

        // Generate a unique nonce
        bytes32 nonce = keccak256(abi.encodePacked(block.timestamp, dataHash, owner));

        // Create simplified proof
        bytes32[] memory dataHashes = new bytes32[](1);
        dataHashes[0] = dataHash;

        proof = abi.encode(dataHashes, owner, nonce);
    }

    /**
     * @dev Validates TEE attestation (mock always returns true)
     */
    function validateTEEAttestation(
        bytes calldata attestation
    ) external pure override returns (bool isValid) {
        require(attestation.length > 0, "Invalid attestation");
        return true;
    }

    /**
     * @dev Checks if a nonce has been used
     */
    function isNonceUsed(bytes32 nonce) external view override returns (bool used) {
        return _usedNonces[nonce];
    }

    /**
     * @dev Mock function to mark a nonce as used (for testing)
     */
    function markNonceUsed(bytes32 nonce) external {
        _usedNonces[nonce] = true;
    }

    /**
     * @dev Mock function to create a transfer proof (for testing)
     */
    function createTransferProof(
        bytes32 oldDataHash,
        bytes32 newDataHash,
        address from,
        address to
    ) external view returns (bytes memory proof) {
        bytes32[] memory oldHashes = new bytes32[](1);
        oldHashes[0] = oldDataHash;

        bytes32[] memory newHashes = new bytes32[](1);
        newHashes[0] = newDataHash;

        bytes memory pubKey = abi.encodePacked(to);
        bytes memory sealedKey = abi.encodePacked(keccak256(abi.encodePacked(oldDataHash, newDataHash)));
        bytes32 nonce = keccak256(abi.encodePacked(block.timestamp, from, to));

        proof = abi.encode(
            oldHashes,
            newHashes,
            from,
            to,
            pubKey,
            sealedKey,
            nonce
        );
    }

    /**
     * @dev Mock function to store integrity proof (for testing)
     */
    function storeIntegrityProof(
        bytes32 dataHash,
        bytes memory signature,
        address signer
    ) external {
        _integrityProofs[dataHash] = DataIntegrityProof({
            dataHash: dataHash,
            signature: signature,
            signer: signer,
            timestamp: block.timestamp,
            isValid: true
        });
    }
}