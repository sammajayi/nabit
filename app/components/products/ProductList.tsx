"use client";
import { useEffect, useState } from "react";

import { ProductCard } from "./ProductCard";

import { useRouter } from "next/navigation";
import Navbar from "../Navbar";



const categories = [
  { id: "Home", label: "Home" },
  { id: "Art", label: "Art" },
  { id: "Tech", label: "Tech" },
  { id: "Fashion", label: "Fashion" },
];

type Product = {
  name: string;
  images: string[];
  price: number | string;
  description: string;
  category: string;
  owner: string;
};

type ProductListProps = {
  onAddToCart?: (product: Product) => void;
};

export default function ProductList({ }: ProductListProps) {
  const [activeTab, setActiveTab] = useState("Home");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const { address, isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch  {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter products by active category and search term
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeTab === "Home" || product.category === activeTab;
    const matchesSearch = searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-md mx-auto bg-[#f7f9fb] min-h-screen">
      <Navbar />
      <div className="pt-20 px-4 pb-20">{/* Add top padding for fixed navbar and bottom padding for BottomNav */}


        <div className="px-4 my-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#e9eef4] rounded-xl px-4 py-3 w-full placeholder:text-gray-500 text-black text-xs outline-none"
            placeholder="Search products"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex space-x-6 px-4 mb-2 border-b border-gray-200">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`pb-2 text-lg font-medium transition-colors ${activeTab === category.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-400 border-b-2 border-transparent"
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Products Section */}
        <div className="px-4 mt-4">
          {loading ? (
            <div className="text-black">Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-gray-400">
              {searchTerm ? `No products found for "${searchTerm}"` : "No products in this category."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.name}
                  onClick={() => router.push(`/${encodeURIComponent(product.name)}`)}
                  className="cursor-pointer"
                >
                  <ProductCard
                    product={product}
                    onPaymentComplete={(product, paymentId) => {
                      console.log('Payment completed for:', product.name, 'Payment ID:', paymentId);
                      // Navigate to success page or show success message
                      router.push(`/success?product=${encodeURIComponent(product.name)}&paymentId=${paymentId}`);
                    }}
                  // onAddToCart={onAddToCart}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
