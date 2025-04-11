// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VotingSystemFactory {
    error IndexOutOfBounds(uint256 _index);

    event PollCreated(address indexed pollAddress, string indexed pollName, address creator);

    struct PollInfo {
        address pollAddress;
        address creator;
        string pollName;
    }

    mapping(uint256 => PollInfo) public allPolls;
    mapping(address => bool) public isPoll;
    uint256 private pollCount = 0;

    function createPoll(
        string calldata _pollName,
        string calldata _description,
        string[] calldata _candidates,
        uint256 _maxVotes,
        uint256 _duration
    ) external {
        VotingPoll newPoll = new VotingPoll(_pollName, _description, _candidates, _maxVotes, _duration, msg.sender);
        pollCount++;
        allPolls[pollCount] = PollInfo(address(newPoll), msg.sender, _pollName);
        isPoll[address(newPoll)] = true;

        emit PollCreated(address(newPoll), _pollName, msg.sender);
    }

    function getPollExtendedInfo(address pollAddress)
        external
        view
        returns (string memory, string memory, string[] memory, uint256, uint256, uint256, uint256, address, bool)
    {
        VotingPoll poll = VotingPoll(pollAddress);

        (
            string memory name,
            string memory description,
            string[] memory candidates,
            uint256 maxVotes,
            uint256 duration,
            uint256 startTime,
            uint256 totalVoters,
            address creator,
            bool isActive
        ) = poll.getPollDetails();

        return (name, description, candidates, maxVotes, duration, startTime, totalVoters, creator, isActive);
    }

    function getTotalPolls() external view returns (uint256) {
        return pollCount;
    }

    function getPoll(uint256 count) external view returns (PollInfo memory) {
        if (count == 0 || count > pollCount) revert IndexOutOfBounds(count);
        return allPolls[count];
    }
}

contract VotingPoll {
    error InsufficientCandidates(string[] _candidates);
    error AlreadyVoted(address _voter);
    error Ended(uint256 _duration);
    error MaxVotesReached(uint256 _maxVotes);
    error NotDoneYet(uint256 _time);
    error AlreadyFinished(bool _completed);
    error NoValidCandidate(string _candidate);
    error NoValidWinner();

    event PollCreated(
        address indexed _creator,
        string _pollName,
        string[] _candidates,
        string _description,
        uint256 _maxVotes,
        uint256 _duration,
        uint256 _startTime
    );
    event Voted(address _voter, string _candidate);
    event WinnerDeclared(string indexed _winner, uint256 _votes);
    event DrawOccurred(string[] drawCandidates, uint256 topVotes);

    struct Candidate {
        string name;
        uint256 votes;
    }

    string private pollName;
    string private description;
    string[] private candidates;
    uint256 private immutable maxVotes;
    uint256 private immutable duration;
    uint256 private immutable startTime;
    uint256 private totalVoters;
    address private immutable creator;
    bool private isCompleted;

    mapping(string => bool) public isCandidate;
    mapping(string => uint256) public candidateVotes;
    mapping(address => bool) public hasVoted;

    constructor(
        string memory _pollName,
        string memory _description,
        string[] memory _candidates,
        uint256 _maxVotes,
        uint256 _duration,
        address _address
    ) {
        if (_candidates.length < 2 || _candidates.length > 3) revert InsufficientCandidates(_candidates);

        creator = _address;
        pollName = _pollName;
        candidates = _candidates;
        description = _description;
        maxVotes = _maxVotes;
        duration = _duration;
        startTime = block.timestamp + 1 seconds;
        totalVoters = 0;
        isCompleted = false;

        for (uint256 i = 0; i < _candidates.length; i++) {
            isCandidate[_candidates[i]] = true;
            candidateVotes[_candidates[i]] = 0;
        }
        emit PollCreated(msg.sender, _pollName, _candidates, _description, _maxVotes, _duration, startTime);
    }

    function vote(string calldata _candidate) external {
        if (block.timestamp >= startTime + duration) revert Ended(duration);
        if (totalVoters >= maxVotes) revert MaxVotesReached(maxVotes);
        if (hasVoted[msg.sender]) revert AlreadyVoted(msg.sender);
        if (!isCandidate[_candidate]) revert NoValidCandidate(_candidate);

        hasVoted[msg.sender] = true;
        unchecked {
            totalVoters++;
        }
        candidateVotes[_candidate]++;
        emit Voted(msg.sender, _candidate);
    }

    function chooseWinner() external {
        if (block.timestamp < startTime + duration) revert NotDoneYet(duration);
        if (isCompleted) revert AlreadyFinished(isCompleted);

        uint256 highestVotes = 0;
        uint256 drawCount = 0;
        string memory winner = "";
        string[] memory tempDrawCandidates = new string[](candidates.length);

        unchecked {
            for (uint256 i = 0; i < candidates.length; i++) {
                uint256 votes = candidateVotes[candidates[i]];
                if (votes > highestVotes) {
                    highestVotes = votes;
                    winner = candidates[i];
                    drawCount = 1;
                    tempDrawCandidates[0] = candidates[i];
                } else if (votes == highestVotes && votes > 0) {
                    tempDrawCandidates[drawCount] = candidates[i];
                    drawCount++;
                }
            }
        }

        isCompleted = true;

        if (highestVotes == 0) {
            revert NoValidWinner();
        }

        if (drawCount == 1) {
            emit WinnerDeclared(winner, highestVotes);
        } else {
            string[] memory drawCandidates = new string[](drawCount);
            for (uint256 i = 0; i < drawCount; i++) {
                drawCandidates[i] = tempDrawCandidates[i];
            }
            emit DrawOccurred(drawCandidates, highestVotes);
        }
    }

    function getResults() external view returns (Candidate[] memory) {
        Candidate[] memory results = new Candidate[](candidates.length);
        uint256 candidatesLength = candidates.length;

        for (uint256 i = 0; i < candidatesLength; i++) {
            results[i] = Candidate(candidates[i], candidateVotes[candidates[i]]);
        }
        return results;
    }

    function getPollDetails()
        external
        view
        returns (string memory, string memory, string[] memory, uint256, uint256, uint256, uint256, address, bool)
    {
        return (pollName, description, candidates, maxVotes, duration, startTime, totalVoters, creator, isCompleted);
    }
}
