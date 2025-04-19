"use client";

import VotingComponents from "@/components/VotingComponents";
import useHydration from "@/hooks/hydration";
import { client } from "@/lib/client";
import { useActiveAccount, useConnectModal } from "thirdweb/react";

const Page = () => {
  const { hydration } = useHydration();
  const { connect, isConnecting } = useConnectModal();
  const account = useActiveAccount();

  async function handleConnect() {
    try {
      const wallet = await connect({ client }); // opens the connect modal
      const account = wallet.getAccount();
      await account?.signMessage({
        message: "welcome to voxchain. u can rest and eat some food and then vote anything u want :)",
      });

      console.log("connected to", account);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className={`w-full h-screen ${account?.address ? " pt-20" : "flex justify-center items-center"} font-inter`}>
      {/* Hero section */}
      {account?.address && !isConnecting ? (
        <VotingComponents />
      ) : (
        <div className="container mx-auto px-6 text-center space-y-8 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold">VoxChain</h1>

          <p className="text-lg md:text-2xl opacity-90 leading-relaxed">
            Create your voting with blockchain power in EVM. <br className="hidden md:block" />
            No cheat, no manipulation.
          </p>

          <button onClick={handleConnect} disabled={!hydration} className="bg-purple-600 hover:bg-purple-800 transition-colors duration-300 text-white text-lg md:text-xl font-medium py-3 px-8 rounded-full disabled:cursor-wait">
            Connect
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;
