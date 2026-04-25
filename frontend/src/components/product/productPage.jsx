"use client";

import { useState } from "react";
import { Heart, Share2, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";

export default function ProductPage() {

const [mode,setMode] = useState('description'); //description, additional, vendor, review

  const product = {
    id: "1",
    name: "Premium Cotton T-Shirt",
    target: "Men",
    detail:
      "This is a high-quality cotton t-shirt. Soft, breathable and perfect for everyday wear. Aliquam rem officia, corrupti reiciendis minima nisi modi, quasi, odio minus dolore impedit fuga eum eligendi.",
    pictures: [
      { imageLink: "https://picsum.photos/600?1", position: 1 },
      { imageLink: "https://picsum.photos/600?2", position: 2 },
      { imageLink: "https://picsum.photos/600?3", position: 3 },
      { imageLink: "https://picsum.photos/600?4", position: 4 },
    ],
    
    variants: [
      { _id: "v1", size: "S",   price: 399, discount: 100 },
      { _id: "v2", size: "M",   price: 499, discount: 200 },
      { _id: "v3", size: "L",   price: 599, discount: 200 },
      { _id: "v4", size: "XL",  price: 699, discount: 200 },
      { _id: "v5", size: "XXL", price: 799, discount: 200 },
    ],
    tags: [{ name: "Cotton" }, { name: "Casual" }, { name: "Summer" }],
    meta: {
      type: "Organic",
      sku: "PCT-M-2024",
      mfg: "Jan 1, 2024",
      life: "2 years",
      stock: 8,
    },
    rating: 4,
    reviewCount: 32,
  };

  const images = product.pictures.map((p) => p.imageLink);

  const sizes = product.variants.map((v) => ({
    id: v._id,
    size: v.size,
    price: v.price,
    strikePrice: v.price + v.discount,
  }));

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(sizes[1]);

  const discountPct = Math.round(
    ((selectedVariant.strikePrice - selectedVariant.price) /
      selectedVariant.strikePrice) *
      100
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl md:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          {/* ── Left: Images ── */}
          <div>
            <div className="rounded-lg md:rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center aspect-square">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex gap-2 sm:gap-3 mt-3 md:mt-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveImage(i)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all p-0 hover:bg-transparent ${
                    activeImage === i
                      ? "border-emerald-500"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </Button>
              ))}
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div className="flex flex-col gap-3 md:gap-4">

            {/* Sale badge */}
            <div>
              <span className="inline-block bg-pink-100 text-pink-600 text-xs font-medium px-3 py-1 rounded-full">
                Sale Off
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>

            {/* Stars */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < product.rating
                        ? "text-amber-400"
                        : "text-gray-200"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span>({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                ₹{selectedVariant.price}
              </span>
              <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                {discountPct}% OFF
              </span>
              <span className="text-sm sm:text-base text-gray-400 line-through">
                ₹{selectedVariant.strikePrice}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed border-b border-gray-100 pb-3 md:pb-4">
              {product.detail}
            </p>

            {/* Size selector */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Size / Weight
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <Button
                    key={s.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedVariant(s)}
                    className={`px-4 py-1.5 ${
                      selectedVariant.id === s.id
                        ? "border-emerald-500 text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                        : "hover:border-gray-400"
                    }`}
                  >
                    {s.size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity + Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Qty spinner */}
                <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-9 rounded-none text-lg hover:bg-gray-50"
                  >
                    −
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-9 rounded-none text-lg hover:bg-gray-50"
                  >
                    +
                  </Button>
                </div>

                {/* Add to Cart */}
                <Button className="flex-1 sm:flex-auto bg-emerald-500 hover:bg-emerald-600 text-white h-9">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden xs:inline">Add to cart</span>
                  <span className="xs:hidden">Add</span>
                </Button>
              </div>

              <div className="flex gap-2 justify-end sm:justify-start">
                {/* Wishlist */}
                <Button 
                  variant="outline"
                  size="icon"
                  className="hover:text-pink-500 hover:border-pink-300"
                >
                  <Heart className="w-4 h-4" />
                </Button>

                {/* Share */}
                <Button 
                  variant="outline"
                  size="icon"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm border-t border-gray-100 pt-3 md:pt-4">
              <div className="flex gap-2">
                <span className="text-gray-400 w-14 sm:w-12 shrink-0">Type</span>
                <span className="text-gray-700">{product.meta.type}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-14 sm:w-12 shrink-0">SKU</span>
                <span className="text-gray-700">{product.meta.sku}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-14 sm:w-12 shrink-0">MFG</span>
                <span className="text-gray-700">{product.meta.mfg}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-14 sm:w-12 shrink-0">Tags</span>
                <span className="text-gray-700 flex-wrap">
                  {product.tags.map((t, i) => (
                    <span key={i}>
                      <a href="#" className="text-emerald-600 hover:underline">
                        {t.name}
                      </a>
                      {i < product.tags.length - 1 && ", "}
                    </span>
                  ))}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-14 sm:w-12 shrink-0">LIFE</span>
                <span className="text-gray-700">{product.meta.life}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-14 sm:w-12 shrink-0">Stock</span>
                <span className="text-emerald-600 font-medium">
                  {product.meta.stock} Items In Stock
                </span>
              </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 md:mt-4">
         <Button variant='outline' size='sm' className="text-xs sm:text-sm" onClick={()=>{setMode('description')}}>Description</Button>
         <Button variant='outline' size='sm' className="text-xs sm:text-sm" onClick={()=>{setMode('additional')}}>Additional info</Button>
         <Button variant='outline' size='sm' className="text-xs sm:text-sm" onClick={()=>{setMode('vendor')}}>Vendor</Button>
         <Button variant='outline' size='sm' className="text-xs sm:text-sm" onClick={()=>{setMode('review')}}>Reviews(3)</Button>
        </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




