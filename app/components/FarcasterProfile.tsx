"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

type FarcasterUser = {
  username: string;
  displayName: string;
  pfp: string;
  fid: number;
};

type FarcasterProfileProps = {
  username: string;
};

export default function FarcasterProfile({ username }: FarcasterProfileProps) {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchFarcasterUser = async () => {
      try {
        const response = await fetch(`/api/farcaster/user?username=${username}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Error fetching Farcaster user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarcasterUser();
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Image
        src={user.pfp}
        alt={user.displayName}
        width={32}
        height={32}
        className="rounded-full"
      />
      <span className="text-sm font-medium text-gray-700">
        @{user.username}
      </span>
    </div>
  );
} 