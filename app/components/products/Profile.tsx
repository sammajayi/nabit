import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import type { NeynarUser } from '@/lib/neynar';
import { useFarcasterFid } from "../../hooks/useFarcasterFid";
export default function Profile() {

  const [user, setUser] = useState<Partial<NeynarUser> | null>(null);
  const [, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);



  const fid = useFarcasterFid();


  const stats = {
    listings: 0,
    sold: 0,
    total: 0, 
  };

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

  if (loading) return (
    <div className="flex flex-col items-center p-6 rounded-2xl  bg-white mt-6 max-w-xs mx-auto">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      {/* <p className="mt-4 text-gray-500 text-sm">Loading profile...</p> */}
    </div>
  );
  if (!user) return null

  return (
    <div className="flex flex-col items-center p-6 rounded-2xl shadow-md  bg-white mt-6 max-w-xs mx-auto">

      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 shadow mb-3">
        <Image
          src={user.pfp_url ?? ""}
          alt={user.display_name ?? ""}
          width={96}
          height={96}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="text-xl font-bold text-gray-900">{user.display_name}</div>

      <div className="text-gray-500 text-sm mb-4">@{user.username}</div>

      <div className="flex w-full justify-between bg-gray-50 rounded-lg p-3 mt-2">
        <div className="flex flex-col items-center flex-1">
          <span className="font-semibold text-gray-800">{stats.listings}</span>
          <span className="text-xs text-gray-500">Listings</span>
        </div>
        <div className="flex flex-col items-center flex-1 border-l border-gray-200">
          <span className="font-semibold text-gray-800">{stats.sold}</span>
          <span className="text-xs text-gray-500">Sold</span>
        </div>
        <div className="flex flex-col items-center flex-1 border-l border-gray-200">
          <span className="font-semibold text-gray-800">{stats.total} ETH</span>
          <span className="text-xs text-gray-500">Total Made</span>
        </div>
      </div>

      <div>
        <h3 className='text-black font-semibold'>Order History</h3>
      </div>
    </div>
  );
}