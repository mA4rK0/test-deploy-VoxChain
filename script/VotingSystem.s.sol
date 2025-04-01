// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {VotingSystemFactory} from "../src/VotingSystem.sol";

contract VotingSystemScript is Script {
    VotingSystemFactory public factory;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        factory = new VotingSystemFactory();
        console.log("VotingSystemFactory deployed at:", address(factory));

        vm.stopBroadcast();
    }
}
