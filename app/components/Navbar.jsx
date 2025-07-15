import React, { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import Image from "next/image";
// import { Name } from "@coinbase/onchainkit/identity";
// import type { NeynarUser } from '@/lib/neynar';

export default function Navbar() {
  const fid = "875984";
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (!fid) return;
    setLoading(true);
    fetch(`/api/farcaster/user?fid=${fid}`)
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to fetch user"),
      )
      .then((data) => setUser(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [fid]);

  return (
    <header className="flex justify-between items-center mb-3 h-11">
      <div className="flex gap-16">
        <div className="">
          <h1 className="text-black font-extrabold text-3xl items-center">
            Nabit
          </h1>
        </div>
      </div>

      {/* Wallet Address on the right side */}
      <div className="flex items-center gap-4 rounded-xl px-4 py-2 ">
        {isConnected && address ? (
          user && user.username ? (
            <div >
              <div className="flex items-center space-x-3">
                
              
              <div><span className="font-extrabold text-black" >Hello,</span> <span className="font-normal text-black text-[9px] mb-1">@{user.username}</span></div>
            
              <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-300 shadow mb-1">
                <Image
                  src={user.pfp_url ?? ""}
                  alt={user.display_name ?? ""}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              </div>
            
              <button
                onClick={() => disconnect()}
                className="text-[7px] text-red-500 hover:text-red-700 underline justify-center"
              >
                Logout
              </button>
            </div>
          ) : (
            null
          )
        ) : (
          <span className="text-gray-400">Not connected</span>
        )}
      </div>
    </header>
  );
}
