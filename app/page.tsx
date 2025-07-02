"use client";

import {
  useMiniKit,
  useAddFrame,
} from "@coinbase/onchainkit/minikit";
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
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "./components/Button";
import { useRouter } from "next/navigation";
import Homepage from "./Homepage/page";

// Fallback Icon component
const Icon = ({ name, size, className }: { name: string; size?: string; className?: string }) => (
  <span className={className} style={{ fontSize: size === "sm" ? 16 : 20 }}>
    {name === "plus" ? "+" : name === "check" ? "✔" : ""}
  </span>
);

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  // const [activeTab, setActiveTab] = useState("home");

  const addFrame = useAddFrame();
  const router = useRouter();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  // Redirect to /home when wallet is connected
  useEffect(() => {
    if (context?.client) {
      router.replace("/home");
    } else {
      router.replace("/auth");
    }
  }, [context?.client, router]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      <div className="w-full max-w-md mx-auto px-4 py-3">
       <div>
       {saveFrameButton}
       </div>
          <div>
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
          </div>
         
     <main>
      <Homepage />
     </main>

       

        
      </div>
    </div>
  );
}
