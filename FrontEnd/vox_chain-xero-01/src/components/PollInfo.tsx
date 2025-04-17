"use client";
import { prepareContractCall, sendTransaction as sendTx } from "thirdweb";
import { getContract, readContract } from "thirdweb";
import shortenAddress from "@/utils/shortenAddress";
import React, { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { sepolia } from "thirdweb/chains";
import Countdown from "react-countdown";
import { client } from "@/lib/client";
import { Bouncy } from "ldrs/react";
import Image from "next/image";
import { toast } from "sonner";
import "ldrs/react/Bouncy.css";
import { get } from "http";
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
interface EndResult {
  name: string;
  votes: number;
  percent: number;
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

interface PollState {
  isLoading: boolean;
  isEnded: boolean;
  pollData: PollData | null;
  endResult: EndResult[];
  isNoWinner: boolean;
}
const PollInfo = (props: {
  address: string;
  creator: string;
  setCloseModal: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { address, creator, setCloseModal } = props;
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [pollState, setPollState] = useState<PollState>({
    isLoading: true,
    isEnded: false,
    pollData: null,
    endResult: [],
    isNoWinner: false,
  });

  const {
    candidates,
    description,
    duration,
    isCompleted,
    maxVotes,
    pollName,
    totalVoters,
    startTime,
  } = pollState.pollData || initialPollData;
  const position = ["center", "left", "right"] as const;
  const wallet = useActiveAccount();
  const contract = getContract({
    chain: sepolia,
    client: client,
    address: address,
  });
  const handleVote = async (_candidate: string) => {
    if (!wallet) return;
    let toastId;
    toastId = toast.loading("Loading Transaction...");
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
      if (transactionHash) {
        toast.success(`Your vote is success : ${transactionHash}`);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setCloseModal("");
      toast.dismiss(toastId);
    }
  };

  const handleWinner = async () => {
    if (startTime === 0 || duration === 0) return;
    const endTime = (startTime + duration) * 1000;
    if (Date.now() > endTime && !isCompleted) {
      async function durationEnd() {
        if (!wallet) return;
        let toastId;
        toastId = toast.loading("Loading Transaction...");
        const transaction = prepareContractCall({
          contract,
          method: "function chooseWinner()",
          params: [],
        });
        try {
          const data = await sendTx({ transaction, account: wallet });
          toast.success(data.transactionHash);
        } catch (error: any) {
          console.log(error);
          toast.error(error.message);
        } finally {
          toast.dismiss(toastId);
        }
      }
      durationEnd();
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
        // Start loading
        setPollState((prev) => ({ ...prev, isLoading: true }));

        // Get poll details
        const rawDetails = await readContract({
          contract,
          method:
            "function getPollDetails() view returns (string, string[], string, uint256, uint256, uint256, uint256, address, bool)",
          params: [],
        });

        const [
          pollName,
          candidates,
          description,
          duration,
          maxVotes,
          startTime,
          totalVoters,
          creator,
          isCompleted,
        ] = rawDetails;

        const getDetailPoll = {
          pollName,
          description,
          candidates: candidates.filter((c) => c !== ""),
          duration: Number(duration),
          maxVotes: Number(maxVotes),
          startTime: Number(startTime),
          totalVoters: Number(totalVoters),
          creator,
          isCompleted,
        };

        let endResult: EndResult[] = [];
        let isNoWinner = false;

        // If poll is completed, get results
        if (getDetailPoll.isCompleted) {
          try {
            const [getResult, noWinner] = await Promise.all([
              readContract({
                contract,
                method:
                  "function getResults() view returns ((string name, uint256 votes)[])",
                params: [],
              }),
              readContract({
                contract,
                method: "function isNoWinner() view returns (bool)",
                params: [],
              }),
            ]);

            endResult = getResult
              .filter((item) => item.name !== "")
              .map((item) => ({
                name: item.name,
                votes: Number(item.votes),
                percent:
                  getDetailPoll.totalVoters === 0
                    ? 0
                    : (Number(item.votes) / getDetailPoll.totalVoters) * 100,
              }))
              .sort((a, b) => b.votes - a.votes);

            isNoWinner = noWinner;
          } catch (error) {
            console.error("Failed to get results:", error);
          }
        }

        // Check if poll ended
        const endTime =
          (getDetailPoll.startTime + getDetailPoll.duration) * 1000;
        const hasEnded =
          Date.now() > endTime ||
          getDetailPoll.totalVoters >= getDetailPoll.maxVotes;

        // Update all at once
        setPollState({
          isLoading: false,
          pollData: getDetailPoll,
          isEnded: hasEnded,
          endResult,
          isNoWinner,
        });
      } catch (error) {
        console.error("Failed to fetch poll data:", error);
        setPollState((prev) => ({ ...prev, isLoading: false }));
      }
    }

    getDetail();
  }, []);

  return (
    <div className="font-light text-xl cursor-default">
      <div
        className={`text-center text-2xl md:text-3xl xl:text-[40px] mt-14  xl:mt-7 `}
      >
        {pollName && pollName}
      </div>

      <div className="mx-auto mt-5 px-2 py-1 w-full   max-w-[956px]    h-full min-h-[40.813rem]  xl:max-h-[40.813rem]  bg-purple-dark relative">
        {pollState.isLoading ? (
          <Loader />
        ) : (
          <>
            {/* countdown */}
            <CountsDown duration={duration} startTime={startTime} />
            {/* header */}
            <Header
              isCompleted={isCompleted}
              isNoWinner={pollState.isNoWinner}
            />
            {/* candidates */}
            <div className="mt-7">
              {!isCompleted ? (
                // voting
                <div className="flex justify-around">
                  {candidates.map((name, i) => {
                    const formattedName = name
                      .split(" ")
                      .map(
                        (kata) =>
                          kata.charAt(0).toUpperCase() +
                          kata.slice(1).toLowerCase()
                      )
                      .join(" ");

                    const isDisabled = pollState.isEnded || hasVoted;
                    const buttonClass = isDisabled
                      ? "bg-red-500 cursor-not-allowed"
                      : "bg-[#2D2929] hover:bg-black cursor-pointer";

                    return (
                      <div
                        key={i}
                        className="flex flex-col gap-5 justify-center items-center"
                      >
                        <div className="text-sm sm:text-2xl">
                          {formattedName}
                        </div>

                        <Image
                          src="/User.png"
                          width={90}
                          height={90}
                          alt="user"
                        />

                        <button
                          className={`flex text-xs sm:text-xl px-[2.12rem] py-2 text-white rounded-lg ${buttonClass}`}
                          onClick={() => handleVote(name)}
                          disabled={isDisabled}
                        >
                          Vote
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : pollState.isNoWinner ? (
                <div className={`flex  justify-around`}>
                  {pollState.endResult.map((item, i) => (
                    <CandidateCard data={item} position="default" key={i} />
                  ))}
                </div>
              ) : (
                pollState.endResult.length > 0 && (
                  // candidate card
                  <div className="flex justify-around">
                    {pollState.endResult.map((item, i) => (
                      <CandidateCard
                        data={item}
                        position={position[i] ?? "default"}
                        key={i}
                      />
                    ))}
                  </div>
                )
              )}
            </div>

            {/* is already voting or not */}
            <div className="text-[#BD51EC] font-semibold text-2xl mt-5 text-center flex flex-col items-center gap-3">
              <span>
                {hasVoted && !pollState.isEnded
                  ? "You already voted once!"
                  : (hasVoted && pollState.isEnded) ||
                    (!hasVoted && pollState.isEnded)
                  ? "voting already end"
                  : "The choice is yours"}
              </span>
              {(pollState.isEnded && !isCompleted) ||
              (totalVoters >= maxVotes && !isCompleted) ? (
                <button
                  className="w-fit bg-red-500 hover:bg-red-600 text-white font-light text-md px-3 py-1 rounded-md cursor-pointer"
                  onClick={handleWinner}
                >
                  check the winner
                </button>
              ) : null}
            </div>

            {/* description */}
            <div className=" mt-5 px-7 pb-4">
              <div className="border-y-[5px] border-white w-full pt-2 pb-10">
                <div className="">Description</div>
                <div className="bg-white text-black p-4 w-full h-[143px] mt-2 mx-auto">
                  {description && description}
                </div>
              </div>
              <div className="italic text-[#F8F6F9] text-sm mt-4 pl-10">
                Created by : {shortenAddress(creator)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PollInfo;

const CandidateCard = ({
  data,
  position,
}: {
  data: EndResult;
  position: "left" | "center" | "right" | "default";
}) => {
  const name = data.name
    .split(" ")
    .map((kata) => kata.charAt(0).toUpperCase() + kata.slice(1).toLowerCase())
    .join(" ");
  const positionStyles = {
    left: "order-1",
    center: "order-2",
    right: "order-3",
    default: "",
  };

  return (
    <div
      className={`flex flex-col gap-5 justify-center items-center ${positionStyles[position]}`}
    >
      <div className={`${position == "center" ? "font-semibold" : ""}`}>
        {name}
      </div>
      <Image
        src="/User.png"
        width={position === "center" ? 110 : 90}
        height={position === "center" ? 110 : 90}
        alt="user"
      />
      <div className={`${position == "center" ? "font-semibold" : ""}`}>
        {data.percent.toFixed(2)}%
      </div>
    </div>
  );
};

const Header = (props: { isCompleted: boolean; isNoWinner: boolean }) => {
  const { isCompleted, isNoWinner } = props;
  return (
    <div className="mt-10 xl:mt-3">
      {isCompleted ? (
        isNoWinner ? (
          <h1 className="text-[#BD51EC] text-center text-4xl font-semibold ">
            Draw
          </h1>
        ) : (
          <h1 className="text-[#BD51EC] text-center text-4xl font-semibold ">
            Winner
          </h1>
        )
      ) : (
        <h1 className="text-[#7B7474] flex gap-1 text-center justify-center">
          <span>Choose only</span>
          <span className="font-semibold">ONE</span>
        </h1>
      )}
    </div>
  );
};

const CountsDown = (props: { startTime: number; duration: number }) => {
  const { startTime, duration } = props;
  return (
    <div className="absolute top-2 sm:top-5 left-8">
      {startTime > 0 && duration > 0 && (
        <Countdown
          className=""
          daysInHours={true}
          date={(startTime + duration) * 1000}
          renderer={({ completed, hours, minutes, seconds }) => {
            if (completed) {
              return (
                <span className="text-xs bg-black rounded-full px-2 py-1">
                  Voting ended
                </span>
              );
            }
            return (
              <span className="flex items-center gap-1 bg-black rounded-full px-1">
                <Image
                  width={26}
                  height={26}
                  src={"/TimeIcon.png"}
                  alt="time icon"
                />
                <span className="text-sm">
                  {hours.toString().padStart(2, "0")}:
                  {minutes.toString().padStart(2, "0")}:
                  {seconds.toString().padStart(2, "0")}
                </span>
              </span>
            );
          }}
        />
      )}
    </div>
  );
};

const Loader = () => (
  <div className="w-full flex flex-col items-center justify-center gap-10  mt-52">
    <Bouncy size="100" speed="1.75" color="white" />
    <div className={""}>
      Loading<span className="dots"></span>
    </div>
  </div>
);
