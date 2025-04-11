"use client";
import React, { useEffect, useState } from "react";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import {
  prepareContractCall,
  sendAndConfirmTransaction,
  sendTransaction as sendTx,
} from "thirdweb";
import { client } from "@/lib/client";
import { getContract, readContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { User, User2, UserRoundIcon } from "lucide-react";
import Image from "next/image";
import shortenAddress from "@/utils/shortenAddress";
import Countdown from "react-countdown";
/**
 * PollInfo component renders information related to a poll.
 *
 * @param {Object} props - The properties passed to the component.
 */
interface PollData {
  pollName: string;
  candidates: string[];
  description: string;
  duration: number;
  maxVotes: number;
  startTime: number;
  totalVoters: number;
  isCompleted: boolean;
}

const initialPollData = {
  candidates: [],
  pollName: "",
  description: "",
  duration: 0,
  isCompleted: false,
  maxVotes: 0,
  startTime: 0,
  totalVoters: 0,
};
const PollInfo = (props: { address: string; creator?: string }) => {
  const { address, creator = "" } = props;
  const [pollData, setPollData] = useState<PollData>(initialPollData);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  // state countdown end
  const [countDownEnd, setCountDownEnd] = useState(false);
  const wallet = useActiveAccount();
  const contract = getContract({
    chain: sepolia,
    client: client,
    address: address,
  });

  const {
    mutate: sendTransaction,
    isPending,
    isError,
    error,
    isSuccess,
    data,
  } = useSendAndConfirmTransaction();

  const handleVote = async (_candidate: string) => {
    if (!wallet) return;
    const transaction = prepareContractCall({
      contract,
      method: "function vote(string _candidate)",
      params: [_candidate],
    });
    try {
      const { transactionHash } = await sendTx({
        transaction,
        account: wallet,
      });

      console.log(transactionHash);
    } catch (error) {
      console.log("error vote", error);
    }
  };

  // has Voted contract
  useEffect(() => {
    if (wallet?.address) {
      async function getHasVoted() {
        const data = await readContract({
          contract,
          method: "function hasVoted(address) view returns (bool)",
          params: [wallet?.address || ""],
        });
        setHasVoted(data);
      }
      getHasVoted();
    }
  }, [wallet?.address]);

  // get detail poll
  useEffect(() => {
    async function getDetail() {
      try {
        const getDetailPoll = await readContract({
          contract,
          method:
            "function getPollDetails() view returns (string, string[], string, uint256, uint256, uint256, uint256, address, bool)",
          params: [],
        }).then(
          ([
            pollName,
            candidates,
            description,
            duration,
            maxVotes,
            startTime,
            totalVoters,
            creator,
            isCompleted,
          ]) => ({
            pollName,
            candidates: Array.from(candidates),
            description,
            duration: Number(duration),
            maxVotes: Number(maxVotes),
            startTime: Number(startTime),
            totalVoters: Number(totalVoters),
            isCompleted,
          })
        );
        setPollData(getDetailPoll);
      } catch (error) {
        console.log(error);
      }
    }

    getDetail();
  }, []);

  // useEffect(() => {
  //   if (pollData.startTime === 0 || pollData.duration === 0) return;
  //   const endTime = (pollData.startTime + pollData.duration) * 1000;
  //   if (Date.now() > endTime && !pollData.isCompleted) {
  //     const transaction = prepareContractCall({
  //       contract,
  //       method: "function chooseWinner()",
  //       params: [],
  //     });

  //     sendTransaction(transaction);
  //   }
  // }, [pollData]);

  // console.log("iscompleted", pollData.isCompleted);
  // console.log("choose winner", isSuccess);
  // console.log("error no valid winner", isError);

  // is Completed true
  useEffect(() => {
    if (!wallet) return;
    if (pollData.isCompleted) {
      async function chooseWinner() {
        const transaction = prepareContractCall({
          contract,
          method: "function chooseWinner()",
          params: [],
        });
        try {
          const { transactionHash } = await sendTx({
            transaction,
            account: wallet!,
          });
          console.log("success winner", transactionHash);
        } catch (error) {
          console.log("error choose winner", error);
        }
      }
      chooseWinner();
    }
  }, [pollData.isCompleted]);
  return (
    <div className="font-light text-xl cursor-default">
      <div className="text-center text-[40px] mt-7">
        {pollData.pollName && pollData.pollName}
      </div>
      <div className="mx-auto mt-5 px-2 py-1 w-full  max-w-[956px] h-full min-h-[40.813rem]  xl:max-h-[40.813rem]  bg-purple-dark relative">
        {/* countdown */}
        <div className="absolute top-5 left-8">
          {pollData.startTime > 0 && pollData.duration > 0 && (
            <Countdown
              className=""
              daysInHours={true}
              date={(pollData.startTime + pollData.duration) * 1000}
              renderer={({ completed, hours, minutes, seconds }) => {
                if (completed) {
                  return <span>Voting ended</span>;
                }
                return (
                  <span>
                    {hours.toString().padStart(2, "0")}:
                    {minutes.toString().padStart(2, "0")}:
                    {seconds.toString().padStart(2, "0")}
                  </span>
                );
              }}
            />
          )}
        </div>
        {/* header */}
        <h1 className="text-[#7B7474] flex gap-1 text-center justify-center mt-3">
          <span>Choose only</span>
          <span className="font-semibold">ONE</span>
        </h1>
        {/* candidates */}
        <div className="flex justify-around mt-7">
          {pollData.candidates.map((name, i) => (
            <div
              key={i}
              className="flex flex-col gap-5 justify-center items-center"
            >
              <div>
                {name
                  .split(" ")
                  .map(
                    (kata) =>
                      kata.charAt(0).toUpperCase() + kata.slice(1).toLowerCase()
                  )
                  .join(" ")}
              </div>

              <Image
                src={"/User.png"}
                className=""
                width={90}
                height={90}
                alt="user"
              />

              <button
                className={`  flex px-[2.12rem] py-2 ${
                  isError || hasVoted
                    ? "bg-red-500 cursor-not-allowed"
                    : "bg-[#2D2929] hover:bg-black cursor-pointer"
                } text-white rounded-lg   `}
                onClick={() => handleVote(name)}
                disabled={isError || hasVoted}
              >
                Vote
              </button>
            </div>
          ))}
        </div>
        {/* is already voting or not */}
        <div className="text-[#BD51EC] font-semibold text-2xl mt-5 text-center">
          {hasVoted ? "You already voted once!" : "The choice is yours"}
        </div>
        {/* description */}
        <div className=" mt-5 px-7 pb-4">
          <div className="border-y-[5px] border-white w-full pt-2 pb-10">
            <div className="">Description</div>
            <div className="bg-white text-black p-4 w-full h-[143px] mt-2 mx-auto">
              {pollData.description && pollData.description}
            </div>
          </div>
          <div className="italic text-[#F8F6F9] text-sm mt-4 pl-10">
            Created by : {shortenAddress(creator)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollInfo;
