const { ethers } = require("hardhat");
require("dotenv").config();
// const { requestMerkleSecret } = require("../merkle/setMerkleTree");

const deployMeshNodeRareNFT = async (
  deployerAddress,
  maxSupply,
  collectionMintAddress,
  baseUri
) => {
  const deployer = await ethers.getSigner(deployerAddress);

  const MeshNodeRareMintNFT = await ethers.getContractFactory(
    "MeshNodeRareMintNFT"
  );

  const meshNodeRareMintNft = await MeshNodeRareMintNFT.connect(
    deployer
  ).deploy(maxSupply, collectionMintAddress, baseUri);

  await meshNodeRareMintNft.deployed();

  console.log(
    `MeshNodeRareMintNFT contract has been deployed at address: ${meshNodeRareMintNft.address}\n`
  );

  return meshNodeRareMintNft;
};

const deployMeshNodeBadges = async (deployerAddress, maxTagCount, baseUri) => {
  const deployer = await ethers.getSigner(deployerAddress);

  const MeshNodeBadges = await ethers.getContractFactory("MeshNodeBadges");

  const meshNodeBadges = await MeshNodeBadges.connect(deployer).deploy(
    maxTagCount,
    baseUri
  );

  await meshNodeBadges.deployed();

  console.log(
    `MeshNodeBadges contract has been deployed at address: ${meshNodeBadges.address}\n`
  );

  return meshNodeBadges;
};

const deployMeshNode = async (
  deployerAddress,
  meshNodeBadgesAddress,
  initTagCount,
  merkleRoot
) => {
  const deployer = await ethers.getSigner(deployerAddress);

  const MeshNode = await ethers.getContractFactory("MeshNode");

  const meshNode = await MeshNode.connect(deployer).deploy(
    meshNodeBadgesAddress,
    initTagCount,
    merkleRoot
  );

  await meshNode.deployed();

  console.log(
    `MeshNode contract has been deployed at address: ${meshNode.address}\n`
  );

  return meshNode;
};

const deployMeshNodeAutomation = async (
  deployerAddress,
  vrfCoordinatorV2,
  subId,
  gasLane,
  callbackGasLimit,
  dropInterval,
  maxSupply,
  rareNftAddress,
  meshNodeAddress
) => {
  const deployer = await ethers.getSigner(deployerAddress);

  const MeshNodeAutomation = await ethers.getContractFactory(
    "MeshNodeAutomation"
  );

  const meshNodeAutomation = await MeshNodeAutomation.connect(deployer).deploy(
    vrfCoordinatorV2,
    subId,
    gasLane,
    callbackGasLimit,
    dropInterval,
    maxSupply,
    rareNftAddress,
    meshNodeAddress
  );

  await meshNodeAutomation.deployed();

  console.log(
    `MeshNodeAutomation contract has been deployed at address: ${meshNodeAutomation.address}\n\n`
  );

  return meshNodeAutomation;
};

module.exports = {
  deployMeshNode,
  deployMeshNodeBadges,
  deployMeshNodeRareNFT,
  deployMeshNodeAutomation,
};
