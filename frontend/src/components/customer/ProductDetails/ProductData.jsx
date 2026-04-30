import React from "react";

export default function ProductData({ product }) {
  const mfg = product?.mfgDate?.split("T")[0] || "N/A";
  return (
    <div className="flex mt-6 gap-5">
      <div className="text-[12px] text-slate-500">
        <div className="mb-1">
          Type: <span className="text-green-500">{product?.type}</span>
        </div>
        <div className="mb-1">
          MFG: <span className="text-green-500">{mfg}</span>
        </div>
        <div className="mb-1">
          LIFE: <span className="text-green-500">{product?.life} days</span>
        </div>
      </div>

      <div className="text-[12px] text-slate-500">
        <div className="mb-1">
          SKU: <span className="text-green-500">{product?.sku}</span>
        </div>
        <div className="mb-1">
          Tags:{" "}
          {(product?.tags || []).map((pro, index) => (
            <span key={index} className="text-green-500">
              {pro},{" "}
            </span>
          ))}
        </div>
        <div className="mb-1">
          Stock:{" "}
          <span className="text-green-500">
            {product?.stock || 5} items in stock
          </span>
        </div>
      </div>
    </div>
  );
}
