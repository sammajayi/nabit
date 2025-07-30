"use client";
import Image from "next/image";
import { BasePayButton } from '@base-org/account-ui/react';
import { pay, getPaymentStatus } from '@base-org/account';
import { useState } from 'react';

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
  // onAddToCart?: (product: Product) => void;
  onPaymentComplete?: (product: Product, paymentId: string) => void;
  recipientAddress?: string;
  testnet?: boolean;
  collectUserInfo?: boolean;
};

export function ProductCard({
  product,
  // onAddToCart, 
  onPaymentComplete,
  recipientAddress = process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || '0xb3856fAae31C364F1C62A42ccb3E8002B951C027',
  testnet = false,
}: ProductCardProps) {
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentId, setPaymentId] = useState('');

  const handlePayment = async () => {
    try {
      setPaymentStatus('Payment initiated...');
      
      const result = await pay({
        amount: product.price.toString(), 
        to: recipientAddress, 
        testnet: testnet 
      });

      const { id } = result as { id: string };

      setPaymentId(id);
      setPaymentStatus('Payment initiated! Click "Check Status" to see the result.');
      
      // Auto-check status after payment initiation
      setTimeout(() => handleCheckStatus(), 2000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('Payment failed');
    }
  };

  const handleCheckStatus = async () => {
    if (!paymentId) {
      return;
    }

    try {
      const { status } = await getPaymentStatus({ id: paymentId });
      setPaymentStatus(`Payment status: ${status}`);
      
      if (status === 'completed') {
        setPaymentStatus('completed');
        if (onPaymentComplete) {
          onPaymentComplete(product, paymentId);
        }
      } else if (status === 'pending') {
        // Continue checking if still processing
        setTimeout(() => handleCheckStatus(), 3000);
      } else if (status === 'failed' || status === 'not_found') {
        setPaymentStatus('Payment failed');
      }
    } catch (error) {
      console.error('Status check failed:', error);
      setPaymentStatus('Status check failed');
    }
  };

  const getButtonContent = () => {
    if (paymentStatus.includes('completed')) {
      return (
        <div className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-center">
          Successful!
        </div>
      );
    }
    
    if (paymentStatus.includes('initiated')) {
      return (
        <div className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold text-center flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Processing...
        </div>
      );
    }
    
    if (paymentStatus.includes('failed')) {
      return (
        <button
          onClick={handlePayment}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold text-center transition-colors"
        >
          Payment Failed - Retry
        </button>
      );
    }

    return (
      <BasePayButton
        colorScheme="light"
        onClick={handlePayment}
      />
    );
  };

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

        <div className="text-gray-700 text-sm mb-4 line-clamp-2">
          {product.description}
        </div>

        <div className="w-full">
          {getButtonContent()}
        </div>
      </div>
    </div>
  );
}