import React from "react";
import { Home, ShoppingCart, PlusCircle, User } from 'lucide-react';

const navItems = [
  { label: "Home", icon: Home },
  { label: "Shop", icon: ShoppingCart, active: true },
  { label: "Create", icon: PlusCircle },
  { label: "Profile", icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 bg-white border-t max-w-md mx-auto">
      <div className="max-w-md mx-auto flex w-full justify-between items-center px-2 py-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex-1 flex flex-col items-center text-xs font-medium focus:outline-none ${
              item.active ? "text-blue-600" : "text-gray-400"
            }`}
            title={item.label}
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