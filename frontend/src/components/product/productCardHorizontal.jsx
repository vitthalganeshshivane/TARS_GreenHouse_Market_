import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

function Rating({ rating, total }) {
  let stars = [];

  for (let i = 0; i < rating; i++) {
    stars.push(
      <div key={"full-" + i} className="w-2 h-2 bg-orange-400"></div>
    );
  }

  for (let j = rating; j < 5; j++) {
    stars.push(
      <div key={"empty-" + j} className="w-2 h-2 bg-gray-300"></div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <div className="flex gap-1">{stars}</div>
      <span>{total}</span>
    </div>
  );
}

function countDiscount(price, discount) {
  return (price - (price * discount) / 100).toFixed(2);
}

export default function ProductCardHorizontal({
  image,
  category,
  name,
  rating,
  ratingCount,
  brand,
  price,
  discount,
  sale,
  className,
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 w-full max-w-md p-3 rounded-lg bg-white",
        className
      )}
    >
      {/* Image */}
      <div className="w-20 h-20 flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between w-full">
        {/* Title */}
        <div>
          <p className="text-sm text-gray-500">{category}</p>
          <h3 className="text-base font-semibold text-gray-800 leading-tight">
            {name}
          </h3>
        </div>

        {/* Rating */}
        <Rating rating={rating} total={ratingCount} />


        {/* Price Row */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-green-600 font-bold text-lg">
            ₹ {countDiscount(price, discount)}
          </span>

          <span className="line-through text-gray-400 text-sm">
            ₹ {price}
          </span>

          <span className="text-orange-400 text-sm font-semibold">
            {discount}%
          </span>
        </div>
      </div>

    </div>
  );
}
