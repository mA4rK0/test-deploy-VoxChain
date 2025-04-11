import Modal from "@/components/Modal";
import PollInfo from "@/components/PollInfo";
import React from "react";

const Page = async ({
  params,
}: {
  params: Promise<{ pollAddress: string }>;
}) => {
  const { pollAddress } = await params;
  if (!pollAddress) return <div>Address Not Found</div>;
  return (
    <Modal>
      <PollInfo address={pollAddress || ""} />
    </Modal>
  );
};

export default Page;
