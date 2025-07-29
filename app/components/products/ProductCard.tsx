"use client";
import Image from "next/image";
import { BasePayButton } from '@base-org/account-ui/react';
import { pay, getPaymentStatus } from '@base-org/account';
import { useState, useRef, useEffect } from 'react';

// Define proper types based on Base Pay API
interface PayConfig {
  amount: string;
  to: string;
  testnet: boolean;
  payerInfo?: {
    requests: Array<{
      type: 'email' | 'name' | 'phoneNumber' | 'physicalAddress' | 'onchainAddress';
      optional?: boolean;
    }>;
    callbackURL?: string;
  };
}

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
  testnet = false,
  collectUserInfo = false
}: ProductCardProps) {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [, setPaymentId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const statusCheckRef = useRef<NodeJS.Timeout | null>(null);

  
  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, []);

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

  const pollPaymentStatus = async (id: string) => {
    try {
      const { status } = await getPaymentStatus({ id });
    

      if (status === 'completed') {
        
        setPaymentStatus('completed');
        clearTimeouts();
        onPaymentComplete?.(product, id);
      } else if (status === 'failed') {
 
        setPaymentStatus('failed');
        clearTimeouts();
      } else {
        // Continue polling - most payments confirm in <2 seconds per docs
        statusCheckRef.current = setTimeout(() => pollPaymentStatus(id), 2000);
      }
    } catch (error) {
      console.error('⚠️ Error checking payment status:', error);
      setPaymentStatus('failed');
      clearTimeouts();
    }
  };

  const handlePayment = async () => {
    try {
      setPaymentStatus('processing');
      clearTimeouts();

      timeoutRef.current = setTimeout(() => {
        setPaymentStatus('idle');
        clearTimeouts();
      }, 180000);

      const paymentConfig: PayConfig = {
        amount: product.price.toString(),
        to: recipientAddress,
        testnet: testnet
      };

      if (collectUserInfo) {
        paymentConfig.payerInfo = {
          requests: [
            { type: 'email' },
            { type: 'name', optional: true }
          ]
        };
      }

      console.log('Initiating payment for:', product.name);

      const paymentResponse = await pay(paymentConfig);
      const id = (paymentResponse as any).id;

      setPaymentId(id);
      pollPaymentStatus(id);

    } catch (error) {
      console.error('⚠️ Payment initialization error:', error);
      setPaymentStatus('failed');
      clearTimeouts();
    }
  };

  const handleRetry = () => {
    setPaymentStatus('idle');
    setPaymentId(null);
    clearTimeouts();
  };

  const getButtonContent = () => {
    switch (paymentStatus) {
      case 'completed':
        return (
          <div className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-center">
            Payment Completed
          </div>
        );
      case 'processing':
        return (
          <div className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold text-center flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing Payment...
          </div>
        );
      case 'failed':
        return (
          <button
            onClick={handleRetry}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold text-center transition-colors"
          >
            Payment Failed - Retry
          </button>
        );
      default:
        return (
          <BasePayButton
            colorScheme="light"
            onClick={handlePayment}
          />
        );
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

        <div className="text-gray-700 text-sm mb-4 line-clamp-2">
          {product.description}
        </div>

        <div className="w-full">
          {getButtonContent()}
        </div>

        
        {/* {paymentId && (
          <div className="text-xs text-gray-500 mt-2 text-center truncate">
            ID: {paymentId}
          </div>
        )} */}
      </div>
    </div>
  );
}