const { ethers } = require("hardhat");
require("dotenv").config();
const {
  abi,
} = require("../artifacts/contracts/MeshNodeRareMintNFT.sol/MeshNodeRareMintNFT.json");

const mint30Rare = async (ownerAddress, meshNodeRareMintAddress) => {
  try {
    const owner = await ethers.getSigner(ownerAddress);

    const meshNodeRareMint = await ethers.getContractAt(
      abi,
      meshNodeRareMintAddress
    );

    for (let i = 0; i < 30; i++) {
      const id = await meshNodeRareMint.getTotalSupply();

      const tx = await meshNodeRareMint.connect(owner).devMint();
      await tx.wait();

      console.log(`Token ID: ${id.toString()} has been minted.`);
    }
  } catch (error) {
    console.error(error);
  }
};

const main = async () => {
  const [owner] = await ethers.getSigners();

  await mint30Rare(owner.address, "0x40954DD3B90c319CC70Cb5662b27Ce2F26dDbC8D");
};

main().catch((error) => {
  console.error(error);
});
