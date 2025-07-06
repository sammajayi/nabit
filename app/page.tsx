"use client"

import { useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import AuthPage from "./auth/page";


export default function App() {
    const { setFrameReady, isFrameReady } = useMiniKit();

    useEffect(() => {
        if (!isFrameReady) {
          setFrameReady();
        }
      }, [isFrameReady, setFrameReady]);

    return (
        <div>
             <AuthPage />;
           

        </div>
    )
    
   
}