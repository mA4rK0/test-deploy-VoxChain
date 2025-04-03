import { Search } from "lucide-react";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import CreatePolling from "./CreatePolling";

import usePollingStore from "@/store/store";
import { getContract, prepareContractCall } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { client, CONTRACT_ADDRESS } from "@/lib/client";
import { ABI } from "@/lib/ABI";
import { Abi, AbiFunction } from "thirdweb/utils";
type votingProps = {
  creator: string;
  pollAddress: string;
  pollName: string;
};

const mockData = [{ name: "asoy" }, { name: "uhuy" }];

const VotingComponents = () => {
  const [searchVoting, setSearchVoting] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [votingData, setVotingData] = useState<votingProps[]>([]);
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

  // get voting data
  useEffect(() => {
    console.log(votingData);
    // read contract to get voting
    // fetch
    // set to votingData
  }, [votingData]);

  useEffect(() => {
    if (isLoading) return;
    if (data) {
      setVotingData(data);
    }
  }, [data]);

  return (
    <div className="w-full px-10  mt-20">
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
      {/* voting table */}

      <div className="text-black">
        {isLoading
          ? "laoding..."
          : votingData.map((value, i) => (
              <div key={i}>
                <div>{value.pollName}</div>
                <div>creator: {value.creator}</div>
                <div>pool Address: {value.pollAddress}</div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default VotingComponents;
