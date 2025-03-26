import { Circle, X } from "lucide-react";
import React, {
  ChangeEventHandler,
  Dispatch,
  FormEventHandler,
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";
import Countdown from "react-countdown";
import Duration from "./Duration";
import { ITimes } from "@/lib/types";

interface DataCreatePolling {
  namePolling: string;
  candidate1: string;
  candidate2: string;
  candidate3?: string;
  description: string;
  maxVotes: number;
  duration: number;
}

type CreateProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
};

const CreatePolling = (props: CreateProps) => {
  const { isOpen, setIsOpen } = props;
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
  });
  const [isDone, setIsDone] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const [times, setTimes] = useState<ITimes>({
    hours: 0,
    minutes: 0,
    seconds: 0,
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
      setIsDone(true);
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
  const handleSubmit = () => {
    const isValid = validation(dataPolling);
    if (isValid.isError) {
      toast.error(isValid.error[0], { position: "top-center" });
      return;
    }
    setIsDone(true);
    console.log("berhasil di anu", dataPolling);
    toast.success(
      `horey selamat polling dengan name ${dataPolling.namePolling} akan segera hadir`,
      { position: "top-center" }
    );
  };

  const handleClose = () => {
    setIsOpen(false);
    setIndex(0);
  };

  const handleDataPolling: ChangeEventHandler<HTMLInputElement> = (e) => {
    const target = e.target as HTMLInputElement;
    setDataPolling({ ...dataPolling, [target.id]: target.value });
  };

  return (
    <>
      {isOpen && (
        <div className="inset-0 absolute w-full h-screen flex flex-col justify-center items-center px-7 lg:px-0">
          <div className="bg-black opacity-55 absolute inset-0 "></div>
          <div className="bg-green-300  absolute px-20 py-10 text-center top-0">
            {countdownTarget && isDone ? (
              <>
                <Countdown date={countdownTarget} />
              </>
            ) : null}
            {error ? <p className="text-black">{error}</p> : null}
          </div>

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
                {index == 0
                  ? "Polling Name"
                  : index == 1
                  ? "Add Candidates"
                  : index == 2
                  ? "Description"
                  : ""}
              </h1>
              <div>
                {index == 0 ? (
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
                  <textarea
                    placeholder="type polling name"
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
                        isDone={isDone}
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
