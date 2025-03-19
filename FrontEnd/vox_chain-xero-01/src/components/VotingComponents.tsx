import { Circle, Search, X } from "lucide-react";
import React, { ChangeEventHandler, useEffect, useState } from "react";
type votingProps = {
  name: string;
};

const mockData = [{ name: "asoy" }, { name: "uhuy" }];
const VotingComponents = () => {
  const [searchVoting, setSearchVoting] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [votingData, setVotingData] = useState<votingProps[]>(mockData);
  const [index, setIndex] = useState<number>(0);
  const [pollingName, setPollingName] = useState<string>("");

  function validateSanitizeInput(name: string) {
    const dangerousPattern = /<script.*?>|<\/script>|<.*?on\w+=.*?>/gi;
    if (dangerousPattern.test(name)) {
      return { valid: false, message: "Input contains forbidden characters!" };
    }
    return { valid: true, message: "Valid input." };
  }

  function validationPollingName(name: string) {
    const maxCharacter = 100;
    const minCharacter = 6;
    if (name.length < minCharacter) {
      return { valid: false, message: "min character is 6" };
    }
    if (name.length > maxCharacter) {
      return { valid: false, message: "max character is 100" };
    }
    // Validasi sanitasi input
    const sanitizeResult = validateSanitizeInput(name);
    if (!sanitizeResult.valid) {
      return sanitizeResult; // Langsung return object hasil sanitasi
    }
    return { valid: true, message: "valid input" };
  }
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

  const handlePollingName: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
  };

  const handleNext = () => {};

  // get voting data
  useEffect(() => {
    console.log(votingData);
    // read contract to get voting
    // fetch
    // set to votingData
  }, [votingData]);

  return (
    <div className="w-full px-10  mt-20">
      {/* modal create voting */}
      {isOpen && (
        <div className="inset-0 absolute w-full h-screen flex flex-col justify-center items-center px-7 lg:px-0">
          <div className="bg-black opacity-55 absolute inset-0 "></div>
          <div className="max-w-[28.875rem] sm:max-h-[17.063rem] max-h-[15rem]   w-full h-full bg-purple-light z-10 relative">
            {/* close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-6 text-sm  bg-white flex gap-1  rounded-md px-2 cursor-pointer text-black hover:text-white hover:bg-[#F44C4C] transition-all"
            >
              Close <X size={20} />
            </button>
            {/* pagination */}
            <div className="flex w-fuil gap-2 justify-center items-center  mt-4">
              <Circle size={16} fill={index == 0 ? "#03D5FF" : "white"} />
              <Circle size={16} fill={index == 1 ? "#03D5FF" : "white"} />
              <Circle size={16} fill={index == 2 ? "#03D5FF" : "white"} />
            </div>
            {/* main  */}
            <div className="w-[21.5rem] h-[10.438rem] px-14 flex flex-col  items-center  bg-purple-dark mx-auto mt-5 text-white">
              <h1 className="text-2xl font-bold mt-3">
                {index == 0
                  ? "Polling Name"
                  : index == 1
                  ? "Add Candidates"
                  : index == 2
                  ? "Description"
                  : ""}
              </h1>
              <input
                type="text"
                placeholder="type polling name"
                onChange={handlePollingName}
                className="mt-7 text-white  font-light text-center outline-0 "
              />
              <hr className="h-1.5  bg-white w-full mt-11" />
            </div>
            {/* next button */}
            <button
              onClick={handleNext}
              className="bg-white mx-auto block px-10 mt-5 rounded-md hover:bg-purple-dark hover:text-white transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
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
      <div></div>
    </div>
  );
};

export default VotingComponents;
