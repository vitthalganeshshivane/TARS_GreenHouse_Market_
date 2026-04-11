import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { ShoppingCart } from "lucide-react";

function Rating({ rating = 0, total = 0 }) {
  return (
    <div className="w-3/4 flex justify-between items-center">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`-skew-10 w-2 h-2 ${
              i < rating ? "bg-orange-300" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">({total})</span>
    </div>
  );
}

function getFinalPrice(price, discount) {
  return discount > 0 ? discount : price;
}

export default function ProductCard({
  image,
  category,
  name,
  rating,
  ratingCount,
  brand,
  price,
  discount,
  label,
  sale,
  className,
  navigate,
}) {
  return (
    <div
      className={cn(
        "relative flex justify-center items-center flex-col w-32 md:w-50 rounded-xl border-1 border-gray-100/90 p-2 ",
        className,
      )}
    >
      <span className="rounded-tl-xl rounded-br-xl absolute top-0 left-0 bg-green-500 text-white px-4 hidden md:inline">
        {discount}%
      </span>
      {/* {sale && (
        <span className="rounded-tr-xl rounded-bl-xl absolute top-0 right-0 bg-blue-400 text-white px-5 py-1  hidden md:inline">
          Sale
        </span> */}
      {/* )} */}

      <div className="relative w-full h-28 md:h-40 flex items-center justify-center overflow-hidden rounded-xl">
        <img src={image} alt={image} className="w-full h-full object-contain" />

        <Button
          onClick={navigate}
          variant="outline"
          className="absolute border border-green-200 rounded-sm text-green-800 block md:hidden -bottom-1 -right-1"
        >
          <span>Add</span>
        </Button>
      </div>

      <div className=" w-full flex justify-center items-center flex-col ">
        <div className="w-full flex justify-between">
          <div className="text-gray-500 text-[12px]">{category?.name}</div>
          <div className="text-gray-500 text-[12px]">{label}</div>
        </div>
        <span className="w-full text-[16px] font-bold">{name}</span>

        <div className="w-full">
          <Rating rating={rating} total={ratingCount} />
        </div>

        <span className="w-full">
          <span className="text-gray-500  text-xs">By</span>{" "}
          <span className="text-green-500 text-sm">{brand}</span>
        </span>

        <div className="text-[14px] flex justify-around items-center w-full">
          <span className="text-green-500 font-semibold">
            {" "}
            &#8377;{getFinalPrice(price, discount)}
          </span>
          <span className="line-through text-gray-300">&#8377; {price}</span>
          <Button
            onClick={navigate}
            variant="outline"
            className="bg-green-100 h-8 rounded-sm text-green-800 hidden md:flex "
          >
            <ShoppingCart />
            <span>Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
