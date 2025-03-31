// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {VotingSystemFactory, VotingPoll} from "../src/VotingSystem.sol";

contract VotingSystemScript is Script {
    VotingSystemFactory public factory;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        factory = new VotingSystemFactory();
        console.log("VotingSystemFactory deployed at:", address(factory));

        // Create a poll
        string memory pollName = "Election 2023";
        string[] memory candidates = new string[](3);
        candidates[0] = "Candidate A";
        candidates[1] = "Candidate B";
        candidates[2] = "Candidate C";
        string memory description = "Vote for your favorite candidate!";
        uint256 maxVotes = 10;
        uint256 duration = 1 days;

        factory.createPoll(pollName, candidates, description, maxVotes, duration);
        console.log("Poll created with name:", pollName);

        VotingSystemFactory.PollInfo memory pollInfo = factory.getPoll(0);
        console.log("Poll address:", pollInfo.pollAddress);

        VotingPoll poll = VotingPoll(pollInfo.pollAddress);

        vm.warp(block.timestamp + 1 seconds);

        poll.vote("Candidate A");
        console.log("User voted for Candidate A");

        poll.vote("Candidate B");
        console.log("User voted for Candidate B");

        vm.warp(block.timestamp + duration + 1 seconds);

        poll.chooseWinner();
        console.log("Winner declared!");

        VotingPoll.Candidate[] memory results = poll.getResults();
        for (uint256 i = 0; i < results.length; i++) {
            console.log("Candidate:", results[i].name, "Votes:", results[i].votes);
        }

        vm.stopBroadcast();
    }
}