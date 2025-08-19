"use client";
import Image from "next/image";
import { 
  Checkout, 
  CheckoutButton, 
  CheckoutStatus 
} from '@coinbase/onchainkit/checkout';

type Product = {
  id?: string | number;
  name: string;
  images: string[];
  price: number | string;
  description: string;
  category: string;
  owner: string;
  seller_image?: string;
  seller_display_name?: string;
  fid?: string;
};

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
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
          priority
          onError={(e) => {
            console.log("Image failed to load:", imageSrc);
            e.currentTarget.src = "/fallback.png";
          }}
        />
      </div>
      
      {/* Seller info */}
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

        <div className="text-gray-700 text-sm mb-4 line-clamp-2">
          {product.description}
        </div>

        <div className="w-full">
          <Checkout productId={`product-${product.id}`}>
            <CheckoutButton coinbaseBranded />
            <CheckoutStatus />
          </Checkout>
        </div>
      </div>
    </div>
  );
}