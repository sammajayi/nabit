import { useEffect, useState } from 'react';
import { useFarcasterFid } from './useFarcasterFid';

export function useFarcasterUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
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

  return { user, loading, error, fid };
}
