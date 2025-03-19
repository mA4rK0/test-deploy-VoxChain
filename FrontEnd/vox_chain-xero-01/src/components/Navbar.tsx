"use client";
import type { NextPage } from "next";
import { ConnectButton } from "thirdweb/react";
import { client, wallet } from "@/lib/client";
import { generatePayload, isLoggedIn, login, logout } from "@/actions/login"; // we'll create this file in the next section
import { useEffect, useState } from "react";
import { sepolia, arbitrumSepolia, arbitrum } from "thirdweb/chains";
const Navbar = () => {
  const [hydration, setHydration] = useState(false);
  useEffect(() => {
    setHydration(true);
  }, []);
  return (
    <>
      <div className="w-full py-4 px-6 xl:px-11 absolute bg-purple-light flex justify-between items-center">
        <div className="font-inter text-white font-bold lg:text-[24px] text-[1rem] ">
          VoxChain
        </div>
        <div>
          {hydration && (
            <ConnectButton
              client={client}
              // auth={{
              //   isLoggedIn: async (address) => {
              //     console.log("checking if logged in!", { address });
              //     return await isLoggedIn();
              //   },
              //   doLogin: async (params) => {
              //     console.log("logging in!", params);
              //     await login(params);
              //   },
              //   getLoginPayload: async ({ address }) =>
              //     generatePayload({ address }),
              //   doLogout: async () => {
              //     console.log("logging out!");
              //     await logout();
              //   },
              // }}
              connectButton={{
                label: "Connect",

                style: {
                  color: "white",
                  background: "var(--purple-dark)",
                  width: "141px",
                  height: "34px",
                  fontSize: "12px",
                },
              }}
              chains={[sepolia, arbitrumSepolia, arbitrum]}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
