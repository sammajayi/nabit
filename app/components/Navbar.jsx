import React, { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import Image from "next/image";
import Link from "next/link";
import { useFarcasterFid } from "../hooks/useFarcasterFid";
// import { Name } from "@coinbase/onchainkit/identity";
// import type { NeynarUser } from '@/lib/neynar';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState(null);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  

  const fid = useFarcasterFid();

  useEffect(() => {
    if (!fid) {
      setUser(null);
      setError(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    fetch(`/api/farcaster/user?fid=${fid}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 404) {
          // User not found
          return null;
        } else {
          return Promise.reject("Failed to fetch user");
        }
      })
      .then((data) => setUser(data))
      .catch((err) => {
        setError(err.message || err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [fid]);

  if (loading) return <div>Loading...</div>;

  return (
    <header className="flex items-center justify-between" >
      <div className="">
        <div className="">
          <Image 
          src="/nabitlogo.png"
          alt="nabitlogo"
          width={200}
          height={200}
          />
        </div>
      </div>

   
      <div className="flex items-center gap-4 rounded-xl px-4 py-2 ">
        {isConnected && address ? (
          user && user.username ? (
            <>
              
                
            
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-400 shadow mb-1">
                <Link href="/">
                <Image
                  src={user.pfp_url ?? ""}
                  alt={user.display_name ?? ""}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
                </Link>
              </div>
          
            
              <button
                onClick={() => disconnect()}
                className="text-[7px] text-red-500 hover:text-red-700 underline justify-center"
              >
                
              </button>
              </>
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
