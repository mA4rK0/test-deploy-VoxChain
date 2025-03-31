// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {VotingSystemFactory, VotingPoll} from "../src/VotingSystem.sol";

contract VotingSystemFactoryTest is Test {
    VotingSystemFactory public factory;
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    function setUp() public {
        factory = new VotingSystemFactory();
    }

    function test_Create_Poll() public {
        string memory pollName = "Election 2023";
        string[] memory candidates = new string[](3);
        candidates[0] = "Candidate A";
        candidates[1] = "Candidate B";
        candidates[2] = "Candidate C";
        string memory description = "Vote for your favorite candidate!";
        uint256 maxVotes = 10;
        uint256 duration = 1 days;

        vm.prank(user1);
        factory.createPoll(pollName, candidates, description, maxVotes, duration);

        uint256 totalPolls = factory.getTotalPolls();
        assertEq(totalPolls, 1, "Total polls should be 1");

        VotingSystemFactory.PollInfo memory pollInfo = factory.getPoll(0);
        assertEq(pollInfo.pollName, pollName, "Poll name mismatch");
        assertEq(pollInfo.creator, user1, "Creator address mismatch");
    }

    function test_Vote_And_Choose_Winner() public {
        string memory pollName = "Election 2023";
        string[] memory candidates = new string[](2);
        candidates[0] = "Candidate A";
        candidates[1] = "Candidate B";
        string memory description = "Vote for your favorite candidate!";
        uint256 maxVotes = 5;
        uint256 duration = 1 days;

        vm.prank(user1);
        factory.createPoll(pollName, candidates, description, maxVotes, duration);

        VotingSystemFactory.PollInfo memory pollInfo = factory.getPoll(0);
        VotingPoll poll = VotingPoll(pollInfo.pollAddress);

        vm.warp(block.timestamp + 1 seconds);

        vm.prank(user1);
        poll.vote("Candidate A");

        vm.prank(user2);
        poll.vote("Candidate B");

        vm.expectRevert(abi.encodeWithSelector(VotingPoll.AlreadyVoted.selector, user1));
        vm.prank(user1);
        poll.vote("Candidate B");

        vm.warp(block.timestamp + duration + 1 seconds);

        vm.prank(user1);
        poll.chooseWinner();

        VotingPoll.Candidate[] memory results = poll.getResults();
        assertEq(results[0].name, "Candidate A", "Candidate A name mismatch");
        assertEq(results[0].votes, 1, "Candidate A votes mismatch");
        assertEq(results[1].name, "Candidate B", "Candidate B name mismatch");
        assertEq(results[1].votes, 1, "Candidate B votes mismatch");
    }

    function test_Insufficient_Candidates() public {
        string memory pollName = "Invalid Poll";
        string[] memory candidates = new string[](1);
        candidates[0] = "Candidate A";
        string memory description = "Invalid poll with insufficient candidates";
        uint256 maxVotes = 10;
        uint256 duration = 1 days;

        vm.expectRevert(abi.encodeWithSelector(VotingPoll.InsufficientCandidates.selector, candidates));
        vm.prank(user1);
        factory.createPoll(pollName, candidates, description, maxVotes, duration);
    }

    function test_MaxVotes_Reached() public {
        string memory pollName = "Max Votes Test";
        string[] memory candidates = new string[](2);
        candidates[0] = "Candidate A";
        candidates[1] = "Candidate B";
        string memory description = "Test max votes limit";
        uint256 maxVotes = 1;
        uint256 duration = 1 days;

        vm.prank(user1);
        factory.createPoll(pollName, candidates, description, maxVotes, duration);

        VotingSystemFactory.PollInfo memory pollInfo = factory.getPoll(0);
        VotingPoll poll = VotingPoll(pollInfo.pollAddress);

        vm.warp(block.timestamp + 1 seconds);

        vm.prank(user1);
        poll.vote("Candidate A");

        vm.expectRevert(VotingPoll.MaxVotesReached.selector, 0);
        vm.prank(user2);
        poll.vote("Candidate B");
    }
}