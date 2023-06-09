// https://medium.com/@ItsCuzzo/using-merkle-trees-for-nft-whitelists-523b58ada3f9
//
// 1. Import libraries. Use `npm` package manager to install
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
require("dotenv").config();
const { SECRET_PHRASE } = process.env;

const merkleDemo = () => {
  // 2. Collect list of wallet addresses from competition, raffle, etc.
  // Store list of addresses in some data sheeet (Google Sheets or Excel)
  let secret = [SECRET_PHRASE || "secret-test-1"];
  let hashedSecret = [keccak256(secret[0])];
  console.log(`\nHashed secret: 0x${hashedSecret[0].toString("hex")}\n`);

  // 3. Create a new array of `leafNodes` by hashing all indexes of the `whitelistAddresses`
  // using `keccak256`. Then creates a Merkle Tree object using keccak256 as the algorithm.
  //
  // The leaves, merkleTree, and rootHas are all PRE-DETERMINED prior to whitelist claim
  const leafNodes = hashedSecret.map((secret) => keccak256(secret));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

  // 4. Get root hash of the `merkleeTree` in hexadecimal format (0x)
  // Print out the Entire Merkle Tree.
  const rootHash = merkleTree.getRoot();
  console.log("Secret Merkle Tree\n", merkleTree.toString(), "\n");
  console.log(`Root Hash: 0x${rootHash.toString("hex")}\n`);

  // ***** ***** ***** ***** ***** ***** ***** ***** //

  // CLIENT-SIDE: Use `msg.sender` address to query and API that returns the merkle proof
  // required to derive the root hash of the Merkle Tree

  // ✅ Positive verification of address
  const passedTerm = "not-secret";
  // ❌ Change this address to get a `false` verification
  // const claimingAddress = keccak256("0X5B38DA6A701C568545DCFCB03FCB875F56BEDDD6");

  // `getHexProof` returns the neighbour leaf and all parent nodes hashes that will
  // be required to derive the Merkle Trees root hash.
  const hexProof = merkleTree.getHexProof(leafNodes[0]);
  console.log("Hex Proof:", hexProof, "\n");
  console.log(`Leaf: 0x${leafNodes[0].toString("hex")}\n`);

  // ✅ - ❌: Verify is claiming address is in the merkle tree or not.
  // This would be implemented in your Solidity Smart Contract
  console.log(merkleTree.verify(hexProof, leafNodes[0], rootHash));
};

const requestMerkleSecret = (secretPhrase) => {
  const hashedSecret = keccak256(secretPhrase);
  const leaf = keccak256(hashedSecret);

  const merkleTree = new MerkleTree([leaf], keccak256, { sortPairs: true });

  return {
    hashedSecret: `0x${hashedSecret.toString("hex")}`,
    merkleRoot: `0x${merkleTree.getRoot().toString("hex")}`,
    merkleProof: merkleTree.getHexProof(leaf),
  };
};

const main = () => {
  try {
    merkleDemo();
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

// main();

module.exports = {
  requestMerkleSecret,
};

// Root: 0x10a4b01d43aa1d4cf8633a601fd0a75d90d3a1f9b7609ff93dcff8422430591d
// Hashed Secret: 0x88df465d8a38374712a6784d60d6a43b5c67886b0e93c592d4517a8a8360c5d6
