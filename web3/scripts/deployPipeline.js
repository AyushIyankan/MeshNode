const { ethers } = require("hardhat");
require("dotenv").config();
const { requestMerkleSecret } = require("../merkle/setMerkleTree");
const { deployMeshNode, deployMeshNodeBadges } = require("./deployFunctions");

const main = async () => {
  const [deployer] = await ethers.getSigners();

  // Stack3RareMint
  // const COLLECTION_MINT_ADDRESS = /*"0x00000"*/ deployer.address;
  // const RARE_NFT_BASE_URI = "URI721/";

  // const stack3RareNft = await deployStack3RareNFT(
  //   deployer.address,
  //   1000,
  //   COLLECTION_MINT_ADDRESS,
  //   RARE_NFT_BASE_URI
  // );

  // Stack3Badges
  const BADGES_BASE_URI =
    "https://hackathon.mypinata.cloud/ipfs/QmPLtEYjGY7LfkWTi6CiWspK5MRY5cnQb2t3cimyqAVHHp/";
  const INIT_TAG_COUNT = 20;

  const meshNodeBadges = await deployMeshNodeBadges(
    deployer.address,
    INIT_TAG_COUNT,
    BADGES_BASE_URI
  );

  // Stack3
  const { merkleRoot, hashedSecret } = requestMerkleSecret(
    process.env.SECRET_PHRASE || "Stack3_Merkle_Secret_Seed_Phrase"
  );
  const meshNode = await deployMeshNode(
    deployer.address,
    meshNodeBadges.address,
    INIT_TAG_COUNT,
    merkleRoot
  );

  const tx = await meshNodeBadges
    .connect(deployer)
    .setMeshNodeAddress(meshNode.address);
  await tx.wait();
  console.log(
    "MeshNode address has been set to MeshNodeBadges contract successfully."
  );
  console.log(
    `MeshNode address from MeshNodeBadges: ${await meshNodeBadges.s_meshNodeAddress()}\n\n`
  );

  console.log(
    `Hashed Secret (bytes32) for calling MeshNode functions =====> ${hashedSecret}\n`
  );

  // await deployStack3(deployer.address, deployer.address, "BASE_URI", 0);
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => console.error(error));

//  Deploys: {
//   1:
// }
