import { Circle, Copy, CopyCheck, Search, Users } from "lucide-react";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import CreatePolling from "./CreatePolling";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import { client, CONTRACT_ADDRESS } from "@/lib/client";
import { ABI } from "@/lib/ABI";
import shortenAddress from "@/utils/shortenAddress";
import copyToClipboard from "@/utils/copyPaste";
import Link from "next/link";
type votingProps = {
  creator: string;
  pollAddress: string;
  pollName: string;
};

const mockData = [{ name: "asoy" }, { name: "uhuy" }];

const VotingComponents = () => {
  const [searchVoting, setSearchVoting] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<string>();
  const [isHover, setIsHover] = useState<string>();
  const [votingData, setVotingData] = useState<votingProps[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const contract = getContract({
    address: CONTRACT_ADDRESS,
    chain: sepolia,
    client,
    abi: ABI,
  });

  const { data, isError, isLoading } = useReadContract({
    contract,
    method: "getAllPolls",
    params: [0],
  });

  const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    setSearchVoting(target.value);
    const sliceData = mockData?.slice();
    setVotingData(
      sliceData?.filter((item) =>
        item.name.toLowerCase().includes(target.value)
      )
    );
  };

  const handleCopy = async (value: string) => {
    try {
      await copyToClipboard(value);
      setIsCopied(value);
      setTimeout(() => {
        setIsCopied("");
        setIsHover("");
      }, 500);
    } catch (error) {
      console.log("Clipboard API not supported");
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (data) {
      setVotingData(data);
    }
  }, [data]);

  return (
    <div className="w-full px-10  mt-20 font-inter">
      {/* modal create voting */}
      <CreatePolling isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* search and create voting */}
      <div className="flex sm:flex-row flex-col gap-y-5 items-center sm:justify-between mx-auto">
        {/* search */}
        <div className="flex-1 flex justify-center gap-6 items-center  px-10">
          <label
            htmlFor="search-voting"
            className="bg-gray-custom p-1 rounded-full inline-block cursor-pointer "
          >
            <Search size={25} color="white" />
          </label>
          <div className="max-w-[753px] w-full bg-gray-custom rounded-full px-1 py-1">
            <input
              value={searchVoting}
              onChange={handleSearch}
              id={"search-voting"}
              type="text"
              className="h-full w-full text-white px-3 outline-none "
            />
          </div>
        </div>
        {/* create voting */}
        <button
          onClick={() => setIsOpen((open) => !open)}
          className="w-[8.813rem] h-[2.125rem] bg-purple-light hover:bg-purple-700 cursor-pointer flex justify-center items-center text-white rounded-md"
        >
          + Create Voting
        </button>
      </div>
      {/* voting data */}
      <div className="container mx-auto ">
        <div className="text-white grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-3 mt-20">
          {isLoading
            ? "laoding..."
            : votingData.map((value, i) => (
                <div
                  key={i}
                  className="w-full max-w-[18.75rem] h-[11.625rem] flex justify-center items-center  px-4 py-4 rounded-2xl relative bg-purple-dark"
                >
                  {/* progress icon */}
                  <div className="bg-[#4A148C] rounded-full flex justify-center items-center gap-1 w-fit px-3 py-1 absolute top-4 left-3">
                    <div className=" bg-yellow-400  animate-pulse  size-3.5 border-1 border-black rounded-full" />
                    <p className="text-sm">
                      {isCompleted ? "Completed" : "In Progress"}
                    </p>
                  </div>
                  {/* header */}
                  <div className="text-center">{value.pollName}</div>
                  {/* max participants */}
                  <div className="absolute bottom-3 pr-7 pl-5 flex justify-between w-full">
                    <div className="flex gap-2 cursor-pointer relative">
                      {isHover == value.pollAddress && (
                        <div className="absolute -top-7 bg-black px-2 text-xs rounded-sm">
                          Copied me !
                        </div>
                      )}
                      {isCopied == value.pollAddress ? (
                        <CopyCheck />
                      ) : (
                        <Copy
                          onClick={() => handleCopy(value.pollAddress)}
                          onMouseEnter={() => setIsHover(value.pollAddress)}
                          onMouseLeave={() => setIsHover("")}
                        />
                      )}
                      <Link
                        target="_blank"
                        href={`https://sepolia.etherscan.io/address/${value.pollAddress}`}
                        className="hover:underline"
                      >
                        {shortenAddress(value.pollAddress)}
                      </Link>
                      {/*  */}
                    </div>
                    <div className="flex gap-2">
                      <Users fill="white" />
                      100
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default VotingComponents;
