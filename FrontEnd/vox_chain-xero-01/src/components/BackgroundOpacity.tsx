import React from "react";

const BackgroundOpacity = ({
  handleCloseModal,
}: {
  handleCloseModal?: () => void;
}) => {
  return (
    <div
      onClick={handleCloseModal}
      className="bg-black opacity-55 absolute inset-0 "
    ></div>
  );
};

export default BackgroundOpacity;
