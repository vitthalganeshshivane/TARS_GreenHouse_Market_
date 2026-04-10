import React, { useState } from "react";

export default function ProductInfoSection({ product }) {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="border rounded-xl p-5">
      <div className="flex gap-6 text-sm">
        <button
          onClick={() => setActiveTab("info")}
          className={`py-1 px-2 ${activeTab === "info" ? "border rounded-full border-gray-400 text-green-600" : "text-gray-500"}`}
        >
          Additional Info
        </button>

        <button
          onClick={() => setActiveTab("vendor")}
          className={`py-1 px-2 ${activeTab === "vendor" ? "border rounded-full border-gray-400 text-green-600" : "text-gray-500"}`}
        >
          Vendor
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "info" && (
          <div>
            <div className="mt-5">
              <h3 className="text-2xl font-semibold text-black/80 border-b border-gray-100">
                Description
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                {product.description}
              </p>
            </div>

            <div className="mt-5">
              <h3 className="text-2xl font-semibold text-black/80 border-b border-gray-100">
                Packaging
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                {product.additionalInfo.packaging}
              </p>
            </div>
            <div className="mt-5">
              <h3 className="text-2xl font-semibold text-black/80 border-b border-gray-100">
                Ingredients
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                {product.additionalInfo.ingredients}
              </p>
            </div>
            <div className="mt-5">
              <h3 className="text-2xl font-semibold text-black/80 border-b border-gray-100">
                Warnings
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                {product.additionalInfo.warnings}
              </p>
            </div>
          </div>
        )}

        {activeTab === "vendor" && (
          <div>
            <div className="mt-5">
              <h3 className="text-2xl font-semibold text-black/80 border-b border-gray-100">
                Name
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                {product.vendor.name}
              </p>
            </div>

            <div className="mt-5">
              <h3 className="text-2xl font-semibold text-black/80 border-b border-gray-100">
                Email
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                {product.vendor.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
