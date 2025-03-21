// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract VotingSystem {
    error InsufficientCandidates(string[] _candidates);

    struct Poll {
        address creator;
        string pollName;
        string[] candidates;
        string description;
        uint256 maxVotes;
        uint256 duration;
    }

    uint256 ID = 0;
    mapping(uint256 => Poll) polls;

    function createPoll(
        string calldata _name,
        string[] calldata _candidates,
        string calldata _description,
        uint256 _maxVotes,
        uint256 _duration
    ) external {
        if (_candidates.length <= 0 || _candidates.length > 3) {
            revert InsufficientCandidates(_candidates);
        }
        Poll memory poll = Poll(msg.sender, _name, _candidates, _description, _maxVotes, _duration);
        ID++;
        polls[ID] = poll;
    }
}
