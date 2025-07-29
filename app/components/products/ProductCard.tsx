"use client";
import Image from "next/image";
import { BasePayButton } from '@base-org/account-ui/react';
import { pay, getPaymentStatus } from '@base-org/account';
import { useState, useRef } from 'react';

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

export function ProductCard({ product }: ProductCardProps) {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const statusCheckRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeouts = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (statusCheckRef.current) {
      clearTimeout(statusCheckRef.current);
      statusCheckRef.current = null;
    }
  };

  const handlePayment = async () => {
    try {
      setPaymentStatus('processing');
      clearTimeouts();
      
      // Set 20-second timeout to return to idle state
      timeoutRef.current = setTimeout(() => {
        console.log('Payment timeout - returning to idle state');
        setPaymentStatus('idle');
        clearTimeouts();
      }, 20000);

      const { id } = await pay({
        amount: product.price.toString(),    
        to: process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || '0xb3856fAae31C364F1C62A42ccb3E8002B951C027',   
        testnet: false           // set false for Mainnet
      });

      const checkStatus = async () => {
        const { status } = await getPaymentStatus({ id });
        if (status === 'completed') {
          clearTimeouts();
          setPaymentStatus('completed');
        } else if (status === 'failed') {
          clearTimeouts();
          setPaymentStatus('failed');
        } else {
          // Continue checking only if we're still within the timeout period
          statusCheckRef.current = setTimeout(checkStatus, 1000);
        }
      };
      
      checkStatus();

    } catch (error) {
      console.error('Payment error:', error);
      clearTimeouts();
      setPaymentStatus('failed');
    }
  };

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
        <div className="text-gray-700 text-sm mb-4 line-clamp-2">{product.description}</div>
        
        <div className="w-full">
          {paymentStatus === 'completed' ? (
            <div className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-center">
              Order Completed
            </div>
          ) : paymentStatus === 'processing' ? (
            <div className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold text-center flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : paymentStatus === 'failed' ? (
            <div className="w-full bg-red-500 text-white py-3 rounded-lg font-bold text-center">
              Payment Failed - Try Again
            </div>
          ) : (
            <BasePayButton
              colorScheme="light"
              onClick={handlePayment}
            />
          )}
        </div>
      </div>
    </div>
  );
}