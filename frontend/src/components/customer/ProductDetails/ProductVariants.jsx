import React, { useState } from "react";
import { Heart, IndianRupee, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductVariant({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="mt-2">
      <div className="flex items-center text-4xl font-bold text-green-500">
        <IndianRupee size={26} strokeWidth={3} />
        {selectedVariant?.price}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <div className="text-[12px] text-slate-500">Size / Weight :</div>
        {product.variants.map((variant) => (
          <button
            key={variant._id}
            onClick={() => setSelectedVariant(variant)}
            className={`px-1 py-1 rounded cursor-pointer text-[12px] text-slate-500 ${selectedVariant._id === variant._id ? "bg-green-500 text-white" : "bg-white"}`}
          >
            {variant.label}
          </button>
        ))}
      </div>
      <div className="flex items-center  mt-4">
        <div className="border-2 border-green-500 rounded">
          <button
            className="p-2 text-green-500 cursor-pointer"
            onClick={handleDecrement}
          >
            <Minus className="h-3 w-3" strokeWidth={3} />
          </button>

          <span className="w-3 text-center font-bold text-sm text-slate-500">
            {quantity}
          </span>

          <button
            onClick={handleIncrement}
            className="p-2 text-green-500 cursor-pointer"
          >
            <Plus className="h-3 w-3" strokeWidth={3} />
          </button>
        </div>

        <div className="bg-green-500 rounded ml-3">
          <button className="flex items-center gap-2 text-white text-[13px] px-2 py-2 cursor-pointer">
            <span>
              <ShoppingCart size={16} strokeWidth={2} />
            </span>
            <span>Add to Cart</span>
          </button>
        </div>

        <div className="p-2 border-1 border-gray-200 ml-3 rounded cursor-pointer">
          <Heart className="text-gray-500" size={18} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
