import React, { useState } from "react";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";



type Product = {
  name: string;
  images: string[];
  price: number | string;
  description: string;
  category: string;
  owner: string;
};

type CartPageProps = {
  cartItems: Product[];
  onUpdateCart: (cart: Product[]) => void;
};

export default function CartPage({ cartItems = [], onUpdateCart }: CartPageProps) {
  const [cart, setCart] = useState<Product[]>(cartItems || []);
 

  // Group items by name and count quantities
  const groupedItems = cart.reduce((acc, item) => {
    const key = item.name;
    if (acc[key]) {
      acc[key].quantity += 1;
    } else {
      acc[key] = { ...item, quantity: 1 };
    }
    return acc;
  }, {} as Record<string, Product & { quantity: number }>);

  const updateQuantity = (itemName: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item completely
      const newCart = cart.filter(item => item.name !== itemName);
      setCart(newCart);
      onUpdateCart?.(newCart);
    } else {
      // Update quantity
      const currentItems = cart.filter(item => item.name === itemName);
      const otherItems = cart.filter(item => item.name !== itemName);
      const newItems = Array(newQuantity).fill(currentItems[0]);
      const newCart = [...otherItems, ...newItems];
      setCart(newCart);
      onUpdateCart?.(newCart);
    }
  };

  const removeItem = (itemName: string) => {
    const newCart = cart.filter(item => item.name !== itemName);
    setCart(newCart);
    onUpdateCart?.(newCart);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + Number(item.price), 0);
  };

  const handleCheckout = async () => {
    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }

    // Group items for description
    const grouped = cart.reduce((acc, item) => {
      acc[item.name] = acc[item.name] ? acc[item.name] + 1 : 1;
      return acc;
    }, {} as Record<string, number>);

    const description = Object.entries(grouped)
      .map(([name, qty]) => `${qty}x ${name}`)
      .join(", ");

    const totalAmount = getTotalPrice();

    const chargeData = {
      name: "Cart Checkout",
      description,
      pricing_type: "fixed_price",
      local_price: {
        amount: totalAmount.toFixed(2),
        currency: "USD"
      }
    };

    const res = await fetch('/api/commerce/charge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chargeData),
    });
    const data = await res.json();
    if (data && data.id) {
      // setChargeId(data.id); // Save chargeId in state - REMOVED
    } else {
      alert("Failed to create charge. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 bg-white mt-6">
      {/* <h1 className="text-2xl font-bold mb-6 text-center text-black">Your Cart</h1> */}
      
      {Object.keys(groupedItems).length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <div className="text-gray-500 text-lg mb-2">Your cart is empty</div>
          <div className="text-gray-400 text-sm">Add some products to get started!</div>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {Object.values(groupedItems).map((item) => (
              <div
                key={item.name}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  {item.images && item.images[0] && (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-bold text-black text-lg">{item.name}</div>
                    <div className="text-gray-500 text-sm mb-2">{item.description}</div>
                    <div className="text-blue-600 font-bold text-lg">${item.price}</div>
                  </div>
                  <button
                    onClick={() => removeItem(item.name)}
                    className="text-red-500 hover:text-red-700 p-1"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.name, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-300"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-lg min-w-[2rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.name, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 text-blue-600"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="font-bold text-lg text-blue-600">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-black">Total Items:</span>
              <span className="text-lg font-bold text-black">{cart.length}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-black">Total Price:</span>
              <span className="text-2xl font-bold text-blue-600">${getTotalPrice().toFixed(2)}</span>
            </div>
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-lg"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>

      
        </>
      )}
    </div>
  );
}