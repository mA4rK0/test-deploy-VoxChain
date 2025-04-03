import { Circle, X } from "lucide-react";
import React, {
  ChangeEventHandler,
  Dispatch,
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";
import Countdown from "react-countdown";
import Duration from "./Duration";
import { DataCreatePolling, ITimes } from "@/lib/types";
import usePollingStore from "@/store/store";
import { ContractOptions, getContract, prepareContractCall } from "thirdweb";
import { client, CONTRACT_ADDRESS } from "@/lib/client";
import { ABI } from "@/lib/ABI";
import { sepolia } from "thirdweb/chains";
import { Abi } from "thirdweb/utils";
import { useSendTransaction } from "thirdweb/react";
type CreateProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
};

const CreatePolling = (props: CreateProps) => {
  const { isOpen, setIsOpen } = props;
  const headerCreatePolling = ["Polling Name", "Add Candidates", "Description"];
  const [index, setIndex] = useState<number>(0);
  const [countdownTarget, setCountdownTarget] = useState<number | null>(null);
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
  const [loadingToastId, setLoadingToastId] = useState<string | null | number>(
    null
  );

  const [currentTxId, setCurrentTxId] = useState<number | null>(null); // Buat ID unik tiap transaksi
  // smart contract
  const {
    mutate: sendTransaction,
    isPending: pendingTransaction,
    error: errorTransaction,
    data: transactionResult,
    isSuccess,
  } = useSendTransaction();
  const contract = getContract({
    address: CONTRACT_ADDRESS,
    chain: sepolia,
    client: client,
    abi: ABI,
  });

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

    setDataPolling({ ...dataPolling, duration: targetTime });
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
    const isValid = validation(dataPolling);
    if (isValid.isError) {
      toast.error(isValid.error[0], { position: "top-center" });
      return;
    }

    const candidates = [
      dataPolling.candidate1,
      dataPolling.candidate2,
      dataPolling.candidate3,
    ];
    const transaction = prepareContractCall({
      contract,
      params: [
        dataPolling.namePolling,
        candidates,
        dataPolling.description,
        dataPolling.maxVotes,
        dataPolling.duration,
      ],
      method: "createPoll",
    });
    sendTransaction(transaction);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIndex(0);
  };

  const handleDataPolling: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    setDataPolling({ ...dataPolling, [target.id]: target.value });
  };

  // notification transaction
  useEffect(() => {
    if (pendingTransaction) {
      const txId = Date.now(); // ID unik tiap transaksi
      setCurrentTxId(txId);
      const id = toast.loading("Loading transaction...");
      return () => {
        toast.dismiss(id);
      };
    }
  }, [pendingTransaction]);

  useEffect(() => {
    if (errorTransaction && currentTxId) {
      toast.error(`Transaction failed: ${errorTransaction.message}`);
    }
  }, [errorTransaction, currentTxId]);

  useEffect(() => {
    if (isSuccess && transactionResult?.transactionHash) {
      toast.success(
        `Transaction Successful: ${transactionResult.transactionHash}`
      );
      setIsOpen(false);
      setIndex(0);
      // **Pastikan hanya dismiss jika ada toast yang sedang aktif**
      if (loadingToastId !== null) {
        toast.dismiss(loadingToastId);
      }
    }
  }, [isSuccess, transactionResult]);

  return (
    <>
      {isOpen && (
        <div className="inset-0 absolute w-full h-screen flex flex-col justify-center items-center px-7 lg:px-0">
          <div className="bg-black opacity-55 absolute inset-0 "></div>
          <div className="max-w-[28.875rem] sm:max-h-[17.063rem] max-h-[15rem]   w-full h-full bg-purple-light z-10 relative">
            {/* close button */}
            <button
              onClick={handleClose}
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
            <div className="w-[21.5rem] h-[10.438rem] px-14 flex flex-col  items-center  bg-purple-dark mx-auto mt-5 text-white">
              <h1
                className={`${
                  index == 2 ? "text-md" : "text-2xl"
                } font-bold mt-3`}
              >
                {headerCreatePolling[index]}
              </h1>
              <div>
                {index == 0 ? (
                  // name polling
                  <input
                    type="text"
                    placeholder="type polling name"
                    onChange={handleDataPolling}
                    value={dataPolling.namePolling}
                    id="namePolling"
                    name="namePolling"
                    className="mt-7 text-white  font-light text-center outline-0 "
                  />
                ) : index == 1 ? (
                  // candidates
                  <div className="flex flex-col gap-3 mt-1 ">
                    <label htmlFor="candidate1" className="flex gap-2  pl-12">
                      <span>1.</span>
                      <input
                        className=" text-white  font-light  outline-0 w-full "
                        onChange={handleDataPolling}
                        id="candidate1"
                        value={dataPolling.candidate1}
                        type="text"
                        placeholder=" candidate 1"
                      />
                    </label>
                    <label htmlFor="candidate2" className="flex gap-2 pl-12">
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
                    <label htmlFor="candidate3" className="flex gap-2 pl-12">
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
                    cols={20}
                    rows={2}
                    className="  text-black  font-light px-1 outline-0 bg-white resize-none rounded-md"
                  />
                )}
              </div>
              {/* Duration */}
              <div>
                {index == 2 ? (
                  <div className="mt-2 ">
                    <div className="grid grid-cols-[1fr_1px_1fr] gap-3  border-t-4 border-white  ">
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
                ) : (
                  <hr
                    className={`h-1.5  bg-white w-full ${
                      index == 1 ? "mt-2" : "mt-14"
                    } `}
                  />
                )}
              </div>
            </div>
            {/* next button */}

            {index == 2 && (
              <button
                type={"submit"}
                onClick={handleSubmit}
                className="bg-white mx-auto block px-10 mt-5 rounded-md hover:bg-purple-dark hover:text-white transition-all cursor-pointer"
              >
                Done
              </button>
            )}

            {index !== 2 && (
              <button
                type={"button"}
                onClick={handleNext}
                className="bg-white mx-auto block px-10 mt-5 rounded-md hover:bg-purple-dark hover:text-white transition-all cursor-pointer"
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
    <div className="flex-1">
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

export default CreatePolling;
