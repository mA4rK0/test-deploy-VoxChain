// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VotingSystemFactory {
    error IndexOutOfBounds(uint256 _index);

    event PollCreated(address indexed pollAddress, string indexed pollName, address creator);

    struct PollInfo {
        address pollAddress;
        string pollName;
        address creator;
    }

    PollInfo[] public allPolls;
    mapping(address => bool) public isPoll;

    function createPoll(
        string calldata _pollName,
        string[] calldata _candidates,
        string calldata _description,
        uint256 _maxVotes,
        uint256 _duration
    ) external {
        VotingPoll newPoll = new VotingPoll(_pollName, _candidates, _description, _maxVotes, _duration);
        allPolls.push(PollInfo(address(newPoll), _pollName, msg.sender));
        isPoll[address(newPoll)] = true;

        emit PollCreated(address(newPoll), _pollName, msg.sender);
    }

    function getTotalPolls() external view returns (uint256) {
        return allPolls.length;
    }

    function getPoll(uint256 index) public view returns (PollInfo memory) {
        if (index >= allPolls.length) revert IndexOutOfBounds(index);
        return allPolls[index];
    }
}

contract VotingPoll {
    error InsufficientCandidates(string[] _candidates);
    error AlreadyVoted(address _voter);
    error Ended(uint256 _duration);
    error MaxVotesReached(uint256 _maxVotes);
    error NotDoneYet(uint256 _time);
    error AlreadyFinished(bool _completed);
    error NoValidWinner();

    event PollCreated(
        address _creator,
        string _pollName,
        string[] _candidates,
        string _description,
        uint256 _maxVotes,
        uint256 _duration,
        uint256 _startTime
    );
    event Voted(address _voter, string _candidate);
    event WinnerDeclared(string indexed _winner, uint256 _votes);

    struct Candidate {
        string name;
        uint256 votes;
    }

    address public immutable creator;
    string public pollName;
    string[] public candidates;
    string public description;
    uint256 public immutable maxVotes;
    uint256 public immutable duration;
    uint256 public immutable startTime;
    uint256 public totalVoters;
    bool public isCompleted;

    mapping(string => uint256) public candidateVotes;
    mapping(address => bool) public hasVoted;

    constructor(
        string memory _pollName,
        string[] memory _candidates,
        string memory _description,
        uint256 _maxVotes,
        uint256 _duration
    ) {
        if (_candidates.length < 2 || _candidates.length > 3) revert InsufficientCandidates(_candidates);

        creator = msg.sender;
        pollName = _pollName;
        candidates = _candidates;
        description = _description;
        maxVotes = _maxVotes;
        duration = _duration;
        startTime = block.timestamp + 1 seconds;
        totalVoters = 0;
        isCompleted = false;

        for (uint256 i = 0; i < _candidates.length; i++) {
            candidateVotes[_candidates[i]] = 0;
        }
        emit PollCreated(msg.sender, _pollName, _candidates, _description, _maxVotes, _duration, startTime);
    }

    function vote(string calldata _candidate) external {
        if (block.timestamp >= startTime + duration) revert Ended(duration);
        if (totalVoters >= maxVotes) revert MaxVotesReached(maxVotes);
        if (hasVoted[msg.sender]) revert AlreadyVoted(msg.sender);

        hasVoted[msg.sender] = true;
        totalVoters++;
        candidateVotes[_candidate]++;
        emit Voted(msg.sender, _candidate);
    }

    function chooseWinner() external {
        if (block.timestamp < startTime + duration) revert NotDoneYet(duration);
        if (isCompleted) revert AlreadyFinished(isCompleted);
        string memory winner = "";
        uint256 highestVotes = 0;
        uint256 candidatesLength = candidates.length;

        for (uint256 i = 0; i < candidatesLength; i++) {
            uint256 votes = candidateVotes[candidates[i]];
            if (votes > highestVotes) {
                highestVotes = votes;
                winner = candidates[i];
            }
        }

        if (bytes(winner).length <= 0) revert NoValidWinner();
        isCompleted = true;

        emit WinnerDeclared(winner, highestVotes);
    }

    function getResults() external view returns (Candidate[] memory) {
        Candidate[] memory results = new Candidate[](candidates.length);
        uint256 candidatesLength = candidates.length;

        for (uint256 i = 0; i < candidatesLength; i++) {
            results[i] = Candidate(candidates[i], candidateVotes[candidates[i]]);
        }
        return results;
    }
}
