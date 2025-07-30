"use client";
import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
import { Checkout, CheckoutButton, CheckoutStatus } from '@coinbase/onchainkit/checkout';

type Product = {
  name: string;
  images: string[];
  price: number | string;
  description: string;
  category: string;
  owner: string;
  seller_image?: string; // Added for seller info
  seller_display_name?: string; // Added for seller info
  fid?: string; // Added for fallback seller name
};

type ProductCardProps = {
  product: Product;
  onAddToCart?: (product: Product) => void;
};

export function ProductCard({ product, /*onAddToCart*/ }: ProductCardProps) {
  // const router = useRouter();
  // const [isAdded, setIsAdded] = useState(false);

  const imageSrc =
    typeof product.images[0] === "string" && product.images[0].trim() !== ""
      ? product.images[0]
      : "/fallback.png";

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center relative overflow-hidden min-w-[180px] max-w-xs w-full">
      <div className="w-full mb-3 aspect-square overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={imageSrc}
          alt={product.name}
          width={320}
          height={320}
          className="object-cover w-full h-full"
          onError={(e) => {
            console.log("Image failed to load:", imageSrc);
            e.currentTarget.src = "/fallback.png";
          }}
        />
      </div>
      {/* Seller info with fallbacks */}
      <div className="flex items-center mb-2 opacity-80 text-xs w-full">
        <Image
          src={product.seller_image || "/fallback.png"}
          alt={product.seller_display_name || product.fid || "Anonymous Seller"}
          width={24}
          height={24}
          className="rounded-full mr-2"
        />
        <span className="truncate text-gray-700 text-xs">
          {product.seller_display_name || product.fid || "Anonymous Seller"}
        </span>
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <span className="font-extrabold text-lg text-black truncate">{product.name}</span>
          <span className="text-blue-600 font-bold text-lg">${product.price}</span>
        </div>
        {/* <div className="text-gray-500 text-xs mb-2 font-semibold">{product.category}</div> */}
        <div className="text-gray-700 text-sm mb-4 line-clamp-2">{product.description}</div>
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
            setIsAdded(true);
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition text-base"
        >
          {isAdded ? "Added to Cart" : "Add to Cart"}
        </button> */}

        <Checkout productId='59c07652-724b-4eed-aa8d-2520b1907ed2' >
          <CheckoutButton text="Nab Now" coinbaseBranded />
          <CheckoutStatus />
        </Checkout>
      </div>
    </div>
  );
}