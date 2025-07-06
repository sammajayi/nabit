"use client";

import { useEffect } from "react";
import WalletConnect from "../components/WalletConnect"
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";



export default function AuthPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.replace("/");
    }
  }, [isConnected, router]);


  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Nab it now. No Waiting</h1>
        <WalletConnect />

      <main>

      </main>
    </div>
  );
} 