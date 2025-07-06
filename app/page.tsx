"use client"

import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount } from "wagmi";
import AuthPage from "./auth/page";
import React from "react";
import BottomNav from "./components/BottomNav";
import ProductUpload from "./components/products/ProductUpload";
import ProductList from "./components/products/ProductList";
import Profile from "./components/products/Profile";
import CartPage from "./components/products/CartPage";
import FarcasterProfile from "./components/FarcasterProfile";
import { useRouter } from "next/navigation";

type Product = {
  name: string;
  images: string[];
  price: number | string;
  description: string;
  category: string;
  owner: string;
};

function Homepage() {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const [activePage, setActivePage] = useState("Home");
  const [cart, setCart] = useState<Product[]>([]);
  const [fcUsername, setFcUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected) {
      router.replace("/auth");
    }
  }, [isConnected, router]);

  useEffect(() => {
    if (!address) {
      setFcUsername(null);
      return;
    }
    // Fetch Farcaster profile by address to get the username
    fetch(`/api/farcaster/user?address=${address}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setFcUsername(data?.username || null))
      .catch(() => setFcUsername(null));
  }, [address]);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
  };

  const handleUpdateCart = (newCart: Product[]) => {
    setCart(newCart);
  };

  let content;
  if (activePage === "Create") {
    content = <ProductUpload />;
  } else if (activePage === "Profile") {
    content = <Profile />;
  } else if (activePage === "Shop") {
    content = <CartPage cartItems={cart} onUpdateCart={handleUpdateCart} />;
  } else {
    content = <ProductList onAddToCart={handleAddToCart} />;
  }

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      <div className="relative flex flex-col min-h-screen max-w-md mx-auto bg-white overflow-hidden">
        {/* Farcaster Profile in top right corner */}
        {fcUsername && (
          <div className="absolute top-4 right-4 z-20">
            <FarcasterProfile username={fcUsername} />
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto pb-16">
          {content}
        </div>
        <BottomNav onNavigate={setActivePage} active={activePage} />
      </div>
    </div>
  );
}

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