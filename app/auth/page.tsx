"use client";

import { useEffect } from "react";
import WalletConnect from "../components/WalletConnect"
import { useRouter } from "next/navigation";
import { useMiniKit } from "@coinbase/onchainkit/minikit";



export default function AuthPage() {
  const { context } = useMiniKit();
  const router = useRouter();

  useEffect(() => {
    if (context?.client) {
      router.replace("/Homepage");
    }
  }, [context?.client, router]);


  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Nab it now. No Waiting</h1>
        <WalletConnect />

      <main>

      </main>
    </div>
  );
} 