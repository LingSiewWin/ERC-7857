const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("INFT Contract", function () {
  let inft, mockOracle, owner, user1, user2;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy MockOracle
    const MockOracle = await ethers.getContractFactory("MockOracle");
    mockOracle = await MockOracle.deploy();
    await mockOracle.waitForDeployment();

    // Deploy INFT contract
    const INFT = await ethers.getContractFactory("INFT");
    inft = await INFT.deploy("AI Agent NFTs", "AINFT", await mockOracle.getAddress());
    await inft.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await inft.name()).to.equal("AI Agent NFTs");
      expect(await inft.symbol()).to.equal("AINFT");
    });

    it("Should set the correct data verifier", async function () {
      expect(await inft.dataVerifier()).to.equal(await mockOracle.getAddress());
    });

    it("Should set the deployer as owner", async function () {
      expect(await inft.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    const metadataURI = "ipfs://QmTestHash";
    const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("test metadata"));

    it("Should mint INFT successfully", async function () {
      await expect(inft.mint(user1.address, metadataURI, metadataHash))
        .to.emit(inft, "INFTMinted")
        .withArgs(0, owner.address, metadataURI, metadataHash);

      expect(await inft.ownerOf(0)).to.equal(user1.address);
      expect(await inft.tokenURI(0)).to.equal(metadataURI);
      expect(await inft.metadataHash(0)).to.equal(metadataHash);
    });

    it("Should track creator separately from owner", async function () {
      await inft.mint(user1.address, metadataURI, metadataHash);
      
      expect(await inft.ownerOf(0)).to.equal(user1.address);
      expect(await inft.creatorOf(0)).to.equal(owner.address);
    });

    it("Should increment token ID", async function () {
      await inft.mint(user1.address, metadataURI, metadataHash);
      await inft.mint(user2.address, metadataURI + "2", metadataHash);
      
      expect(await inft.ownerOf(0)).to.equal(user1.address);
      expect(await inft.ownerOf(1)).to.equal(user2.address);
    });

    it("Should fail with invalid recipient", async function () {
      await expect(inft.mint(ethers.ZeroAddress, metadataURI, metadataHash))
        .to.be.revertedWith("Invalid recipient");
    });

    it("Should fail with empty metadata URI", async function () {
      await expect(inft.mint(user1.address, "", metadataHash))
        .to.be.revertedWith("Invalid metadata URI");
    });

    it("Should fail with zero metadata hash", async function () {
      await expect(inft.mint(user1.address, metadataURI, ethers.ZeroHash))
        .to.be.revertedWith("Invalid metadata hash");
    });
  });

  describe("Transfer with Proof", function () {
    let tokenId;
    const metadataURI = "ipfs://QmTestHash";
    const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("test metadata"));

    beforeEach(async function () {
      await inft.mint(user1.address, metadataURI, metadataHash);
      tokenId = 0;
    });

    it("Should transfer with valid proof", async function () {
      // Generate transfer proof using MockOracle
      const transferProof = await mockOracle.createTransferProof(
        metadataHash,
        ethers.keccak256(ethers.toUtf8Bytes("new metadata")),
        user1.address,
        user2.address
      );

      await expect(
        inft.connect(user1)["safeTransferFrom(address,address,uint256,bytes)"](
          user1.address,
          user2.address,
          tokenId,
          transferProof
        )
      )
        .to.emit(inft, "INFTTransferred")
        .withArgs(tokenId, user1.address, user2.address, transferProof);

      expect(await inft.ownerOf(tokenId)).to.equal(user2.address);
    });

    it("Should fail when not owner", async function () {
      const transferProof = await mockOracle.createTransferProof(
        metadataHash,
        ethers.keccak256(ethers.toUtf8Bytes("new metadata")),
        user1.address,
        user2.address
      );

      await expect(
        inft.connect(user2)["safeTransferFrom(address,address,uint256,bytes)"](
          user1.address,
          user2.address,
          tokenId,
          transferProof
        )
      ).to.be.revertedWith("ERC721: caller is not token owner or approved");
    });

    it("Should fail with invalid recipient", async function () {
      const transferProof = await mockOracle.createTransferProof(
        metadataHash,
        ethers.keccak256(ethers.toUtf8Bytes("new metadata")),
        user1.address,
        ethers.ZeroAddress
      );

      await expect(
        inft.connect(user1)["safeTransferFrom(address,address,uint256,bytes)"](
          user1.address,
          ethers.ZeroAddress,
          tokenId,
          transferProof
        )
      ).to.be.revertedWith("Invalid recipient");
    });
  });

  describe("Cloning", function () {
    let tokenId;
    const metadataURI = "ipfs://QmTestHash";
    const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("test metadata"));

    beforeEach(async function () {
      await inft.mint(user1.address, metadataURI, metadataHash);
      tokenId = 0;
    });

    it("Should clone INFT by owner", async function () {
      await expect(inft.connect(user1).clone(tokenId, user2.address))
        .to.emit(inft, "INFTCloned")
        .withArgs(tokenId, 1, user1.address);

      expect(await inft.ownerOf(1)).to.equal(user2.address);
      expect(await inft.tokenURI(1)).to.equal(metadataURI);
      expect(await inft.metadataHash(1)).to.equal(metadataHash);
    });

    it("Should clone INFT by authorized user", async function () {
      // Authorize user2
      await inft.connect(user1).authorizeUsage(tokenId, user2.address, 3600);

      await expect(inft.connect(user2).clone(tokenId, user2.address))
        .to.emit(inft, "INFTCloned")
        .withArgs(tokenId, 1, user2.address);

      expect(await inft.ownerOf(1)).to.equal(user2.address);
    });

    it("Should fail when not authorized", async function () {
      await expect(inft.connect(user2).clone(tokenId, user2.address))
        .to.be.revertedWith("Not authorized to clone");
    });

    it("Should fail with invalid recipient", async function () {
      await expect(inft.connect(user1).clone(tokenId, ethers.ZeroAddress))
        .to.be.revertedWith("Invalid recipient");
    });
  });

  describe("Authorization", function () {
    let tokenId;
    const metadataURI = "ipfs://QmTestHash";
    const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("test metadata"));

    beforeEach(async function () {
      await inft.mint(user1.address, metadataURI, metadataHash);
      tokenId = 0;
    });

    it("Should authorize user usage", async function () {
      const duration = 3600; // 1 hour
      
      await expect(inft.connect(user1).authorizeUsage(tokenId, user2.address, duration))
        .to.emit(inft, "UsageAuthorized")
        .withArgs(tokenId, user2.address, await ethers.provider.getBlock('latest').then(b => b.timestamp + duration + 1));

      expect(await inft.isAuthorized(tokenId, user2.address)).to.be.true;
    });

    it("Should check owner is always authorized", async function () {
      expect(await inft.isAuthorized(tokenId, user1.address)).to.be.true;
    });

    it("Should fail when not owner", async function () {
      await expect(inft.connect(user2).authorizeUsage(tokenId, user2.address, 3600))
        .to.be.revertedWith("Not token owner");
    });

    it("Should fail with invalid user", async function () {
      await expect(inft.connect(user1).authorizeUsage(tokenId, ethers.ZeroAddress, 3600))
        .to.be.revertedWith("Invalid user");
    });

    it("Should fail with zero duration", async function () {
      await expect(inft.connect(user1).authorizeUsage(tokenId, user2.address, 0))
        .to.be.revertedWith("Invalid duration");
    });
  });

  describe("Metadata Update", function () {
    let tokenId;
    const metadataURI = "ipfs://QmTestHash";
    const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("test metadata"));

    beforeEach(async function () {
      await inft.mint(user1.address, metadataURI, metadataHash);
      tokenId = 0;
    });

    it("Should update metadata with valid proof", async function () {
      const newMetadataURI = "ipfs://QmNewTestHash";
      const newMetadataHash = ethers.keccak256(ethers.toUtf8Bytes("new test metadata"));
      
      const updateProof = await mockOracle.generateOwnershipProof(newMetadataHash, user1.address);

      await expect(
        inft.connect(user1).updateMetadata(tokenId, newMetadataURI, newMetadataHash, updateProof)
      )
        .to.emit(inft, "INFTUpdated")
        .withArgs(tokenId, metadataURI, newMetadataURI, newMetadataHash);

      expect(await inft.tokenURI(tokenId)).to.equal(newMetadataURI);
      expect(await inft.metadataHash(tokenId)).to.equal(newMetadataHash);
    });

    it("Should fail when not owner", async function () {
      const newMetadataURI = "ipfs://QmNewTestHash";
      const newMetadataHash = ethers.keccak256(ethers.toUtf8Bytes("new test metadata"));
      const updateProof = await mockOracle.generateOwnershipProof(newMetadataHash, user2.address);

      await expect(
        inft.connect(user2).updateMetadata(tokenId, newMetadataURI, newMetadataHash, updateProof)
      ).to.be.revertedWith("Not token owner");
    });
  });

  describe("Public/Private Status", function () {
    let tokenId;
    const metadataURI = "ipfs://QmTestHash";
    const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("test metadata"));

    beforeEach(async function () {
      await inft.mint(user1.address, metadataURI, metadataHash);
      tokenId = 0;
    });

    it("Should make INFT public", async function () {
      await inft.connect(user1).makePublic(tokenId);
      
      const inftData = await inft.getINFTData(tokenId);
      expect(inftData[5]).to.be.true; // isPublic
      
      // Public INFTs should authorize anyone
      expect(await inft.isAuthorized(tokenId, user2.address)).to.be.true;
    });

    it("Should make INFT private", async function () {
      await inft.connect(user1).makePublic(tokenId);
      await inft.connect(user1).makePrivate(tokenId);
      
      const inftData = await inft.getINFTData(tokenId);
      expect(inftData[5]).to.be.false; // isPublic
      
      // Private INFTs should not authorize non-owners
      expect(await inft.isAuthorized(tokenId, user2.address)).to.be.false;
    });

    it("Should fail when not owner", async function () {
      await expect(inft.connect(user2).makePublic(tokenId))
        .to.be.revertedWith("Not token owner");
        
      await expect(inft.connect(user2).makePrivate(tokenId))
        .to.be.revertedWith("Not token owner");
    });
  });

  describe("View Functions", function () {
    let tokenId;
    const metadataURI = "ipfs://QmTestHash";
    const metadataHash = ethers.keccak256(ethers.toUtf8Bytes("test metadata"));

    beforeEach(async function () {
      await inft.mint(user1.address, metadataURI, metadataHash);
      tokenId = 0;
    });

    it("Should return correct INFT data", async function () {
      const inftData = await inft.getINFTData(tokenId);
      
      expect(inftData[0]).to.equal(metadataURI); // encryptedMetadataURI
      expect(inftData[1]).to.equal(metadataHash); // metadataHash
      expect(inftData[2]).to.equal(owner.address); // creator
      expect(inftData[5]).to.be.false; // isPublic
    });

    it("Should return correct creator", async function () {
      expect(await inft.creatorOf(tokenId)).to.equal(owner.address);
    });

    it("Should fail for non-existent token", async function () {
      await expect(inft.getINFTData(999))
        .to.be.revertedWith("Token does not exist");
        
      await expect(inft.creatorOf(999))
        .to.be.revertedWith("Token does not exist");
        
      await expect(inft.metadataHash(999))
        .to.be.revertedWith("Token does not exist");
    });
  });
});