"use client";

export function ProductCard({ product }: { product: { name: string } }) {
  return (
    <div className="border rounded p-2 mb-2">
      <span>{product.name}</span>
    </div>
  );
} 