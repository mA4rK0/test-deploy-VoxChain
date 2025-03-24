import { Circle, X } from "lucide-react";
import React, { ChangeEventHandler, Dispatch, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import Countdown from "react-countdown";
import Duration from "./Duration";
type CreateProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
};
interface DataCreatePolling {
  namePolling: string;
  candidate1: string;
  candidate2: string;
  candidate3: string;
  description: string;
  maxVotes: number;
  duration: string;
}
const CreatePolling = (props: CreateProps) => {
  const { isOpen, setIsOpen } = props;
  const [index, setIndex] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataCreatePolling>();
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

  const handleNext = () => {
    if (index == 0) {
      setIndex(1);
    } else if (index == 1) {
      setIndex(2);
    } else if (index == 2) {
      return;
    }
  };

  const onSubmit: SubmitHandler<DataCreatePolling> = (data, e) => {
    console.log(data);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIndex(0);
  };

  return (
    <>
      {isOpen && (
        <form
          onSubmit={() => handleSubmit(onSubmit)}
          className="inset-0 absolute w-full h-screen flex flex-col justify-center items-center px-7 lg:px-0"
        >
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
                    {...register("namePolling", {
                      required: "Name is required",
                    })}
                    placeholder="type polling name"
                    className="mt-7 text-white  font-light text-center outline-0 "
                  />
                ) : index == 1 ? (
                  <div className="flex flex-col gap-3 mt-1 ">
                    <label htmlFor="candidate-1" className="flex gap-2  pl-12">
                      <span>1.</span>
                      <input
                        className=" text-white  font-light  outline-0 w-full "
                        id="candidate-1"
                        type="text"
                        {...register("candidate1")}
                        placeholder=" candidate 1"
                      />
                    </label>
                    <label htmlFor="candidate-2" className="flex gap-2 pl-12">
                      <span>2.</span>
                      <input
                        className=" text-white  font-light  outline-0 w-full "
                        id="candidate-2"
                        type="text"
                        {...register("candidate2")}
                        placeholder="candidate 2"
                      />
                    </label>
                    <label htmlFor="candidate-3" className="flex gap-2 pl-12">
                      <span>3. </span>
                      <input
                        className=" text-white  font-light  outline-0 w-full "
                        id="candidate-3"
                        type="text"
                        {...register("candidate3")}
                        placeholder="candidate 3"
                      />
                    </label>
                  </div>
                ) : (
                  <textarea
                    {...register("description", {
                      required: "Name is required",
                    })}
                    placeholder="type polling name"
                    cols={20}
                    rows={2}
                    className="  text-black  font-light px-1 outline-0 bg-white resize-none rounded-md"
                  />
                )}
              </div>
              {/* Duration */}
              <div>
                {index == 2 ? (
                  <Duration />
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

            <button
              type="button"
              onClick={handleNext}
              className="bg-white mx-auto block px-10 mt-5 rounded-md hover:bg-purple-dark hover:text-white transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default CreatePolling;
