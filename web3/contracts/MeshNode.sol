// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./MeshNodeBadges.sol";
import "./MeshNodeAutomation.sol";

contract MeshNode is Ownable {
    enum PostType {
        QUESTION,
        ANSWER
    }

    event NewUser(uint256 timestamp, uint256 indexed id, address indexed user);

    event NewQuestion(
        uint256 timestamp,
        uint256 indexed id,
        address indexed user
    );

    event NewVote(
        uint8 indexed _postType,
        uint256 indexed id,
        int8 _vote,
        address indexed voter
    );

    event NewAnswer(
        uint256 timestamp,
        uint256 indexed id,
        uint256 indexed qId,
        address indexed user
    );

    event BestAnswerChosen(uint256 qid, uint256 aid);

    event NewComment(
        uint256 timestamp,
        uint256 indexed id,
        PostType parentPostType,
        uint256 indexed postId,
        address indexed user
    );

    struct User {
        uint256 id;
        uint256 bestAnswerCount;
        uint256 qUpvotes;
        uint256 aUpvotes;
        address userAddress;
        uint256[] questions;
        uint256[] answers;
        uint256[] comments;
        string uri;
    }

    struct Question {
        bool bestAnswerChosen;
        uint256 id;
        uint256 upvotes;
        uint256 downvotes;
        address author;
        uint256[] tags;
        uint256[] comments;
        uint256[] answers;
        string uri;
    }

    struct Answer {
        bool isBestAnswer;
        uint256 id;
        uint256 qid;
        uint256 upvotes;
        uint256 downvotes;
        address author;
        uint256[] comments;
        string uri;
    }

    struct Comment {
        uint256 id;
        PostType parentPostType;
        uint256 parentPostId;
        address author;
        string uri;
    }

    bytes32[] private s_merkleProof;
    bytes32 private immutable s_merkleRoot;

    uint256 private s_userIdCounter;
    uint256 private s_questionIdCounter;
    uint256 private s_answerIdCounter;
    uint256 private s_commentIdCounter;
    // uint256 private i_reservedTokensCount;

    address[] private s_allUsers;

    MeshNodeBadges private immutable i_meshNodeBadges;

    mapping(address => User) private s_users;
    mapping(uint256 => Question) private s_questions;
    mapping(uint256 => Answer) private s_answers;
    mapping(uint256 => Comment) private s_comments;
    mapping(string => uint256) private s_uriToQid;

    mapping(address => mapping(uint256 => int8)) public s_userVotedQuestion;
    mapping(address => mapping(uint256 => int8)) public s_userVotedAnswer;
    mapping(address => mapping(uint256 => uint256))
        public s_userQuestionTagCounts;
    // mapping (address => mapping (uint256 => uint256)) public s_userAnswerTagCounts;
    mapping(uint256 => mapping(uint256 => bool))
        private s_tagsToQuestionsMapping;
    uint256 public s_initTagCount;

    constructor(
        address _meshNodeBadgesAddress,
        uint256 _initTagCount,
        bytes32 _merkleRoot
    ) {
        i_meshNodeBadges = MeshNodeBadges(_meshNodeBadgesAddress);
        _initCounters(1);
        s_initTagCount = _initTagCount;
        s_merkleRoot = _merkleRoot;
    }

    function registerUser(string memory _uri, bytes32 _secret) external {
        require(_verifySecret(_secret), "MeshNode: Unverified source of call");
        require(
            _callerIsWallet(msg.sender),
            "MeshNode: Call from external contract."
        );
        require(!_userExists(msg.sender), "MeshNode: User already registered");
        uint256 newId = s_userIdCounter++;

        s_users[msg.sender].id = newId;
        s_users[msg.sender].userAddress = msg.sender;
        s_users[msg.sender].uri = _uri;

        s_allUsers.push(msg.sender);

        i_meshNodeBadges.mintUserBadge(msg.sender);

        emit NewUser(block.timestamp, newId, msg.sender);
    }

    // ================================= TEMP ================================= //
    function setUserURI(string memory _newUri, bytes32 _secret) public {
        require(_verifySecret(_secret), "MeshNode: Unverified source of call");
        require(
            _callerIsWallet(msg.sender),
            "MeshNode: Call from external contract."
        );
        require(_userExists(msg.sender), "MeshNode: User not registered");

        s_users[msg.sender].uri = _newUri;
    }

    // ================================= TEMP ================================= //

    function postQuestion(
        uint256[] memory _tags,
        string memory _uri,
        bytes32 _secret
    ) external {
        require(_verifySecret(_secret), "MeshNode: Unverified source of call");
        require(
            _callerIsWallet(msg.sender),
            "MeshNodeMeshNode: Call from external contract."
        );
        require(_userExists(msg.sender), "MeshNode: User not registered");
        require(_tags.length <= 10, "MeshNode: Max tag count is 10");

        uint256 newId = s_questionIdCounter++;
        s_users[msg.sender].questions.push(newId);

        s_questions[newId].id = newId;
        s_questions[newId].author = msg.sender;
        s_questions[newId].tags = _tags;
        s_questions[newId].uri = _uri;
        s_uriToQid[_uri] = newId;

        for (uint256 i = 0; i < _tags.length; i++) {
            // s_userQuestionTagCounts[msg.sender][_tags[i]] += 1;
            s_tagsToQuestionsMapping[_tags[i]][newId] = true;
            s_userQuestionTagCounts[msg.sender][_tags[i]]++;
            if ((s_userQuestionTagCounts[msg.sender][_tags[i]]) <= 15) {
                i_meshNodeBadges.updateAndRewardTagBadges(
                    _tags[i],
                    s_userQuestionTagCounts[msg.sender][_tags[i]],
                    msg.sender
                );
            }
        }

        if (s_users[msg.sender].questions.length <= 15) {
            i_meshNodeBadges.updateAndRewardBadges(
                0,
                s_users[msg.sender].questions.length,
                msg.sender
            );
        }

        emit NewQuestion(block.timestamp, newId, msg.sender);
    }

    function voteQuestion(uint256 _qid, int8 _vote, bytes32 _secret) external {
        require(_verifySecret(_secret), "MeshNode: Unverified source of call");
        require(
            _callerIsWallet(msg.sender),
            "MeshNode: Call from external contract."
        );
        require(_userExists(msg.sender), "MeshNode: User not registered");
        require(_questionExists(_qid), "MeshNode: Invalid question id");
        require(
            s_userVotedQuestion[msg.sender][_qid] == 0,
            "MeshNode: User has voted"
        );
        require(_vote == 1 || _vote == -1, "MeshNode: Invalid vote param");

        address author = s_questions[_qid].author;

        if (_vote == -1) {
            s_questions[_qid].downvotes += 1;
            s_userVotedQuestion[msg.sender][_qid] = -1;
        } else {
            s_questions[_qid].upvotes += 1;
            s_users[author].qUpvotes += 1;
            s_userVotedQuestion[msg.sender][_qid] = 1;
        }

        i_meshNodeBadges.updateAndRewardBadges(
            1,
            s_users[author].qUpvotes + 1,
            author
        );

        emit NewVote(uint8(PostType.QUESTION), _qid, _vote, msg.sender);
    }

    function postAnswer(
        uint256 _qid,
        string memory _uri,
        bytes32 _secret
    ) external {
        require(_verifySecret(_secret), "MeshNode: Unverified source of call");
        require(
            _callerIsWallet(msg.sender),
            "MeshNode: Call from external contract."
        );
        require(_userExists(msg.sender), "MeshNode: User not registered");
        require(_questionExists(_qid), "MeshNode: Invalid question id");

        uint256 newId = s_answerIdCounter++;
        s_users[msg.sender].answers.push(newId);

        s_questions[_qid].answers.push(newId);

        s_answers[newId].id = newId;
        s_answers[newId].qid = _qid;
        s_answers[newId].author = msg.sender;
        s_answers[newId].uri = _uri;

        // for (uint256 i=0; i < s_questions[_qid].tags.length; i++) {
        //     s_userAnswerTagCounts[msg.sender][s_questions[_qid].tags[i]] += 1;
        // }

        i_meshNodeBadges.updateAndRewardBadges(
            2,
            s_users[msg.sender].answers.length,
            msg.sender
        );
        emit NewAnswer(block.timestamp, newId, _qid, msg.sender);
    }

    function voteAnswer(uint256 _aid, int8 _vote, bytes32 _secret) external {
        require(_verifySecret(_secret), "MeshNode: Unverified source of call");
        require(
            _callerIsWallet(msg.sender),
            "MeshNode: Call from external contract."
        );
        require(_userExists(msg.sender), "MeshNode: User not registered");
        require(_answerExists(_aid), "MeshNode: Invalid answer id");
        require(
            s_userVotedAnswer[msg.sender][_aid] == 0,
            "MeshNode: User has voted"
        );
        require(_vote == 1 || _vote == -1, "MeshNode: Invalid vote parameter");

        address author = s_answers[_aid].author;

        if (_vote == -1) {
            s_answers[_aid].downvotes += 1;
            s_userVotedAnswer[msg.sender][_aid] = -1;
        } else {
            s_answers[_aid].upvotes += 1;
            s_users[author].aUpvotes += 1;
            s_userVotedAnswer[msg.sender][_aid] = 1;
        }

        i_meshNodeBadges.updateAndRewardBadges(
            3,
            s_users[author].aUpvotes + 1,
            author
        );

        emit NewVote(uint8(PostType.ANSWER), _aid, _vote, msg.sender);
    }

    function chooseBestAnswer(uint256 _aid, bytes32 _secret) external {
        require(_verifySecret(_secret), "MeshNode: Unverified source of call");
        require(
            _callerIsWallet(msg.sender),
            "MeshNode: Call from external contract."
        );
        require(_userExists(msg.sender), "MeshNode: User not registered");
        require(_answerExists(_aid), "MeshNode: Invalid answer id");
        uint256 qid = s_answers[_aid].qid;
        require(
            s_questions[qid].author == msg.sender,
            "MeshNode: Caller is not author"
        );
        require(
            !s_questions[qid].bestAnswerChosen,
            "StacMeshNodek3: Best answer for question already chosen"
        );
        require(
            !s_answers[_aid].isBestAnswer,
            "MeshNode: This answer is chosen as the best"
        );

        s_questions[qid].bestAnswerChosen = true;
        s_answers[_aid].isBestAnswer = true;
        s_users[s_answers[_aid].author].bestAnswerCount += 1;

        i_meshNodeBadges.updateAndRewardBadges(
            4,
            s_users[s_answers[_aid].author].bestAnswerCount + 1,
            s_answers[_aid].author
        );

        emit BestAnswerChosen(qid, _aid);
    }

    function postComment(
        uint8 _postType,
        uint256 _postId,
        string memory _uri,
        bytes32 _secret
    ) external {
        require(_verifySecret(_secret), "MeshNode: Unverified source of call");
        require(
            _callerIsWallet(msg.sender),
            "MeshNodeMeshNode: Call from external contract."
        );
        require(_userExists(msg.sender), "MeshNode: User not registered");
        require(
            _questionExists(_postId) || _answerExists(_postId),
            "MeshNode: Invalid post id"
        );
        require(_validPostType(_postType), "MeshNode: Invalid post type");

        uint256 newId = s_commentIdCounter++;

        s_users[msg.sender].comments.push(newId);

        PostType(_postType) == PostType.QUESTION
            ? s_questions[_postId].comments.push(newId)
            : s_answers[_postId].comments.push(newId);

        s_comments[newId].id = newId;
        s_comments[newId].parentPostType = PostType(_postType);
        s_comments[newId].uri = _uri;
        s_comments[newId].parentPostId = _postId;
        s_comments[newId].author = msg.sender;

        emit NewComment(
            block.timestamp,
            newId,
            PostType(_postType),
            _postId,
            msg.sender
        );

        i_meshNodeBadges.updateAndRewardBadges(
            5,
            s_users[msg.sender].comments.length,
            msg.sender
        );
    }

    function _callerIsWallet(address _addr) internal view returns (bool) {
        return tx.origin == _addr;
    }

    function _userExists(address _addr) public view returns (bool) {
        return s_users[_addr].userAddress != address(0);
    }

    function _validPostType(uint8 _type) internal pure returns (bool) {
        return _type == 0 || _type == 1;
    }

    function _questionExists(uint256 _id) internal view returns (bool) {
        return _id > 0 && _id < s_questionIdCounter;
    }

    function _answerExists(uint256 _id) internal view returns (bool) {
        return _id > 0 && _id < s_answerIdCounter;
    }

    function _commentExists(uint256 _id) internal view returns (bool) {
        return _id > 0 && _id < s_commentIdCounter;
    }

    function _initCounters(uint256 _initValue) internal {
        s_userIdCounter = _initValue;
        s_questionIdCounter = _initValue;
        s_answerIdCounter = _initValue;
        s_commentIdCounter = _initValue;
    }

    function _verifySecret(bytes32 _secret) internal view returns (bool) {
        return
            MerkleProof.verify(
                s_merkleProof,
                s_merkleRoot,
                keccak256(abi.encodePacked(_secret))
            );
    }

    function getQuestionsByTag(
        uint256 _tid
    ) public view returns (uint256[] memory) {
        uint256[] memory taggedQuestions = new uint256[](s_questionIdCounter);
        uint256 index = 0;
        for (uint256 i = 1; i < s_questionIdCounter; i++) {
            if (s_tagsToQuestionsMapping[_tid][i]) {
                taggedQuestions[index++] = i;
            }
        }
        return taggedQuestions;
    }

    function getUserByAddress(
        address _userAddress
    ) public view returns (User memory) {
        require(_userExists(_userAddress), "MeshNode: User not registered");
        return s_users[_userAddress];
    }

    function getQuestionById(
        uint256 _id
    ) public view returns (Question memory) {
        require(_questionExists(_id), "MeshNode: Invalid question id");
        return s_questions[_id];
    }

    function getAnswerById(uint256 _id) public view returns (Answer memory) {
        require(_answerExists(_id), "MeshNode: Invalid answer id");
        return s_answers[_id];
    }

    function getCommentById(uint256 _id) public view returns (Comment memory) {
        require(_commentExists(_id), "MeshNode: Invalid comment id");
        return s_comments[_id];
    }

    function getAnswersByQuestionId(
        uint256 _qid
    ) public view returns (uint256[] memory) {
        return s_questions[_qid].answers;
    }

    function getCommentsByQuestionId(
        uint256 _qid
    ) public view returns (uint256[] memory) {
        return s_questions[_qid].comments;
    }

    function getCommentsByAnswerId(
        uint256 _aid
    ) public view returns (uint256[] memory) {
        return s_answers[_aid].comments;
    }

    function getQuestionsByUserAddress(
        address _user
    ) public view returns (uint256[] memory) {
        return s_users[_user].questions;
    }

    function getAnswersByUserAddress(
        address _user
    ) public view returns (uint256[] memory) {
        return s_users[_user].answers;
    }

    function getCommentsByUserAddress(
        address _user
    ) public view returns (uint256[] memory) {
        return s_users[_user].comments;
    }

    function getTotalCounts()
        public
        view
        returns (uint256, uint256, uint256, uint256)
    {
        return (
            s_userIdCounter - 1,
            s_questionIdCounter - 1,
            s_answerIdCounter - 1,
            s_commentIdCounter - 1
        );
    }

    function getQuestionByUri(
        string memory _uri
    ) public view returns (uint256) {
        return s_uriToQid[_uri];
    }

    function getAllUserAddresses() public view returns (address[] memory) {
        return s_allUsers;
    }
}
