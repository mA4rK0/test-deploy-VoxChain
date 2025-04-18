import { Circle, X } from "lucide-react";
import React, {
  ChangeEventHandler,
  Dispatch,
  useEffect,
  useRef,
  useState,
} from "react";

import { toast } from "sonner";
import { DataCreatePolling, ITimes } from "@/lib/types";
import { prepareContractCall } from "thirdweb";
import { contract } from "@/lib/client";
import { useActiveAccount } from "thirdweb/react";
import { sendAndConfirmTransaction as sendTx } from "thirdweb";
import BackgroundOpacity from "./BackgroundOpacity";

import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
type CreateProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
};

const CreatePolling = (props: CreateProps) => {
  const { isOpen, setIsOpen } = props;
  const headerCreatePolling = ["Polling Name", "Add Candidates", "Description"];
  const account = useActiveAccount();
  const [index, setIndex] = useState<number>(0);
  const [countdownTarget, setCountdownTarget] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataPolling, setDataPolling] = useState<DataCreatePolling>({
    candidate1: "",
    candidate2: "",
    candidate3: "",
    description: "",
    duration: 0,
    maxVotes: 0,
    namePolling: "",
    isCompleted: false,
  });
  const [times, setTimes] = useState<ITimes>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // smart contract

  const handleStart = () => {
    const totalSeconds =
      (times.hours ?? 0) * 3600 +
      (times.minutes ?? 0) * 60 +
      (times.seconds ?? 0);
    if (totalSeconds === 0) {
      setCountdownTarget(0);
      setDataPolling({ ...dataPolling, duration: 0 });
      return;
    }
    const targetTime = Date.now() + totalSeconds * 1000; // converts to milisecond

    setDataPolling({ ...dataPolling, duration: totalSeconds });
    setCountdownTarget(targetTime);
  };

  const handleChangeDuration: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    const id = target.id as keyof ITimes;
    const value = target.value;

    const duration = parseInt(value);
    if (isNaN(duration)) {
      setTimes({ ...times, [id]: "" });
      return;
    }

    const maxValues = { hours: 48, minutes: 59, seconds: 59 };
    console.log(duration);
    // ❌ Tolak jika melebihi batas atau kurang dari 0
    if (duration < 0 || duration > maxValues[id]) {
      return;
    }
    setTimes({ ...times, [id]: Math.abs(duration) });
  };

  useEffect(() => {
    handleStart();
  }, [times]);

  const handleNext = () => {
    if (index == 0) {
      setIndex(1);
      return;
    } else if (index == 1) {
      setIndex(2);
      return;
    } else if (index == 2) {
      console.log(countdownTarget);
      return;
    }
  };
  function validation(data: DataCreatePolling) {
    const namePolling = data.namePolling;
    let error = [];
    if (namePolling.length < 6 || namePolling.length > 100) {
      error.push("name polling below 6 or above 100 character");
    }
    if (data.candidate1.length > 0 && data.candidate2.length > 0) {
    } else {
      error.push("candidate minimal 2");
    }
    if (data.duration <= 0) {
      error.push("duration must greather than 0");
    }
    if (data.maxVotes <= 2) {
      error.push("minimal vote is 3");
    }

    return { error, isError: error.length > 0 ? true : false };
  }
  const handleSubmit = async () => {
    if (!account) return;
    let toastId;
    const isValid = validation(dataPolling);
    if (isValid.isError) {
      toast.error(isValid.error[0], { position: "top-center" });
      return;
    }
    setIsLoading(true);
    toastId = toast.loading("Processing transaction...");
    const candidates: string[] = [
      dataPolling.candidate1,
      dataPolling.candidate2,
      dataPolling.candidate3 || "",
    ];
    const transaction = prepareContractCall({
      contract,
      params: [
        dataPolling.namePolling,
        candidates,
        dataPolling.description,
        BigInt(dataPolling.maxVotes),
        BigInt(dataPolling.duration),
      ],
      method:
        "function createPoll(string _pollName, string[] _candidates, string _description, uint256 _maxVotes, uint256 _duration)",
    });

    try {
      const { transactionHash } = await sendTx({ transaction, account });
      if (transactionHash) {
        toast.success(`Transaction Successful: ${transactionHash}`);
        setIsOpen(false);
        setIndex(0);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      toast.dismiss(toastId);
      setIsLoading(false);
    }
  };
  const handleDataPolling: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    setDataPolling({ ...dataPolling, [target.id]: target.value });
  };

  return (
    <>
      {isOpen && (
        <div className="inset-0 fixed w-full h-screen flex flex-col justify-center items-center px-7 lg:px-0 z-10">
          <BackgroundOpacity />
          <div className="max-w-[32rem] max-h-[21rem]   w-full h-full bg-purple-light z-10 relative">
            {/* close button */}
            <button
              onClick={() => {
                setIsOpen(false);
                setIndex(0);
              }}
              className="absolute top-4 right-6 text-sm  bg-white flex gap-1  rounded-md px-2 cursor-pointer text-black hover:text-white hover:bg-[#F44C4C] transition-all"
            >
              Close <X size={20} />
            </button>
            {/* pagination */}
            <div className="flex w-fuil gap-2 justify-center items-center  mt-4">
              <Circle
                onClick={() => setIndex(0)}
                className="cursor-pointer"
                size={16}
                fill={index == 0 ? "#03D5FF" : "white"}
              />
              <Circle
                className="cursor-pointer"
                onClick={() => setIndex(1)}
                size={16}
                fill={index == 1 ? "#03D5FF" : "white"}
              />
              <Circle
                className="cursor-pointer"
                onClick={() => setIndex(2)}
                size={16}
                fill={index == 2 ? "#03D5FF" : "white"}
              />
            </div>
            {/* main  */}
            <div className="px-3">
              <div className="w-full max-w-[25rem] h-[235px] px-2 flex flex-col  items-center  bg-purple-dark mx-auto mt-5 text-white">
                <h1
                  className={`
                     text-2xl
                   font-bold mt-3`}
                >
                  {headerCreatePolling[index]}
                </h1>

                <div className="">
                  {index == 0 ? (
                    // name polling
                    <input
                      type="text"
                      placeholder="type polling name"
                      onChange={handleDataPolling}
                      value={dataPolling.namePolling}
                      id="namePolling"
                      name="namePolling"
                      className="mt-12 text-lg md:text-xl xl:text-2xl text-white font-light text-center outline-0 "
                    />
                  ) : index == 1 ? (
                    // candidates
                    <div className="ml-20 flex flex-col gap-3 mt-1   sm:mt-3  ">
                      <label htmlFor="candidate1" className="flex gap-2">
                        <span className={``}>1.</span>
                        <input
                          className=" text-white font-light  outline-0 w-full "
                          onChange={handleDataPolling}
                          id="candidate1"
                          value={dataPolling.candidate1}
                          type="text"
                          placeholder=" candidate 1"
                        />
                      </label>
                      <label htmlFor="candidate2" className="flex gap-2">
                        <span>2.</span>
                        <input
                          className=" text-white  font-light  outline-0 w-full "
                          id="candidate2"
                          value={dataPolling.candidate2}
                          onChange={handleDataPolling}
                          type="text"
                          placeholder="candidate 2"
                        />
                      </label>
                      <label htmlFor="candidate3" className="flex gap-2">
                        <span>3. </span>
                        <input
                          className=" text-white  font-light  outline-0 w-full "
                          id="candidate3"
                          value={dataPolling.candidate3}
                          onChange={handleDataPolling}
                          type="text"
                          placeholder="candidate 3"
                        />
                      </label>
                    </div>
                  ) : (
                    // description polling
                    <div className="w-full flex flex-col justify-center items-center">
                      <textarea
                        placeholder="Description polling"
                        onChange={(e) =>
                          setDataPolling({
                            ...dataPolling,
                            [e.target.id]: e.target.value,
                          })
                        }
                        value={dataPolling.description}
                        id="description"
                        cols={30}
                        rows={3}
                        className="  text-black  font-light px-1 mt-2 outline-0 bg-white resize-none rounded-md"
                      />
                      {/* Duration */}
                      <div className="mt-3 px-0 md:px-9">
                        <div className="grid grid-cols-[1fr_1px_1fr] gap-3   border-t-4 border-white  ">
                          <MaxVotes
                            handleDataPolling={handleDataPolling}
                            dataPolling={dataPolling}
                          />
                          <Divider />
                          <Duration
                            times={times}
                            handleChangeDuration={handleChangeDuration}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className={`w-full ${index == 2 ? "hidden" : "block"} `}>
                  <hr
                    className={`h-1.5  bg-white mx-auto w-full max-w-[20rem] ${
                      index == 1 ? "mt-6" : "mt-14"
                    } `}
                  />
                </div>
              </div>
            </div>
            {/* next button */}

            {index == 2 && (
              <button
                type={"submit"}
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-white mx-auto block px-10 mt-3 rounded-md hover:bg-purple-dark hover:text-white transition-all cursor-pointer relative"
              >
                {isLoading ? (
                  <Ring
                    size="10"
                    stroke="1"
                    bgOpacity="0"
                    speed="2"
                    color="black"
                  />
                ) : (
                  "Done"
                )}
              </button>
            )}

            {index !== 2 && (
              <button
                type={"button"}
                onClick={handleNext}
                className="bg-white mx-auto block px-10 mt-3 rounded-md hover:bg-purple-dark hover:text-white transition-all cursor-pointer"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const Divider = () => {
  return <div className="h-full bg-white w-1 "></div>;
};

const MaxVotes = (props: {
  handleDataPolling: ChangeEventHandler<HTMLInputElement>;
  dataPolling: DataCreatePolling;
}) => {
  const { handleDataPolling, dataPolling } = props;

  return (
    <div className="flex-1 mt-2 ">
      <h2 className="text-center font-bold">Max Votes</h2>
      <input
        type="number"
        placeholder="0"
        id="maxVotes"
        onChange={handleDataPolling}
        value={dataPolling.maxVotes}
        className="w-full text-center outline-0 "
      />
    </div>
  );
};

type DurationProps = {
  times: ITimes;
  handleChangeDuration: ChangeEventHandler<HTMLInputElement>;
};
const Duration = (props: DurationProps) => {
  const { handleChangeDuration, times } = props;

  return (
    <div className=" mt-2 relative  flex-1">
      <h2 className="text-center font-bold">Duration</h2>
      <div className="flex gap-1 justify-center font-light">
        <label htmlFor="hours" className="flex ">
          <input
            min={0}
            max={48}
            type="number"
            id="hours"
            placeholder="00"
            value={times.hours != undefined ? times.hours : undefined}
            onChange={handleChangeDuration}
            className="outline-0 w-6 countdown   text-center"
          />
          h
        </label>
        <div>:</div>
        <label htmlFor="minutes" className="flex  ">
          <input
            min={0}
            max={59}
            type="number"
            id="minutes"
            placeholder="00"
            value={times.minutes !== undefined ? times.minutes : ""}
            onChange={handleChangeDuration}
            className="outline-0 w-6 countdown text-center"
          />
          m
        </label>
        <div>:</div>
        <label htmlFor="seconds" className="flex ">
          <input
            min={0}
            max={59}
            type="number"
            id="seconds"
            placeholder="00"
            value={times.seconds !== undefined ? times.seconds : ""}
            onChange={handleChangeDuration}
            className="outline-0 w-6 countdown text-center"
          />
          s
        </label>
      </div>
      <span className="absolute sm:-bottom-9 sm:-right-1 -bottom-8 -right-0   text-white text-[0.6rem] whitespace-nowrap text-nowrap">
        {"*) max duration is 48h 59m 59s "}
      </span>
    </div>
  );
};

export default CreatePolling;
