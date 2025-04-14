"use client";

import VotingComponents from "@/components/VotingComponents";
import useHydration from "@/hooks/hydration";
import { client } from "@/lib/client";
import { sepolia } from "thirdweb/chains";
import { useActiveAccount, useActiveWallet, useConnectModal, useWalletBalance } from "thirdweb/react";

const Page = () => {
  const { hydration } = useHydration();
  const { connect, isConnecting } = useConnectModal();
  const account = useActiveAccount();

  async function handleConnect() {
    try {
      const wallet = await connect({ client }); // opens the connect modal
      const account = wallet.getAccount();
      await account?.signMessage({
        message: "welcome to voxchain. u can rest and eat some food and then vote azril",
      });

      console.log("connected to", account);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className={` w-full h-screen ${account?.address ? " pt-20" : "flex justify-center items-center"} font-inter`}>
      {/* Hero section */}
      {account?.address && !isConnecting ? (
        <VotingComponents />
      ) : (
        <div className="grid container grid-cols-1 grid-rows-3 xl:max-2xl:w-2/5  sm:w-1/2 gap-10 justify-center items-center  text-center">
          <h1 className="font-bold xl:max-2xl:text-[5vw] lg:max-xl:text-[5.6vw] sm:max-lg:text-5xl text-4xl">VoxChain</h1>
          <p className="xl:max-2xl:text-2xl lg:max-xl:text-3xl sm:max-lg:text-3xl text-1xl">Create your voting in with blockchain power in EVM. No cheat, no manipulation.</p>

          <button onClick={handleConnect} disabled={!hydration} className="bg-purple-light rounded-4xl text-white lg:text-2xl text-xl w-fit py-3 px-10  mx-auto hover:bg-purple-dark cursor-pointer disabled:cursor-wait">
            Connect
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;
