import PollInfo from "@/components/PollInfo";

const Page = async ({
  params,
}: {
  params: Promise<{ pollAddress: string }>;
}) => {
  const { pollAddress } = await params;
  if (!pollAddress) return <div>Address Not Found</div>;
  return (
    <div className="w-full h-screen flex justify-center  pt-10 text-white font-inter">
      <div className="mt-20 bg-purple-light w-full  max-w-[64.125rem] h-full max-h-[40rem] md:max-h-[31.25rem] xl:max-h-[50.563rem]  shadow-2xl rounded-2xl z-10 relative">
        <PollInfo address={pollAddress} />
      </div>
    </div>
  );
};

export default Page;
