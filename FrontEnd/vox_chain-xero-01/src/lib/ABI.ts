import { ContractOptions } from "thirdweb";
import { Abi, AbiFunction } from "thirdweb/utils";
export const ABI: Abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "IndexOutOfBounds",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "pollAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "string",
        name: "pollName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "PollCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_pollName",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "_candidates",
        type: "string[]",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_maxVotes",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_duration",
        type: "uint256",
      },
    ],
    name: "createPoll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllPolls",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "pollAddress",
            type: "address",
          },
          {
            internalType: "string",
            name: "pollName",
            type: "string",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
        ],
        internalType: "struct VotingSystemFactory.PollInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getPoll",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "pollAddress",
            type: "address",
          },
          {
            internalType: "string",
            name: "pollName",
            type: "string",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
        ],
        internalType: "struct VotingSystemFactory.PollInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalPolls",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isPoll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
