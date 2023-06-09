// const { ethers } = require("hardhat");
// require("dotenv").config();
// const chai = require("chai");
// const chaiAsPromised = require("chai-as-promised");
// const { BigNumber } = require("ethers");
// const { requestMerkleSecret } = require("../merkle/setMerkleTree");
// const { SECRET_PHRASE } = process.env;

// const expect = chai.expect;
// chai.use(chaiAsPromised);

// let deployer, signers, addresses;
// let stack3;
// let stack3Badges;

// const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

// const BADGES_URI = "uri/badges/";
// const POST_URI = "uri/post/";

// const INIT_TAG_COUNT = 30;
// const { hashedSecret, merkleRoot } = requestMerkleSecret(SECRET_PHRASE);
// const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");

// before(async () => {
//   [deployer, ...signers] = await ethers.getSigners();

//   addresses = signers.map((signer) => signer.address);

//   const Stack3Badges = await ethers.getContractFactory("Stack3Badges");
//   stack3Badges = await Stack3Badges.connect(deployer).deploy(
//     INIT_TAG_COUNT,
//     BADGES_URI
//   );
//   await stack3Badges.deployed();

//   const Stack3 = await ethers.getContractFactory("Stack3");
//   stack3 = await Stack3.connect(deployer).deploy(
//     stack3Badges.address,
//     INIT_TAG_COUNT,
//     merkleRoot
//   );
//   await stack3.deployed();

//   await stack3Badges.connect(deployer).setStack3Address(stack3.address);
// });

// describe(`\n\n\n========================================STACK3 BADGES========================================\n\n\nI. Question Rewards`, () => {
//   // beforeEach(async () => {});
//   const tags = [1, 2, 3, 4, 5];
//   const postQuestion_X_n = async (n) => {
//     for (let i = 0; i < n; i++) {
//       await stack3
//         .connect(signers[0])
//         .postQuestion(tags, POST_URI, hashedSecret);
//     }
//   };

//   it("1. Users SHOULD receive particular badge nft on posting 10 questions", async () => {
//     await stack3.connect(signers[0]).registerUser(BADGES_URI, hashedSecret);
//     await postQuestion_X_n(10);
//     const badgeId_10Q = await stack3Badges.QUESTION_10();
//     expect(await stack3Badges.balanceOf(addresses[0], badgeId_10Q)).to.eql(
//       BigNumber.from(1)
//     );
//   });

//   it("2. Users SHOULD receive particular badge nft on posting 25 questions", async () => {
//     await postQuestion_X_n(25 - 10 /* = 15*/);
//     const badgeId_25Q = await stack3Badges.QUESTION_25();
//     expect(await stack3Badges.balanceOf(addresses[0], badgeId_25Q)).to.eql(
//       BigNumber.from(1)
//     );
//   });

//   it("3. Users SHOULD receive particular badge nft on posting 50 questions", async () => {
//     await postQuestion_X_n(50 - 25 /* = 25*/);
//     const badgeId_50Q = await stack3Badges.QUESTION_50();
//     expect(await stack3Badges.balanceOf(addresses[0], badgeId_50Q)).to.eql(
//       BigNumber.from(1)
//     );
//   });

//   it("4. Users SHOULD receive particular badge nft on posting 100 questions", async () => {
//     await postQuestion_X_n(100 - 50 /* = 50 */);
//     const badgeId_100Q = await stack3Badges.QUESTION_100();
//     expect(await stack3Badges.balanceOf(addresses[0], badgeId_100Q)).to.eql(
//       BigNumber.from(1)
//     );
//   });
// });

// describe("Answer Rewards", () => {
//   let QID;
//   const postAnswer_X_n = async (QID, n) => {
//     for (let i = 0; i < n; i++) {
//       await stack3.connect(signers[0]).postAnswer(QID, POST_URI, hashedSecret);
//     }
//   };

//   it("1. Users SHOULD receive particular badge nft on posting 10 answers", async () => {
//     const tx = await stack3
//       .connect(signers[0])
//       .postQuestion([1, 2, 3, 4], POST_URI, hashedSecret);
//     const { events } = await tx.wait();
//     QID = events[0].args.id;
//     await postAnswer_X_n(QID, 10);
//     const badgeId_10A = await stack3Badges.ANSWER_10();
//     expect(await stack3Badges.balanceOf(addresses[0], badgeId_10A)).to.eql(
//       BigNumber.from(1)
//     );
//   });

//   it("2. Users SHOULD receive particular badge nft on posting 25 answers", async () => {
//     await postAnswer_X_n(QID, 15);
//     const badgeId_25A = await stack3Badges.ANSWER_25();
//     expect(await stack3Badges.balanceOf(addresses[0], badgeId_25A)).to.eql(
//       BigNumber.from(1)
//     );
//   });

//   it("3. Users SHOULD receive particular badge nft on posting 50 answers", async () => {
//     await postAnswer_X_n(QID, 25);
//     const badgeId_50A = await stack3Badges.ANSWER_50();
//     expect(await stack3Badges.balanceOf(addresses[0], badgeId_50A)).to.eql(
//       BigNumber.from(1)
//     );
//   });

//   it("4. Users SHOULD receive particular badge nft on posting 100 answers", async () => {
//     await postAnswer_X_n(QID, 50);
//     const badgeId_100A = await stack3Badges.ANSWER_100();
//     expect(await stack3Badges.balanceOf(addresses[0], badgeId_100A)).to.eql(
//       BigNumber.from(1)
//     );
//   });

//   it("5. Users SHOULD receive particular badge nft on posting 200 answers", async () => {
//     await postAnswer_X_n(QID, 100);
//     const badgeId_200A = await stack3Badges.ANSWER_200();
//     expect(await stack3Badges.balanceOf(addresses[0], badgeId_200A)).to.eql(
//       BigNumber.from(1)
//     );
//   });

//   it("6. Users SHOULD receive particular badge nft on posting 500 answers", async () => {
//     await postAnswer_X_n(QID, 300);
//     const badgeId_500A = await stack3Badges.ANSWER_500();
//     expect(await stack3Badges.balanceOf(addresses[0], badgeId_500A)).to.eql(
//       BigNumber.from(1)
//     );
//   });
// });
