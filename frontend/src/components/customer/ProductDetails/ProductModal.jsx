import React from "react";
import ProductInfo from "./ProductInfo";
import ProductData from "./ProductData";

import ProductImage from "./ProductImage";

export default function ProductModal({ product }) {
  return (
    <div className="max-w-[900px] mx-auto sm:flex justify-center mt-5 p-5 gap-5 bg-transparent">
      <ProductImage images={product.images} />
      <div>
        <ProductInfo product={product} />
        <ProductData product={product} />
      </div>
    </div>
  );
}
