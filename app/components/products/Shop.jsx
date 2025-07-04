import React from "react";
import Image from "next/image";

export default function Shop({ cartItems = [] }) {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center text-black">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-gray-500 text-center">Your cart is empty.</div>
      ) : (
        <ul className="space-y-4">
          {cartItems.map((item, idx) => (
            <li
              key={item.id || idx}
              className="flex items-center justify-between bg-[#f7f9fb] rounded-xl p-4 shadow"
            >
              <div className="flex items-center gap-4">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div>
                  <div className="font-bold text-black">{item.name}</div>
                  <div className="text-gray-500 text-sm">{item.description}</div>
                </div>
              </div>
              <div className="text-blue-600 font-bold text-lg">${item.price}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}