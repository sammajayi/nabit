"use client";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import { useState } from "react";

type Product = {
  name: string;
  images: string[];
  price: number | string;
  description: string;
  category: string;
  owner: string;
};

type ProductCardProps = {
  product: Product;
  onAddToCart?: (product: Product) => void;
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center relative">
      <div className="w-full mb-3">
        <Image
          src={product.images[0] || "/fallback.png"}
          alt={product.name}
          width={300}
          height={300}
          className="rounded-xl w-full aspect-square object-cover"
        />
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-lg text-black">{product.name}</span>
          <span className="text-blue-600 font-bold text-md">${product.price}</span>
        </div>
        <div className="text-gray-500 text-xs mb-2">{product.category}</div>
        <div className="text-gray-700 text-sm mb-4">{product.description}</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
            setIsAdded(true);
          }}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {isAdded ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}