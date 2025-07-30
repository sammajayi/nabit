"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle, Home } from "lucide-react";

type Product = {
  name: string;
  images: string[];
  price: number | string;
  description: string;
  category: string;
  owner: string;
};

type SuccessPageProps = {
  product: Product;
  paymentId: string;
  onShare: () => void;
};

export default function SuccessPage({ product, paymentId, onShare }: SuccessPageProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Successful!</h1>
            <p className="text-gray-600">Your payment has been processed successfully</p>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-600">${product.price}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                <span>Payment ID:</span>
                <span className="font-mono text-xs">{paymentId.slice(0, 12)}...</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Status:</span>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Continue Shopping
            </button>
            
            <button
              onClick={onShare}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share This Product
            </button>
          </div>

          {/* Thank You Message */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-500">
              Thank you for your purchase! You&apos;ll receive a confirmation email shortly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}