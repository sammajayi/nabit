import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMiniKit } from "@coinbase/onchainkit/minikit";

export function useFarcasterFid() {
  const [fid, setFid] = useState(null);
  const searchParams = useSearchParams();
  const { context } = useMiniKit();

  useEffect(() => {
    // Method 1: Try to get FID from MiniKit context
    if (context?.user?.fid) {
      setFid(context.user.fid);
      return;
    }

    // Method 2: Try to get FID from URL parameters
    const urlFid = searchParams.get('fid');
    if (urlFid) {
      setFid(urlFid);
      return;
    }

    // Method 3: Try to get from localStorage (if previously stored)
    const storedFid = localStorage.getItem('farcaster_fid');
    if (storedFid) {
      setFid(storedFid);
      return;
    }

    setFid(null);
  }, [context, searchParams]);

  return fid;
}
