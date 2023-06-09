const { ethers } = require("hardhat");
require("dotenv").config();
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const { BigNumber } = require("ethers");
const { requestMerkleSecret } = require("../merkle/setMerkleTree");
const { SECRET_PHRASE } = process.env;

const expect = chai.expect;
chai.use(chaiAsPromised);

let deployer, signers, addresses;
let stack3;
let stack3Badges;

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

const POST_URI = "uri/post/";
const BADGES_URI = "uri/badge/";

const INIT_TAG_COUNT = 30;
const { hashedSecret, merkleRoot } = requestMerkleSecret(SECRET_PHRASE);
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");

before(async () => {
  [deployer, ...signers] = await ethers.getSigners();

  addresses = signers.map((signer) => signer.address);

  const Stack3Badges = await ethers.getContractFactory("Stack3Badges");
  stack3Badges = await Stack3Badges.connect(deployer).deploy(
    INIT_TAG_COUNT,
    BADGES_URI
  );
  await stack3Badges.deployed();

  const Stack3 = await ethers.getContractFactory("Stack3");
  stack3 = await Stack3.connect(deployer).deploy(
    stack3Badges.address,
    INIT_TAG_COUNT,
    merkleRoot
  );
  await stack3.deployed();

  await stack3Badges.connect(deployer).setStack3Address(stack3.address);
});

describe("========================================STACK3========================================\n\n\nI. Registering User", () => {
  //   beforeEach(async () => {});
  let UID;

  it("1. Addresses SHOULD be able to register themselves as users", async () => {
    const tx = await expect(
      stack3.connect(signers[0]).registerUser(POST_URI, hashedSecret)
    ).to.eventually.be.fulfilled;
    const { events } = await tx.wait();
    UID = events[1].args.id;
  });

  it("2. Custom `NewUser` event SHOULD be emitted on successful user registration", async () => {
    const tx = await stack3
      .connect(signers[2])
      .registerUser(POST_URI, hashedSecret);
    const { events } = await tx.wait();
    // console.log(stack3.filters.NewUser());
    expect(events[1].eventSignature).to.equal(
      "NewUser(uint256,uint256,address)"
    );
  });

  it("3. Registered User struct SHOULD have reqd params set to initial values", async () => {
    const {
      id,
      bestAnswerCount,
      qUpvotes,
      aUpvotes,
      userAddress,
      questions,
      answers,
      comments,
      uri,
    } = await stack3.getUserByAddress(addresses[0]);

    expect(id).to.eql(UID);
    expect(bestAnswerCount).to.eql(BigNumber.from(0));
    expect(qUpvotes).to.eql(BigNumber.from(0));
    expect(aUpvotes).to.eql(BigNumber.from(0));
    expect(userAddress).to.equal(addresses[0]);
    expect(questions).to.eql([]);
    expect(answers).to.eql([]);
    expect(comments).to.eql([]);
    expect(uri).to.equal(POST_URI);
  });

  it("4. Addresses SHOULD receive a User Badge NFT after sucessful registration.", async () => {
    const userBadgeTokenId = await stack3Badges.USER();
    expect(await stack3Badges.balanceOf(addresses[0], userBadgeTokenId)).to.eql(
      BigNumber.from(1)
    );
  });

  it("5. Addresses already registered as User SHOULD NOT be able to call.", async () => {
    await expect(
      stack3.connect(signers[0]).registerUser(POST_URI, hashedSecret)
    ).to.eventually.be.rejectedWith("Stack3: User already registered");
  });

  it("6. Function SHOULD NOT execute if invalid secret is passed", async () => {
    const { hashedSecret: invalidSecret } =
      requestMerkleSecret("NOT-VALID-PHRASE");
    await expect(
      stack3.connect(signers[0]).registerUser(POST_URI, invalidSecret)
    ).to.eventually.be.rejectedWith("Stack3: Unverified source of call");
  });
});

describe("II. Posting questions", () => {
  const tagsParam = [1, 5, 7, 8, 3, 9].map((tag) => BigNumber.from(tag));
  beforeEach(async () => {
    // await stack3.connect(signers[0]).registerUser(hashedSecret);
  });

  it("1. Registered users SHOULD be able to post Questions.", async () => {
    await expect(
      stack3.connect(signers[0]).postQuestion(tagsParam, POST_URI, hashedSecret)
    ).to.eventually.be.fulfilled;
  });

  it("2. Custom `NewQuestion` event SHOULD be emitted on successful postQuestion call", async () => {
    const tx = await stack3
      .connect(signers[0])
      .postQuestion(tagsParam, POST_URI, hashedSecret);
    const { events } = await tx.wait();
    // console.log(stack3.filters.NewUser());
    expect(events[0].eventSignature).to.equal(
      "NewQuestion(uint256,uint256,address)"
    );
  });

  it("3. Question authors User state SHOULD be updated accordingly", async () => {
    const { questions } = await stack3.getUserByAddress(addresses[0]);
    const newQID = questions[questions.length - 1];
    expect(questions.length).to.equal(2);
    expect(newQID).to.eql((await stack3.getTotalCounts())[1]);
  });

  it("4. A Question struct SHOULD have reqd params set to initial values", async () => {
    const { questions } = await stack3.getUserByAddress(addresses[0]);
    const newQID = questions[questions.length - 1];
    // console.log(newQID);

    const {
      bestAnswerChosen,
      id,
      upvotes,
      downvotes,
      author,
      tags,
      comments,
      answers,
      uri,
    } = await stack3.getQuestionById(newQID);

    expect(bestAnswerChosen).to.equal(false);
    expect(id).to.eql(newQID);
    expect(upvotes).to.eql(BigNumber.from(0));
    expect(downvotes).to.eql(BigNumber.from(0));
    expect(author).to.equal(addresses[0]);
    expect(tags).to.eql(tagsParam);
    expect(comments).to.eql([]);
    expect(answers).to.eql([]);
    expect(uri).to.equal(POST_URI);
  });

  it("5. Unregistered addresses SHOULD NOT be able to call the function", async () => {
    await expect(
      stack3.connect(signers[1]).postQuestion(tagsParam, POST_URI, hashedSecret)
    ).to.eventually.be.rejectedWith("Stack3: User not registered");
  });

  it("6. Users SHOULD NOT be able to pass more than 10 tags per question.", async () => {
    const gt10Tags = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    await expect(
      stack3.connect(signers[0]).postQuestion(gt10Tags, POST_URI, hashedSecret)
    ).to.eventually.be.rejectedWith("Stack3: Max tag count is 10");
  });

  it("7. Function SHOULD NOT execute if invalid secret is passed", async () => {
    const { hashedSecret: invalidSecret } =
      requestMerkleSecret("NOT-VALID-PHRASE");
    await expect(
      stack3
        .connect(signers[0])
        .postQuestion(tagsParam, POST_URI, invalidSecret)
    ).to.eventually.be.rejectedWith("Stack3: Unverified source of call");
  });
});

describe("III. Vote on question", () => {
  const tagsParam = [1, 5, 7, 8, 3, 9].map((tag) => BigNumber.from(tag));
  let QID;
  beforeEach(async () => {
    stack3.connect(signers[0]).registerUser(POST_URI, hashedSecret);

    stack3.connect(signers[1]).registerUser(POST_URI, hashedSecret);
    stack3.connect(signers[2]).registerUser(POST_URI, hashedSecret);

    stack3.connect(signers[0]).postQuestion(tagsParam, POST_URI, hashedSecret);
    const { questions } = await stack3.getUserByAddress(addresses[0]);
    QID = questions[questions.length - 1];
  });

  const up1down1 = async (qId) => {
    await stack3.connect(signers[1]).voteQuestion(qId, 1, hashedSecret);
    await stack3.connect(signers[2]).voteQuestion(qId, -1, hashedSecret);
  };

  it("1. A User SHOULD be able upvote or downvote a question", async () => {
    await expect(stack3.connect(signers[1]).voteQuestion(QID, 1, hashedSecret))
      .to.eventually.be.fulfilled;
    await expect(stack3.connect(signers[2]).voteQuestion(QID, -1, hashedSecret))
      .to.eventually.be.fulfilled;
  });

  it("2. Custom `NewVote` event SHOULD be emitted on successful `voteQuestion` call", async () => {
    const tx = await stack3
      .connect(signers[1])
      .voteQuestion(QID, -1, hashedSecret);
    const { events } = await tx.wait();
    // console.log(events[0]);
    expect(events[0].eventSignature).to.equal(
      "NewVote(uint8,uint256,int8,address)"
    );
  });

  it("3. Upvotes and downvote count SHOULD be reflected in Question struct", async () => {
    await up1down1(QID);
    // console.log(await stack3.getQuestionById(QID));
    const { upvotes, downvotes } = await stack3.getQuestionById(QID);
    expect(upvotes).to.eql(BigNumber.from(1));
    expect(downvotes).to.eql(BigNumber.from(1));
  });

  it("4. Upvotes count SHOULD be reflected in `author` User struct", async () => {
    const { author } = await stack3.getQuestionById(QID);
    const { qUpvotes: qUpInit } = await stack3.getUserByAddress(author);

    await up1down1(QID);

    const { qUpvotes: qUpFinal } = await stack3.getUserByAddress(author);

    expect(qUpFinal).to.eql(qUpInit.add(1));
  });

  it("5. Unregistered addresses SHOULD NOT be able to call the function", async () => {
    await expect(
      stack3.connect(signers[3]).voteQuestion(QID, 1, hashedSecret)
    ).to.eventually.be.rejectedWith("Stack3: User not registered");
  });

  it("6. Function SHOULD NOT execute for invalid `questionId` param passed", async () => {
    await expect(
      stack3.connect(signers[1]).voteQuestion(QID.add(200), -2, hashedSecret)
    ).to.eventually.be.rejectedWith("Stack3: Invalid question id");
  });

  it("7. Function SHOULD NOT execute for invalid `voteMarker (1 or -1)` param passed", async () => {
    await expect(
      stack3.connect(signers[1]).voteQuestion(QID, -2, hashedSecret)
    ).to.eventually.be.rejectedWith("Stack3: Invalid vote param");
  });

  it("8. User SHOULD NOT be able to call function more than once per QID", async () => {
    await up1down1(QID);

    await expect(
      stack3.connect(signers[1]).voteQuestion(QID, 1, hashedSecret)
    ).to.eventually.be.rejectedWith("Stack3: User has voted");
  });

  it("9. Function SHOULD NOT execute if invalid secret is passed", async () => {
    const { hashedSecret: invalidSecret } =
      requestMerkleSecret("NOT-VALID-PHRASE");
    await expect(
      stack3.connect(signers[0]).voteQuestion(QID, 1, invalidSecret)
    ).to.eventually.be.rejectedWith("Stack3: Unverified source of call");
  });
});

describe("IV. Posting answers", () => {
  let QID;
  beforeEach(async () => {
    // stack3.connect(signers[0]).registerUser(hashedSecret);

    // stack3.connect(signers[1]).registerUser(hashedSecret);
    // stack3.connect(signers[2]).registerUser(hashedSecret);

    // const tagsParam = [1, 2, 3, 4, 5];

    // await stack3.connect(signers[0]).postQuestion(tagsParam, hashedSecret);
    const { questions } = await stack3.getUserByAddress(addresses[0]);
    QID = questions[questions.length - 1];
  });

  const postAnswer = async (QID) => {
    await stack3.connect(signers[1]).postAnswer(QID, POST_URI, hashedSecret);
    const { answers } = await stack3.getUserByAddress(addresses[1]);
    const AID = answers[answers.length - 1];
    return AID;
  };

  it("1. Registered User SHOULD be able to postAnswers to any Question", async () => {
    await expect(
      stack3.connect(signers[1]).postAnswer(QID, POST_URI, hashedSecret)
    ).to.eventually.be.fulfilled;
  });

  it("2. Custom `NewAnswer` event SHOULD be emitted on successful `postAnswer` call", async () => {
    const tx = await stack3
      .connect(signers[1])
      .postAnswer(QID, POST_URI, hashedSecret);
    const { events } = await tx.wait();
    expect(events[0].eventSignature).to.equal(
      "NewAnswer(uint256,uint256,uint256,address)"
    );
  });

  it("3. Answer struct must have reqd params set to init values", async () => {
    const AID = await postAnswer(QID);

    const { isBestAnswer, id, qid, upvotes, downvotes, author, comments } =
      await stack3.getAnswerById(AID);

    // console.log(isBestAnswer, id, qid, upvotes, downvotes, author, comments);

    expect(isBestAnswer).to.equal(false);
    expect(id).to.eql(AID);
    expect(qid).to.eql(QID);
    expect(upvotes).to.eql(BigNumber.from(0));
    expect(downvotes).to.eql(BigNumber.from(0));
    expect(author).to.equal(addresses[1]);
    expect(comments).to.eql([]);
  });

  it("4. New Answer SHOULD be reflected in Question struct state", async () => {
    const AID = await postAnswer(QID);
    const { answers } = await stack3.getQuestionById(QID);
    const AIDFromQ = answers[answers.length - 1];
    expect(AIDFromQ).to.eql(AID);
  });

  it("5. New Answer SHOULD be reflected in User struct state", async () => {
    await stack3.connect(signers[1]).postAnswer(QID, POST_URI, hashedSecret);
    const newAID = (await stack3.getTotalCounts())[2];
    const { answers } = await stack3.getUserByAddress(addresses[1]);
    const AIDFromU = answers[answers.length - 1];

    expect(AIDFromU).to.eql(newAID);
  });

  it("6. Unregistered addresses SHOULD not be able to call the function", async () => {
    await expect(
      stack3.connect(signers[3]).postAnswer(QID, POST_URI, hashedSecret)
    ).to.eventually.be.rejectedWith("Stack3: User not registered");
  });

  it("7. Function SHOULD NOT execute if invalid `QuestionId` param is passed", async () => {
    await expect(
      stack3
        .connect(signers[1])
        .postAnswer(QID.add(100), POST_URI, hashedSecret)
    ).to.eventually.be.rejectedWith("Stack3: Invalid question id");
  });

  it("8. Function SHOULD NOT execute if invalid `secret` param is passed", async () => {
    const { hashedSecret: invalidSecret } =
      requestMerkleSecret("NOT-VALID-PHRASE");
    await expect(
      stack3.connect(signers[1]).voteQuestion(QID, 1, invalidSecret)
    ).to.eventually.be.rejectedWith("Stack3: Unverified source of call");
  });
});

describe("V. Voting on answers.", () => {
  let AID;
  beforeEach(async () => {
    const { answers } = await stack3.getUserByAddress(addresses[1]);
    AID = answers[answers.length - 1];
  });

  const postAnswer = async (QID) => {
    await stack3.connect(signers[1]).postAnswer(QID, POST_URI, hashedSecret);
    const { answers } = await stack3.getUserByAddress(addresses[1]);
    const AID = answers[answers.length - 1];
    return AID;
  };

  const up1down1 = async (aId) => {
    await stack3.connect(signers[1]).voteAnswer(aId, 1, hashedSecret);
    await stack3.connect(signers[2]).voteAnswer(aId, -1, hashedSecret);
  };

  it("1. Registered addresses SHOULD be able to vote on any Answer", async () => {
    await stack3.connect(signers[3]).registerUser(POST_URI, hashedSecret);
    await expect(stack3.connect(signers[2]).voteAnswer(AID, 1, hashedSecret)).to
      .eventually.be.fulfilled;
    await expect(stack3.connect(signers[3]).voteAnswer(AID, 1, hashedSecret)).to
      .eventually.be.fulfilled;
  });

  it("2. Custom `NewVote` event SHOULD be emitted on successful `voteAnswer` call", async () => {
    const AIDFromCall = await postAnswer(
      (
        await stack3.getUserByAddress(addresses[0])
      ).questions[0]
    );
    const tx = await stack3
      .connect(signers[2])
      .voteAnswer(AIDFromCall, 1, hashedSecret);
    const { events } = await tx.wait();
    expect(events[0].eventSignature).to.equal(
      "NewVote(uint8,uint256,int8,address)"
    );
  });

  it("3. Upvotes and downvote count SHOULD be reflected in Answer struct.", async () => {
    const AIDFromCall = await postAnswer(
      (
        await stack3.getUserByAddress(addresses[0])
      ).questions[0]
    );

    const { upvotes: upvoteInit, downvotes: downvoteInit } =
      await stack3.getAnswerById(AIDFromCall);

    await up1down1(AIDFromCall);

    const { upvotes: upvoteFinal, downvotes: downvoteFinal } =
      await stack3.getAnswerById(AIDFromCall);

    expect(upvoteFinal).to.eql(upvoteInit.add(1));
    expect(downvoteFinal).to.eql(downvoteInit.add(1));
  });

  it("4. Upvotes count SHOULD be reflected in `author` User struct", async () => {
    const AIDFromCall = await postAnswer(
      (
        await stack3.getUserByAddress(addresses[0])
      ).questions[0]
    );

    const { author } = await stack3.getAnswerById(AIDFromCall);
    const { aUpvotes: aUpInit } = await stack3.getUserByAddress(author);

    await up1down1(AIDFromCall);
    const { aUpvotes: aUpFinal } = await stack3.getUserByAddress(author);

    expect(aUpFinal).to.eql(aUpInit.add(1));
  });

  it("5. Unregistered addresses SHOULD NOT be able to call the function", async () => {
    const AID = await postAnswer(
      (
        await stack3.getUserByAddress(addresses[0])
      ).questions[0]
    );
    await expect(
      stack3.connect(signers[6]).voteAnswer(AID, 1, hashedSecret)
    ).to.eventually.be.rejectedWith("Stack3: User not registered");
  });

  it("6. Function SHOULD NOT execute for invalid `answerId` param passed", async () => {
    const AID = await postAnswer(
      (
        await stack3.getUserByAddress(addresses[0])
      ).questions[0]
    );

    await expect(
      stack3.connect(signers[1]).voteAnswer(AID.add(200), -1, hashedSecret)
    ).to.eventually.be.rejectedWith("Stack3: Invalid answer id");
  });

  it("7. Function SHOULD NOT execute for invalid `voteMarker (1 or -1)` param passed", async () => {
    const AID = await postAnswer(
      (
        await stack3.getUserByAddress(addresses[0])
      ).questions[0]
    );

    await expect(
      stack3.connect(signers[1]).voteAnswer(AID, -2, hashedSecret)
    ).to.eventually.be.rejectedWith("Stack3: Invalid vote param");
  });

  it("8. User SHOULD NOT be able to call function more than once per AID", async () => {
    const AID = await postAnswer(
      (
        await stack3.getUserByAddress(addresses[0])
      ).questions[0]
    );
    await up1down1(AID);

    await expect(
      stack3.connect(signers[1]).voteAnswer(AID, 1, hashedSecret)
    ).to.eventually.be.rejectedWith("Stack3: User has voted");
  });

  it("9. Function SHOULD NOT execute if invalid secret is passed", async () => {
    const AID = await postAnswer(
      (
        await stack3.getUserByAddress(addresses[0])
      ).questions[0]
    );

    const { hashedSecret: invalidSecret } =
      requestMerkleSecret("NOT-VALID-PHRASE");
    await expect(
      stack3.connect(signers[0]).voteAnswer(AID, 1, invalidSecret)
    ).to.eventually.be.rejectedWith("Stack3: Unverified source of call");
  });
});

describe("VI. Choosing best answer", () => {
  let QID;
  let AID;

  beforeEach(async () => {
    [QID, AID] = [BigNumber.from(13), BigNumber.from(14)];
    const tags = [1, 2, 3, 4, 5];
    const tx1 = await stack3
      .connect(signers[0])
      .postQuestion(tags, POST_URI, hashedSecret);
    const { events: qEvents } = await tx1.wait();
    // console.log(events);
    QID = qEvents[0]?.args?.id;

    const tx2 = await stack3
      .connect(signers[1])
      .postAnswer(QID, POST_URI, hashedSecret);
    const { events: aEvents } = await tx2.wait();
    // console.log(aEvents[0]?.args?.id);
    AID = aEvents[0]?.args?.id;
    // console.log(AID);
  });

  // const chooseBest = async (AID) => {
  //   await stack3.connect(signers[0]).chooseBestAnswer(AID, hashedSecret);
  // };

  const inc = () => {
    AID.add(1);
    QID.add(1);
  };

  it("1. Question authors SHOULD be able to choose the Best Answer to their question", async () => {
    console.log(AID);
    await expect(stack3.connect(signers[0]).chooseBestAnswer(AID, hashedSecret))
      .to.eventually.be.fulfilled;
    inc();
  });

  it("2. Best answer choice SHOULD reflect in the Question struct", async () => {
    console.log(AID);
    await stack3.connect(signers[0]).chooseBestAnswer(AID, hashedSecret);
    const { bestAnswerChosen } = await stack3.getQuestionById(QID);
    expect(bestAnswerChosen).to.equal(true);
    inc();
  });

  // it("3. Best answer choice SHOULD reflect in the Answer struct", async () => {
  //   await chooseBest(AID);
  //   const { isBestAnswer } = await stack3.getAnswerById(AID);
  //   expect(isBestAnswer).to.equal(true);
  // });

  // it("4. Best answer choice SHOULD reflect in the Answer struct", async () => {
  //   const { bestAnswerCount: initBestCount } = await stack3.getUserByAddress(
  //     addresses[1]
  //   );

  //   await chooseBest(AID);

  //   const { bestAnswerCount: finalBestCount } = await stack3.getUserByAddress(
  //     addresses[1]
  //   );

  //   expect(finalBestCount).to.eql(initBestCount.add(1));
  // });

  // it("5. Question authors SHOULD NOT be able choose gt 1 best answer per Question", async () => {
  //   await chooseBest(AID);
  //   await expect(
  //     stack3.connect(signers[0]).chooseBestAnswer(AID, hashedSecret)
  //   ).to.eventually.be.rejectedWith(
  //     "Stack3: Best answer for question already chosen"
  //   );
  // });

  // it("6. Non-author Users SHOULD NOT be able to choose best answer for a question.", async () => {
  //   await expect(
  //     stack3.connect(signers[3]).chooseBestAnswer(AID, hashedSecret)
  //   ).to.eventually.be.rejectedWith("Stack3: Caller is not author");
  // });

  // it("7. Unregistered Users SHOULD NOT be able to call the function", async () => {
  //   await expect(
  //     stack3.connect(signers[7]).chooseBestAnswer(AID, hashedSecret)
  //   ).to.eventually.be.rejectedWith("Stack3: User not registered");
  // });

  // it("8. Function SHOULD NOT execute if invalid secret is passed", async () => {
  //   const { hashedSecret: invalidSecret } =
  //     requestMerkleSecret("NOT-VALID-PHRASE");
  //   await expect(
  //     stack3.connect(signers[0]).chooseBestAnswer(AID, invalidSecret)
  //   ).to.eventually.be.rejectedWith("Stack3: Unverified source of call");
  // });
});

describe("VII. Comment on post", () => {
  let QID, AID;
  const PostType = {
    QUESTION: 0,
    ANSWER: 1,
  };

  beforeEach(async () => {
    const tags = [1, 2, 3, 4, 5];
    const tx1 = await stack3
      .connect(signers[0])
      .postQuestion(tags, POST_URI, hashedSecret);
    const { events: qEvents } = await tx1.wait();
    // console.log(events);
    QID = qEvents[qEvents.length - 1].args.id;

    const tx2 = await stack3
      .connect(signers[1])
      .postAnswer(QID, POST_URI, hashedSecret);
    const { events: aEvents } = await tx2.wait();
    // console.log(events);
    AID = aEvents[aEvents.length - 1].args.id;
  });

  const postCommentQ1A1 = async (QID, AID) => {
    const tx1 = await stack3
      .connect(signers[2])
      .postComment(PostType.QUESTION, QID, POST_URI, hashedSecret);
    const { events: qEvents } = await tx1.wait();

    const tx2 = await stack3
      .connect(signers[2])
      .postComment(PostType.ANSWER, AID, POST_URI, hashedSecret);

    const { events: aEvents } = await tx2.wait();

    return {
      qCID: qEvents[0].args.id,
      aCID: aEvents[0].args.id,
    };
  };

  it("1. Registered Users SHOULD be able to comment on Questions and Answers", async () => {
    await expect(
      stack3
        .connect(signers[2])
        .postComment(PostType.QUESTION, QID, POST_URI, hashedSecret)
    ).to.eventually.be.fulfilled;
    await expect(
      stack3
        .connect(signers[2])
        .postComment(PostType.ANSWER, AID, POST_URI, hashedSecret)
    ).to.eventually.be.fulfilled;
  });

  it("2. Comment struct SHOULD have required params set to init values", async () => {
    const { qCID, aCID } = await postCommentQ1A1(QID, AID);

    const {
      id: id_q,
      parentPostType: parentPostType_q,
      parentPostId: parentPostId_q,
      author: author_q,
    } = await stack3.getCommentById(qCID);
    expect(id_q).to.eql(qCID);
    expect(parentPostType_q).to.equal(PostType.QUESTION);
    expect(parentPostId_q).to.eql(QID);
    expect(author_q).to.equal(addresses[2]);

    const {
      id: id_a,
      parentPostType: parentPostType_a,
      parentPostId: parentPostId_a,
      author: author_a,
    } = await stack3.getCommentById(aCID);
    expect(id_a).to.eql(aCID);
    expect(parentPostType_a).to.equal(PostType.ANSWER);
    expect(parentPostId_a).to.eql(AID);
    expect(author_a).to.equal(addresses[2]);
  });

  it("3. Successful comment post SHOULD be reflected in Parent Post (Question / Answer) structs", async () => {
    const { comments: qCommentsInit } = await stack3.getQuestionById(QID);
    const { comments: aCommentsInit } = await stack3.getAnswerById(AID);

    const { qCID, aCID } = await postCommentQ1A1(QID, AID);

    const { comments: qCommentsFinal } = await stack3.getQuestionById(QID);
    const { comments: aCommentsFinal } = await stack3.getAnswerById(AID);

    expect(qCommentsFinal.length).to.equal(qCommentsInit.length + 1);
    expect(aCommentsFinal.length).to.equal(aCommentsInit.length + 1);

    expect(qCommentsFinal[qCommentsFinal.length - 1]).to.eql(qCID);
    expect(aCommentsFinal[qCommentsFinal.length - 1]).to.eql(aCID);
  });

  it("4. Successful comment post SHOULD be reflected in `author` User struct", async () => {
    const { comments: commentsInit } = await stack3.getUserByAddress(
      addresses[2]
    );

    const { qCID, aCID } = await postCommentQ1A1(QID, AID);

    const { comments: commentsFinal } = await stack3.getUserByAddress(
      addresses[2]
    );

    expect(commentsFinal.length).to.equal(commentsInit.length + 2);

    expect(commentsFinal[commentsFinal.length - 1]).to.eql(aCID);
    expect(commentsFinal[commentsFinal.length - 2]).to.eql(qCID);
  });

  it("5. Unregistered addresses SHOULD NOT be able to call the function", async () => {
    await expect(
      stack3
        .connect(signers[6])
        .postComment(PostType.QUESTION, QID, POST_URI, hashedSecret)
    ).to.eventually.be.rejectedWith("Stack3: User not registered");
  });

  it("6. Function SHOULD NOT execute if invalid `postType` param is passed", async () => {
    const INVALID_POST_TYPE = PostType.QUESTION + 3;
    await expect(
      stack3
        .connect(signers[2])
        .postComment(INVALID_POST_TYPE, QID, POST_URI, hashedSecret)
    ).to.eventually.be.rejectedWith("Stack3: Invalid post type");
  });

  it("7. Function SHOULD NOT execute if invalid `postId` param is passed", async () => {
    await expect(
      stack3
        .connect(signers[2])
        .postComment(PostType.QUESTION, QID.add(99), POST_URI, hashedSecret)
    ).to.eventually.be.rejectedWith("Stack3: Invalid post id");
  });

  it("8. Function SHOULD NOT execute if invalid `secret` param is passed", async () => {
    const { hashedSecret: invalidSecret } =
      requestMerkleSecret("NOT-VALID-PHRASE");
    await expect(
      stack3
        .connect(signers[2])
        .postComment(PostType.QUESTION, QID, POST_URI, invalidSecret)
    ).to.eventually.be.rejectedWith("Stack3: Unverified source of call");
  });
});
