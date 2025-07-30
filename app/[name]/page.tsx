// "use client";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import { BasePayButton } from '@base-org/account-ui/react';
// import { pay, getPaymentStatus } from '@base-org/account';
// import { useState, useRef } from 'react';
// import Navbar from "../components/Navbar";

// import { mockProducts } from "../components/products/mockProducts"; 

// export default function ProductDetailsPage() {
//   const params = useParams();
//   const router = useRouter();
//   const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
//   const [showReviews, setShowReviews] = useState(false);
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const statusCheckRef = useRef<NodeJS.Timeout | null>(null);

//   const product = mockProducts.find(
//     (p) => encodeURIComponent(p.name) === params.name
//   );

//   if (!product) return <div>Product not found</div>;

  
//   };




   
//   const handleShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: product.name,
//           text: `Check out this ${product.name} for $${product.price}!`,
//           url: window.location.href,
//         });
//       } catch (error) {
//         console.log('Error sharing:', error);
//       }
//     } else {
//       // Fallback for browsers that don't support Web Share API
//       navigator.clipboard.writeText(window.location.href);
//       alert('Link copied to clipboard!');
//     }
//   };

//   const mockReviews = [
//     { id: 1, name: "Sarah M.", rating: 5, comment: "Amazing quality! Exactly as described.", date: "2 days ago" },
//     { id: 2, name: "John D.", rating: 4, comment: "Good product, fast shipping. Would recommend.", date: "1 week ago" },
//     { id: 3, name: "Emma L.", rating: 5, comment: "Perfect size and beautiful design. Love it!", date: "2 weeks ago" },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Fixed Navbar */}
//       <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
//         <div className="max-w-md mx-auto">
//           <Navbar />
//         </div>
//       </div>

//       {/* Main Content with top padding to account for fixed navbar */}
//       <div className="max-w-md mx-auto pt-20 pb-6">
        
//         {/* Back Button Header */}
//         <div className="flex items-center justify-between px-4 pb-4">
//           <button onClick={() => router.back()} className="text-2xl font-bold text-black">&larr;</button>
//           <h1 className="text-lg font-bold text-black flex-1 text-center">Product Details</h1>
//           <span className="w-8" /> 
//         </div>
       
//         {/* Product Image - Reduced size */}
//         <div className="px-4 mb-6">
//           <div className="w-full max-w-sm mx-auto aspect-square relative rounded-xl overflow-hidden shadow-lg">
//             <Image
//               src={product.images[0]}
//               alt={product.name}
//               fill
//               className="object-cover"
//               sizes="(max-width: 384px) 100vw, 384px"
//             />
//           </div>
//         </div>
       
//         <div className="px-4 space-y-6">
//           {/* Product Info */}
//           <div>
//             <h2 className="text-2xl font-bold mb-2 text-black">{product.name}</h2>
//             <div className="text-gray-600 mb-4 leading-relaxed">{product.description}</div>
//             <div className="mb-4">
//               <span className="text-3xl font-bold text-blue-600">${product.price}</span>
//             </div>
//           </div>
         
//           {/* Variations - Updated colors */}
//           <div>
//             <h3 className="font-bold text-black mb-3">Color Options</h3>
//             <div className="flex gap-2 mb-4">
//               <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">Black</span>
//               <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">Brown</span>
//               <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">Tan</span>
//             </div>
            
//             <h3 className="font-bold text-black mb-3">Size Options</h3>
//             <div className="flex gap-2">
//               <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">Small</span>
//               <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">Medium</span>
//               <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">Large</span>
//             </div>
//           </div>

//           {/* Reviews Section */}
//           <div className="border-t pt-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="font-bold text-black text-lg">Customer Reviews</h3>
//               <button 
//                 onClick={() => setShowReviews(!showReviews)}
//                 className="text-blue-600 font-medium"
//               >
//                 {showReviews ? 'Hide' : 'Show'} Reviews ({mockReviews.length})
//               </button>
//             </div>
            
//             {showReviews && (
//               <div className="space-y-4">
//                 {mockReviews.map((review) => (
//                   <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm border">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="font-medium text-black">{review.name}</span>
//                       <div className="flex items-center gap-2">
//                         <div className="flex text-yellow-400">
//                           {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
//                         </div>
//                         <span className="text-gray-500 text-sm">{review.date}</span>
//                       </div>
//                     </div>
//                     <p className="text-gray-600">{review.comment}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3 pt-4">
//             {/* Base Pay Button */}
//             <div className="flex-1">
//               {paymentStatus === 'completed' ? (
//                 <div className="w-full bg-green-500 text-white py-3 rounded-lg font-bold text-center">
//                   🎉 Order Completed!
//                 </div>
//               ) : paymentStatus === 'processing' ? (
//                 <div className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold text-center flex items-center justify-center gap-2">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Processing...
//                 </div>
//               ) : paymentStatus === 'failed' ? (
//                 <button
//                   onClick={handlePayment}
//                   className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold text-center transition"
//                 >
//                   Payment Failed - Try Again
//                 </button>
//               ) : (
//                 <BasePayButton
//                   colorScheme="light"
//                   onClick={handlePayment}
//                 />
//               )}
//             </div>

//             {/* Share Button */}
//             <button
//               onClick={handleShare}
//               className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
//               </svg>
//               Share
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
