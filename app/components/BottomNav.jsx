import React from "react";
import { Home, ShoppingCart, PlusCircle, User } from 'lucide-react';

const navItems = [
  { label: "Home", icon: Home },
  { label: "Shop", icon: ShoppingCart },
  { label: "Create", icon: PlusCircle },
  { label: "Profile", icon: User },
];

export default function BottomNav({ onNavigate, active }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-white border-t max-w-md w-full z-50">
      <div className="flex w-full justify-between items-center px-2 py-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex-1 flex flex-col items-center text-xs font-medium focus:outline-none ${
              active === item.label ? "text-blue-600" : "text-gray-400"
            }`}
            title={item.label}
            onClick={() => onNavigate(item.label)}
          >
            <span className="text-2xl" aria-hidden="true">
              <item.icon size={24} />
            </span>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}