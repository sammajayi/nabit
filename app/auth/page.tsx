"use client";

import { useEffect } from "react";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
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
      <div className="flex items-center space-x-2">
        <Wallet className="z-10">
          <ConnectWallet>
            <Name className="text-inherit" />
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
              <EthBalance />
            </Identity>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>

      <main>
        
      </main>
    </div>
  );
} 