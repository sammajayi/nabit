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
    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center relative overflow-hidden min-w-[180px] max-w-xs w-full">
      <div className="w-full mb-3 aspect-square overflow-hidden rounded-xl">
        <Image
          src={product.images[0] || "/fallback.png"}
          alt={product.name}
          width={320}
          height={320}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <span className="font-extrabold text-lg text-black truncate">{product.name}</span>
          <span className="text-blue-600 font-bold text-lg">${product.price}</span>
        </div>
        <div className="text-gray-500 text-xs mb-2 font-semibold">{product.category}</div>
        <div className="text-gray-700 text-sm mb-4 line-clamp-2">{product.description}</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
            setIsAdded(true);
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition text-base"
        >
          {isAdded ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}