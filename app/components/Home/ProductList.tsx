"use client";
import { useState } from "react";
import Image from "next/image";
// import WalletConnect from "../../components/WalletConnect";

const categories = [
  { id: "Art", label: "Art" },
  { id: "Tech", label: "Tech" },
  { id: "Fashion", label: "Fashion" },
  { id: "Home", label: "Home" },
];

const featured = [
  {
    title: "Abstract Canvas",
    owner: "sammajayi.base.eth",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Modern Art Print",
    owner: "sammajayi.base.eth",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
];

const newArrivals = [
  {
    title: "Minimalist Painting",
    owner: "sammajayi.base.eth",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Geometric Print",
    owner: "sammajayi.base.eth",
    img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Abstract Sculpture",
    owner: "sammajayi.base.eth",
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Modern Wall Art",
    owner: "sammajayi.base.eth",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
];

export default function ProductList() {
  const [activeTab, setActiveTab] = useState("Art");
  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 bg-[#f7f9fb] min-h-screen">
      <div>

      {/* <WalletConnect /> */}
    
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold mx-auto text-black">Nab-It</h1>
        
      </div>
      {/* Search */}
      <div className="px-4 mb-2">
        <input
          type="text"
          className="bg-[#e9eef4] rounded-xl px-4 py-3 w-full placeholder:text-gray-300 text-black text-lg outline-none"
          placeholder="Search products"
        />
      </div>
      {/* Categories Tabs */}
      <div className="flex space-x-6 px-4 mb-2 border-b border-gray-200">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={`pb-2 text-base font-medium transition-colors ${
              activeTab === category.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-400 border-b-2 border-transparent"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
      {/* Featured Section */}
      <div className="px-4 mt-4">
        <h2 className="font-bold text-xl mb-3 text-black">Featured</h2>
        <div className="grid grid-cols-2 gap-4">
          {featured.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-3 flex flex-col items-center">
              <Image
                src={item.img}
                alt={item.title}
                width={400}
                height={400}
                className="rounded-xl w-full aspect-square object-cover mb-2"
              />
              <div className="text-base font-medium text-black leading-tight">{item.title}</div>
              <div className="text-blue-400 text-sm">By {item.owner}</div>
            </div>
          ))}
        </div>
      </div>
      {/* New Arrivals Section */}
      <div className="px-4 mt-6">
        <h2 className="font-bold text-xl mb-3 text-black">New Arrivals</h2>
        <div className="grid grid-cols-2 gap-4">
          {newArrivals.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-3 flex flex-col items-center">
              <Image
                src={item.img}
                alt={item.title}
                width={400}
                height={400}
                className="rounded-xl w-full aspect-square object-cover mb-2"
              />
              <div className="text-base font-medium text-black leading-tight">{item.title}</div>
              <div className="text-blue-400 text-sm">By {item.owner}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
    </div>
  );
}
