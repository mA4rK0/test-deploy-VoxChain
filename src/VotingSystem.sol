// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract VotingSystem {
    error InsufficientCandidates(string[] _candidates);
    error AlreadyVoted(address _voter);
    error Ended(uint256 _duration);
    error MaxVotesReached(uint256 _maxVotes);
    error NotDoneYet(uint256 _time);

    event PollCreated(
        address _creator,
        string[] _candidates,
        string _description,
        uint256 _maxVotes,
        uint256 _duration,
        uint256 _startTime,
        uint256 _totalVoters,
        bool _isCompleted
    );
    event Voted(address _voter, string _candidate);

    struct Poll {
        address creator;
        string pollName;
        string[] candidates;
        string description;
        uint256 maxVotes;
        uint256 duration;
        uint256 startTime;
        uint256 totalVoters;
        bool isCompleted;
    }

    Poll poll;
    string public winner;
    mapping(string => uint256) public candidatesVotes;
    mapping(address => bool) public hasVoted;

    function createPoll(
        string calldata _name,
        string[] calldata _candidates,
        string calldata _description,
        uint256 _maxVotes,
        uint256 _duration
    ) external {
        if (_candidates.length <= 0 || _candidates.length > 3) revert InsufficientCandidates(_candidates);

        emit PollCreated(
            msg.sender, _candidates, _description, _maxVotes, _duration, block.timestamp + block.number, 0, false
        );
        for (uint8 i = 0; i < _candidates.length; i++) {
            candidatesVotes[_candidates[i]] = 0;
        }
        poll = Poll(
            msg.sender, _name, _candidates, _description, _maxVotes, _duration, block.timestamp + block.number, 0, false
        );
    }

    function vote(string calldata _candidate) external {
        if (block.timestamp - poll.startTime >= poll.duration) revert Ended(poll.duration);
        if (poll.totalVoters >= poll.maxVotes) revert MaxVotesReached(poll.maxVotes);
        if (hasVoted[msg.sender] == true) revert AlreadyVoted(msg.sender);

        hasVoted[msg.sender] = true;
        emit Voted(msg.sender, _candidate);
        poll.totalVoters++;
        candidatesVotes[_candidate]++;
    }

    function chooseWinner() external {
        if (block.timestamp - poll.startTime < poll.duration) revert NotDoneYet(poll.duration);
        string memory win;

        for (uint8 i = 0; i <= poll.candidates.length; i++) {
            if (i == 0) {
                win = poll.candidates[i];
            } else {
                if (
                    candidatesVotes[poll.candidates[i]] > candidatesVotes[poll.candidates[i + 1]]
                        && candidatesVotes[poll.candidates[i]] > candidatesVotes[poll.candidates[i - 1]]
                ) {
                    win = poll.candidates[i];
                }
            }
        }

        winner = win;
    }
}
