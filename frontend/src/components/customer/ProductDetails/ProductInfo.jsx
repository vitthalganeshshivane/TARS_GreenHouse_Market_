import React from "react";
import ProductVariant from "./ProductVariants";
import { Tag } from "lucide-react";

export default function ProductInfo({ product }) {
  return (
    <div className="mt-5">
      <div className="text-4xl font-semibold text-black-100">
        {product.title}
      </div>
      <div className="flex items-center gap-2 text-green-600 text-sm font-semibold mt-1">
        <span>
          {product?.category?.name || "Grain"} {"<"}{" "}
          {product?.subCategory?.name || "Rice"}
        </span>
        <span>•</span>
        <Tag size={15} />
        {product?.brand}
      </div>
      <div className="flex gap-3 text-[12px] text-gray-700 mt-1">
        <div>{product?.ratings?.average || 4.5}⭐</div>
        <div>({product?.ratings?.count || 20} reviews)</div>
      </div>

      <div className="text-sm text-slate-500 mt-3">{product?.description}</div>
      <ProductVariant product={product} />
    </div>
  );
}
