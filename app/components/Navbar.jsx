import React from "react";
import { useAccount, useDisconnect } from "wagmi";
import { Name } from "@coinbase/onchainkit/identity";

// import WalletConnect from "./components/WalletConnect"

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <header className="flex justify-between items-center mb-3 h-11">
      <div className="flex gap-16">
        <div className="">
          <h1 className="text-black font-extrabold text-3xl items-center">
            Nabit
          </h1>
        </div>
      </div>
      
      {/* Wallet Address on the right side */}
      <div className="text-sm text-gray-600 font-mono flex items-center gap-2">
        {isConnected && address ? (
          <>
            <span>
              Hello, <Name address={address} className="text-blue-600" />
            </span>
            <button
              onClick={() => disconnect()}
              className="text-xs text-red-500 hover:text-red-700 underline"
            >
              Logout
            </button>
          </>
        ) : (
          <span className="text-gray-400">Not connected</span>
        )}
      </div>
    </header>
  );
}
