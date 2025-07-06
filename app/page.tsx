"use client"

import { useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount } from "wagmi";
import AuthPage from "./auth/page";
import Homepage from "./homepage/page";

export default function App() {
    const { setFrameReady, isFrameReady } = useMiniKit();
    const { isConnected } = useAccount();

    useEffect(() => {
        if (!isFrameReady) {
          setFrameReady();
        }
      }, [isFrameReady, setFrameReady]);

    return (
        <div>
            {isConnected ? <Homepage /> : <AuthPage />}
        </div>
    )
}