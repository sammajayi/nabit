import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import type { NeynarUser } from '@/lib/neynar';

export default function Profile() {
  const fid = '875984';
  const [user, setUser] = useState<Partial<NeynarUser> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Dummy stats 
  const stats = {
    listings: 12,
    sold: 8,
    total: 2.5, // ETH or your currency
  };

  useEffect(() => {
    if (!fid) return;
    setLoading(true);
    fetch(`/api/farcaster/user?fid=${fid}`)
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch user"))
      .then(data => setUser(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [fid]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return null;

  return (
    <div className="flex flex-col items-center p-6 rounded-2xl shadow-md bg-white mt-6 max-w-xs mx-auto">
      
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
    </div>
  );
}