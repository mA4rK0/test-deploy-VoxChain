"use client";
import React from "react";
import BackgroundOpacity from "./BackgroundOpacity";
import { useRouter } from "next/navigation";
// import { redirect } from "next/navigation";

const Modal = ({
  children,
  handleCloseModal,
}: {
  children: React.ReactNode;
  handleCloseModal?: () => void;
}) => {
  const router = useRouter();

  return (
    <div className=" fixed inset-0 w-full  h-screen flex justify-center items-center max-2xl:xl:py-3 p-3 text-white z-10">
      <BackgroundOpacity handleCloseModal={handleCloseModal} />
      <div className="bg-purple-light w-full  max-w-[64.125rem] h-full max-h-[40rem] md:max-h-[31.25rem] xl:max-h-[50.563rem]  shadow-2xl rounded-2xl pb-7 z-10 relative overflow-y-scroll scroll-modal">
        <div
          onClick={handleCloseModal}
          className="text-white font-light  bg-[#EF3737] hover:bg-red-700 absolute top-5 right-6 cursor-pointer px-3 py-1 rounded-md"
        >
          close X
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
