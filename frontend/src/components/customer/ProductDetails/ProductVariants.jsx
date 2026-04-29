import React, { useEffect, useState } from "react";
import { Heart, IndianRupee, Minus, Plus, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  optimisticAdd,
  addToCartAsync,
  updateCartAsync,
} from "../../../redux/slices/cartSlice";
import toast from "react-hot-toast";

import {
  addToWishlistAsync,
  removeFromWishlistAsync,
} from "../../../redux/slices/wishlistSlice";

export default function ProductVariant({ product }) {
  const dispatch = useDispatch();
  const { items = [] } = useSelector((state) => state.cart);

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [inputVal, setInputVal] = useState("1");

  const getProductId = (item) => item.product?._id || item.product;

  const wishlistItems = useSelector((state) => state.wishlist?.items ?? []);

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const handleWishlist = async () => {
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlistAsync(product._id)).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await dispatch(addToWishlistAsync(product._id)).unwrap();
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Wishlist action failed");
      console.log(error);
    }
  };

  // ✅ Derived during render — always fresh

  const existingItem = items.find(
    (item) =>
      getProductId(item) === product._id &&
      item.variant?.label === selectedVariant.label,
  );

  useEffect(() => {
    if (existingItem) {
      setQuantity(existingItem.quantity);
      setInputVal(String(existingItem.quantity));
    } else {
      setQuantity(1);
      setInputVal("1");
    }
  }, [existingItem]);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);

    const cartItem = items.find(
      (item) =>
        getProductId(item) === product._id &&
        item.variant?.label === variant.label,
    );

    if (cartItem) {
      setQuantity(cartItem.quantity);
      setInputVal(String(cartItem.quantity));
    } else {
      setQuantity(1);
      setInputVal("1");
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => {
      const next = prev + 1;
      setInputVal(String(next));
      return next;
    });
  };

  const handleDecrement = () => {
    setQuantity((prev) => {
      const next = prev > 1 ? prev - 1 : 1;
      setInputVal(String(next));
      return next;
    });
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const finalPrice = selectedVariant.discountPrice || selectedVariant.price;

    if (existingItem) {
      dispatch(
        updateCartAsync({
          productId: product._id,
          variantLabel: selectedVariant.label,
          quantity,
        }),
      );

      toast.success("Cart updated");
      return;
    }

    dispatch(
      optimisticAdd({
        productId: product._id,
        variantLabel: selectedVariant.label,
        price: finalPrice,
        name: product.title,
        image: product.thumbnail,
        quantity,
      }),
    );

    dispatch(
      addToCartAsync({
        productId: product._id,
        variantLabel: selectedVariant.label,
        quantity,
      }),
    );

    toast.success("Item added to cart");
  };

  return (
    <div className="mt-2">
      <div className="flex items-center text-4xl font-bold text-green-500">
        <IndianRupee size={26} strokeWidth={3} />
        {selectedVariant?.discountPrice || selectedVariant?.price}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <div className="text-[12px] text-slate-500">Size / Weight :</div>

        {product.variants.map((variant) => (
          <button
            key={variant._id}
            onClick={() => handleVariantChange(variant)}
            className={`px-1 py-1 rounded cursor-pointer text-[12px] ${
              selectedVariant._id === variant._id
                ? "bg-green-500 text-white"
                : "bg-white text-slate-500"
            }`}
          >
            {variant.label}
          </button>
        ))}
      </div>

      <div className="flex items-center mt-4">
        <div className="border-2 border-green-500 rounded">
          <button
            className="p-2 text-green-500 cursor-pointer"
            onClick={handleDecrement}
          >
            <Minus className="h-3 w-3" strokeWidth={3} />
          </button>

          <input
            type="number"
            min={1}
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              const val = parseInt(e.target.value);

              if (!isNaN(val) && val >= 1) {
                setQuantity(val);
              }
            }}
            onBlur={() => {
              const val = parseInt(inputVal);

              if (isNaN(val) || val < 1) {
                setInputVal("1");
                setQuantity(1);
              } else {
                setInputVal(String(val));
                setQuantity(val);
              }
            }}
            className="w-8 text-center font-bold text-sm text-slate-500 outline-none bg-transparent"
          />

          <button
            onClick={handleIncrement}
            className="p-2 text-green-500 cursor-pointer"
          >
            <Plus className="h-3 w-3" strokeWidth={3} />
          </button>
        </div>

        <div className="bg-green-500 rounded ml-3">
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 text-white text-[13px] px-2 py-2 cursor-pointer"
          >
            <ShoppingCart size={16} strokeWidth={2} />
            <span>{existingItem ? "Update cart" : "Add to Cart"}</span>
          </button>
        </div>

        <div
          onClick={handleWishlist}
          className="p-2 border border-gray-200 ml-3 rounded cursor-pointer"
          className="p-2 border border-gray-200 ml-3 rounded cursor-pointer"
        >
          <Heart
            className={
              isWishlisted ? "text-red-500 fill-red-500" : "text-gray-500"
            }
            size={18}
            strokeWidth={2}
          />
        </div>
      </div>
    </div>
  );
}
