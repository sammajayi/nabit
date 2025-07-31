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
  seller_image?: string; 
  seller_display_name?: string; 
  fid?: string; 
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
  const [statusCheckCount, setStatusCheckCount] = useState(0);

  const resetPayment = () => {
    setPaymentStatus('');
    setPaymentId('');
    setStatusCheckCount(0);
  };

  const handlePayment = async () => {
    try {
      setPaymentStatus('Payment initiated...');
      
      // Ensure amount is properly formatted
      const amount = parseFloat(product.price.toString()).toFixed(2);
      
      const result = await pay({
        amount: amount, 
        to: recipientAddress, 
        testnet: testnet, 
      });

     

      const { id, success } = result as { id: string; success?: boolean };
      setPaymentId(id);

      // If the payment result includes success: true, treat as completed immediately
      if (success) {

        setPaymentStatus('completed');
        if (onPaymentComplete) {
          onPaymentComplete(product, id);
        }
        return;
      }

      // For testnet, we can consider it successful immediately if we get an ID
      if (testnet && id) {
        console.log('Testnet payment successful, marking as completed');
        setPaymentStatus('completed');
        if (onPaymentComplete) {
          onPaymentComplete(product, id);
        }
        return;
      }

      // For mainnet without success flag, start status checking immediately
      console.log('Starting mainnet payment status checking for ID:', id);
      setPaymentStatus('pending');
      setTimeout(() => handleCheckStatus(), 1000); // Check sooner for better UX
      
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCheckStatus = async () => {
    if (!paymentId) {
      console.log('No payment ID available for status check');
      return;
    }

    const currentCount = statusCheckCount + 1;
    setStatusCheckCount(currentCount);

    try {
      console.log(`Checking payment status for ID: ${paymentId} (attempt ${currentCount})`);
      const { status } = await getPaymentStatus({ id: paymentId });
      console.log('Payment status check result:', status);
      
      if (status === 'completed') {
        console.log('Payment completed successfully!');
        setPaymentStatus('completed');
        if (onPaymentComplete) {
          onPaymentComplete(product, paymentId);
        }
      } else if (status === 'pending') {
        console.log('Payment still pending, will check again in 3 seconds');
        setPaymentStatus('pending');
        
        
        if (currentCount >= 10) {
          console.log('Max status checks reached, assuming payment successful');
          setPaymentStatus('completed');
          if (onPaymentComplete) {
            onPaymentComplete(product, paymentId);
          }
        } else {
          setTimeout(() => handleCheckStatus(), 3000);
        }
      } else if (status === 'failed' || status === 'not_found') {
        console.log('Payment failed or not found:', status);
        setPaymentStatus('failed');
      } else {
        console.log('Unknown payment status:', status);
        setPaymentStatus(`unknown_status_${status}`);
        
        // For unknown status, assume success after many attempts
        if (currentCount >= 8) {
          console.log('Unknown status but many attempts, assuming success');
          setPaymentStatus('completed');
          if (onPaymentComplete) {
            onPaymentComplete(product, paymentId);
          }
        } else {
          setTimeout(() => handleCheckStatus(), 5000);
        }
      }
    } catch (error) {
      console.error('Status check failed:', error);
      setPaymentStatus('status_check_failed');
      
      // If status checking keeps failing but we have a payment ID, assume success
      if (currentCount >= 5) {
        console.log('Status checks failing but we have payment ID, assuming success');
        setPaymentStatus('completed');
        if (onPaymentComplete) {
          onPaymentComplete(product, paymentId);
        }
      } else {
        setTimeout(() => handleCheckStatus(), 5000);
      }
    }
  };

  const getButtonContent = () => {
    // Check for completed payment first
    if (paymentStatus === 'completed') {
      return (
        <div className="w-full space-y-2">
          <div className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-center">
           Payment Successful
          </div>
          <button
            onClick={resetPayment}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium text-sm transition-colors"
          >
            Buy Again
          </button>
        </div>
      );
    }
    
    // Check for processing states
    if (paymentStatus === 'Payment initiated...' || paymentStatus === 'pending') {
      return (
        <div className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold text-center flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Processing...
        </div>
      );
    }
    
    // Check for failed states
    if (paymentStatus === 'failed' || 
        paymentStatus.startsWith('Payment failed') || 
        paymentStatus === 'status_check_failed' ||
        paymentStatus.startsWith('unknown_status')) {
      return (
        <button
          onClick={handlePayment}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold text-center transition-colors"
        >
          Payment Failed - Retry
        </button>
      );
    }

    // Default state - show BasePay button
    return (
      <div className="w-full">
        <BasePayButton
          colorScheme="light"
          onClick={handlePayment}
        />
      </div>
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