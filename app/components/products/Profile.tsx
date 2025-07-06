import React, { useEffect, useState } from 'react'
import {
    Name,
    Address,
    EthBalance,
    Avatar,
} from "@coinbase/onchainkit/identity";

import {
    WalletDropdown
} from "@coinbase/onchainkit/wallet";
import { useAccount } from 'wagmi';
import Image from 'next/image';

type FarcasterUser = {
  username: string;
  displayName: string;
  pfp: string;
  fid: number;
};

export default function Profile() {
    const { address, isConnected } = useAccount();
    const [fcUser, setFcUser] = useState<FarcasterUser | null>(null);

    useEffect(() => {
      if (!address) {
        return;
      }
      const fetchFarcasterUser = async () => {
        try {
          const response = await fetch(`/api/farcaster/user?custody_address=${address}`);
          if (response.ok) {
            const data = await response.json();
            setFcUser(data);
          }
        } catch {
          // ignore
        }
      };
      fetchFarcasterUser();
    }, [address]);

    if (!isConnected) return <div className='text-black'>Please connect your wallet.</div>;
    if (!address) return <div className='text-black'>Loading profile...</div>;

    return (
        <div className="flex flex-col items-center p-6 rounded-2xl shadow-md bg-white mt-6">
            {/* Farcaster profile info */}
            {fcUser && (
              <div className="flex flex-col items-center mb-2">
                <Image src={fcUser.pfp} alt={fcUser.displayName} width={48} height={48} className="rounded-full" />
                <span className="text-sm font-medium text-gray-700 mt-1">@{fcUser.username}</span>
              </div>
            )}
            <Avatar address={address} className="w-16 h-16 rounded-full" />
            <div className="font-bold text-lg mt-2">
                <Name address={address} />
            </div>
            <div className="text-gray-500 text-xs mb-2">
                <Address address={address} />
                <WalletDropdown />
            </div>
            <EthBalance address={address} className="text-blue-600 font-mono mb-4" />

            <div className="flex gap-8 mt-4">
                <div className="flex flex-col items-center">
                    <span className="font-bold text-xl text-black">0</span>
                    <span className="text-xs text-gray-500">Sold</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-bold text-xl text-black">0</span>
                    <span className="text-xs text-gray-500">Bought</span>
                </div>
            </div>
        </div>
    )
}