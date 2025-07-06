"use client";
import { useEffect, useState } from "react";
// import Image from "next/image";
import { ProductCard } from "./ProductCard";
// import ProductDetails from "./ProductDetails";
import { useRouter } from "next/navigation";
import { mockProducts } from "../../components/products/mockProducts";
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

export default function ProductList({ onAddToCart }: ProductListProps) {
  const [activeTab, setActiveTab] = useState("Home");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<typeof mockProducts>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // useEffect(() => {
  //   async function fetchProducts() {
  //     setLoading(true);
  //     try {
  //       const res = await fetch("/api/products"); // or your backend endpoint
  //       const data = await res.json();
  //       setProducts(data);
  //     } catch (err) {
  //       setProducts([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchProducts();
  // }, []);

  useEffect(() => {
    setProducts(mockProducts);
    setLoading(false);
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
    <div className="w-full max-w-md mx-auto px-4 py-3 bg-[#f7f9fb] min-h-screen">
      <Navbar />
      <div>
      

        <div className="px-4 mb-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#e9eef4] rounded-xl px-4 py-3 w-full placeholder:text-gray-300 text-black text-lg outline-none"
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
                    onAddToCart={onAddToCart}
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
