import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import type { NeynarUser } from '@/lib/neynar';
import { useFarcasterFid } from "../../hooks/useFarcasterFid";
export default function Profile() {

  const [user, setUser] = useState<Partial<NeynarUser> | null>(null);
  const [, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  type Product = {
    id: string;
    name: string;
    category: string;
    images: string[];
    price: number;
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);



  const fid = useFarcasterFid();


  const stats = {
    listings: 0,
    sold: 0,
    total: 0, 
  };

  useEffect(() => {
    if (!fid) {
      setUser(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/farcaster/user?fid=${fid}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 404) {

          return null;
        } else {
          return Promise.reject("Failed to fetch user");
        }
      })
      .then((data) => setUser(data))
      .catch((err) => {
        setError(err.message || err);
        setUser(null);
      })
      .finally(() => setLoading(false));
    // Fetch products for this user
    setProductsLoading(true);
    fetch(`/api/products?fid=${fid}`)
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch products"))
      .then(data => setProducts(data))
      .catch(err => setProductsError(err.message))
      .finally(() => setProductsLoading(false));
  }, [fid]);

  if (loading) return (
    <div className="flex flex-col items-center p-6 rounded-2xl  bg-white mt-6 max-w-xs mx-auto">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      {/* <p className="mt-4 text-gray-500 text-sm">Loading profile...</p> */}
    </div>
  );
  if (!user) return null

  return (
    <div className="flex flex-col items-center p-6 rounded-2xl shadow-md  bg-white mt-6 max-w-xs mx-auto">

      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 shadow mb-3">
        <Image
          src={user.pfp_url ?? ""}
          alt={user.display_name ?? ""}
          width={96}
          height={96}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="text-xl font-bold text-gray-900">{user.display_name}</div>

      <div className="text-gray-500 text-sm mb-4">@{user.username}</div>

      <div className="flex w-full justify-between bg-gray-50 rounded-lg p-3 mt-2">
        <div className="flex flex-col items-center flex-1">
          <span className="font-semibold text-gray-800">{stats.listings}</span>
          <span className="text-xs text-gray-500">Listings</span>
        </div>
        <div className="flex flex-col items-center flex-1 border-l border-gray-200">
          <span className="font-semibold text-gray-800">{stats.sold}</span>
          <span className="text-xs text-gray-500">Sold</span>
        </div>
        <div className="flex flex-col items-center flex-1 border-l border-gray-200">
          <span className="font-semibold text-gray-800">{stats.total} ETH</span>
          <span className="text-xs text-gray-500">Total Made</span>
        </div>
      </div>

     {/* User's Products */}
     <div className="w-full mt-6">
       <h2 className="text-lg font-bold mb-2">My Listings</h2>
       {productsLoading ? (
         <div>Loading products...</div>
       ) : productsError ? (
         <div className="text-red-500">{productsError}</div>
       ) : products.length === 0 ? (
         <div className="text-gray-400">No products listed yet.</div>
       ) : (
         <ul className="space-y-4">
           {products.map((product) => (
             <li key={product.id} className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-all duration-200 hover:border-gray-300">
               <div className="flex items-center gap-4">
                 {/* Product Image - Left Side */}
                 <div className="flex-shrink-0">
                   {product.images && product.images.length > 0 ? (
                     <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                       <Image
                         src={product.images[0]}
                         alt={product.name}
                         width={64}
                         height={64}
                         className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                       />
                     </div>
                   ) : (
                     <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-200">
                       <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                     </div>
                   )}
                 </div>
                 
                 {/* Product Details - Right Side */}
                 <div className="flex-1 min-w-0">
                   <div className="flex items-start justify-between">
                     <div className="flex-1 min-w-0 pr-2">
                       <h3 className="font-semibold text-gray-900 text-base leading-5 truncate mb-1">
                         {product.name}
                       </h3>
                       <div className="flex items-center gap-2 mb-2">
                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                           {product.category}
                         </span>
                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                           Active
                         </span>
                       </div>
                     </div>
                     
                     {/* Price - Right Side */}
                     <div className="text-right flex-shrink-0">
                       <div className="text-lg font-bold text-green-600">
                         ${product.price}
                       </div>
                       <div className="text-xs text-gray-500">
                         Listed
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </li>
           ))}
         </ul>
       )}
     </div>

  
    </div>
  );
}