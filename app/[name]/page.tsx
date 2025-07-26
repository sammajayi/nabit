"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Checkout, CheckoutButton, CheckoutStatus } from '@coinbase/onchainkit/checkout';


// Import your mockProducts array or fetch from backend
import { mockProducts } from "../components/products/mockProducts"; 

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const product = mockProducts.find(
    (p) => encodeURIComponent(p.name) === params.name
  );

  if (!product) return <div>Product not found</div>;

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <button onClick={() => router.back()} className="text-2xl font-bold text-black">&larr;</button>
        <h1 className="text-lg font-bold text-black flex-1 text-center">Product Details</h1>
        <span className="w-8" /> {/* Spacer */}
      </div>
      {/* Main Image */}
      <div className="w-full aspect-square relative mb-4">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover rounded-xl"
          sizes="100vw"
        />
      </div>
      {/* Product Info */}
      <div className="px-4">
        <h2 className="text-xl font-bold mb-2 text-black">{product.name}</h2>
        <div className="text-gray-700 mb-4">{product.description}</div>
        <div className="mb-4">
          <span className="font-bold">Price</span>
          <div className="text-blue-600 font-bold text-lg">${product.price}</div>
        </div>
       
        <div className="mb-4">
          <span className="font-bold text-black">Variations</span>
          <div className="flex gap-2 mt-2">
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Black</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Brown</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Tan</span>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Small</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Medium</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Large</span>
          </div>
        </div>
        {/* Buy Now Button */}
        <Checkout productId='59c07652-724b-4eed-aa8d-2520b1907ed2' >
          <CheckoutButton text="Nab Now" coinbaseBranded />
          <CheckoutStatus />
        </Checkout>
      </div>
    </div>
  );
}
