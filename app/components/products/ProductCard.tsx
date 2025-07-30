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
};

type ProductCardProps = {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onPaymentComplete?: (product: Product, paymentId: string) => void;
  recipientAddress?: string;
  testnet?: boolean;
  collectUserInfo?: boolean;
};

export function ProductCard({
  product,
  onPaymentComplete,
  recipientAddress = process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || '0xb3856fAae31C364F1C62A42ccb3E8002B951C027',
  testnet = true,
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
      
      if (status === 'completed' && onPaymentComplete) {
        onPaymentComplete(product, paymentId);
      }
    } catch (error) {
      console.error('Status check failed:', error);
    }
  };

  const getButtonContent = () => {
    if (paymentStatus.includes('completed')) {
      return (
        <div className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-center">
           Payment Completed!
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center relative overflow-hidden min-w-[180px] max-w-xs w-full">
      <div className="w-full mb-3 aspect-square overflow-hidden rounded-xl">
        <Image
          src={product.images[0] || "/fallback.png"}
          alt={product.name}
          width={320}
          height={320}
          className="object-cover w-full h-full"
          priority
        />
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
          {paymentId && (
            <button
              onClick={handleCheckStatus}
              className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-black py-2 rounded-lg font-semibold text-center transition-colors"
            >
              Check Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
}