import React from "react";

import WalletConnect from "./components/WalletConnect"

export default function Navbar() {
  return (
    <header className="flex justify-between items-center mb-3 h-11">
      <div className="flex gap-16">
        <div className="">
          <h1 className="text-black font-extrabold text-3xl items-center">
            Nab-It
          </h1>
        </div>
       <WalletConnect />
      </div>
    </header>
  );
}
