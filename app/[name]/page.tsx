"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { BasePayButton } from '@base-org/account-ui/react';
import { pay, getPaymentStatus } from '@base-org/account';
import { useState } from 'react';
import Navbar from "../components/Navbar";
import { ArrowLeft, Share2Icon } from "lucide-react";
import SuccessPage from "../SuccessPage/page";

import { mockProducts } from "../components/products/mockProducts"; 

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [showReviews, setShowReviews] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  const product = mockProducts.find(
    (p) => encodeURIComponent(p.name) === params.name
  );

  if (!product) return <div>Product not found</div>;

  const handlePayment = async () => {
    try {
      setPaymentStatus('Payment initiated...');
      
      const result = await pay({
        amount: product.price.toString(), 
        to: process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || '0xb3856fAae31C364F1C62A42ccb3E8002B951C027',
        testnet: false,
      });

      console.log('Payment result:', result);

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
        // Show success page instead of just updating status
        setTimeout(() => setShowSuccessPage(true), 500);
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
          🎉 Processing Success...
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
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold text-center transition"
        >
          Payment Failed - Try Again
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this ${product.name} for $${product.price}!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const mockReviews = [
    { id: 1, name: "Sarah M.", rating: 5, comment: "Amazing quality! Exactly as described.", date: "2 days ago" },
    { id: 2, name: "John D.", rating: 4, comment: "Good product, fast shipping. Would recommend.", date: "1 week ago" },
    { id: 3, name: "Emma L.", rating: 5, comment: "Perfect size and beautiful design. Love it!", date: "2 weeks ago" },
  ];

  if (showSuccessPage) {
    return <SuccessPage product={product} paymentId={paymentId} onShare={handleShare} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed bg-white left-1/2 -translate-x-1/2 border-b-2 max-w-md w-full z-20">
        <Navbar />
      </div>

      <div className="max-w-md mx-auto pt-20 pb-24">
        <div className="flex items-center justify-between px-4 pb-4">
          <button onClick={() => router.back()} className="text-xl font-bold text-black" aria-label="back-button">
            <ArrowLeft />
          </button>
          <h1 className="text-lg font-bold text-black flex-1 text-center">Product Details</h1>
          <span className="w-8" /> 
        </div>

        <div className="px-4 mb-6">
          <div className="w-full max-w-sm mx-auto aspect-square relative rounded-xl overflow-hidden shadow-lg">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 384px) 100vw, 384px"
            />
          </div>
        </div>
       
        <div className="px-4 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-black">{product.name}</h2>
            <div className="text-gray-600 mb-4 leading-relaxed">{product.description}</div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-blue-600">${product.price}</span>
            </div>
          </div>
         
          <div>
            <h3 className="font-bold text-black mb-3">Color Options</h3>
            <div className="flex gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">Black</span>
              <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">Brown</span>
              <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">Tan</span>
            </div>
            
            <h3 className="font-bold text-black mb-3">Size Options</h3>
            <div className="flex gap-2">
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">Small</span>
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">Medium</span>
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">Large</span>
            </div>
          </div>

          <div className="border-t py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-black text-lg">Customer Reviews</h3>
              <button 
                onClick={() => setShowReviews(!showReviews)}
                className="text-blue-600 font-medium"
              >
                {showReviews ? 'Hide' : 'Show'} Reviews ({mockReviews.length})
              </button>
            </div>
            
            {showReviews && (
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-black">{review.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                        </div>
                        <span className="text-gray-500 text-sm">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-white border-t max-w-md w-full z-50">
        <div className="max-w-md mx-auto p-4">
          <div className="flex gap-3">
            <div className="flex-1">
              {getButtonContent()}
            </div>
            <button
              onClick={handleShare}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
            >
             <Share2Icon width={20} height={20} aria-label="Share" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}