import { useDispatch } from "react-redux";
import {
  optimisticRemove,
  removeCartAsync,
} from "../../../redux/slices/cartSlice";
import CartItemQtyControl from "./CartItemQtyControl";

export default function CartItemCard({ item }) {
  const dispatch = useDispatch();

  // console.log("item in cart:", item);

  const image = item.image || item.product?.thumbnail;
  const price = item.variant.priceAtTime;

  const handleRemove = () => {
    const productId = item.product?._id || item.product;

    dispatch(
      optimisticRemove({
        productId,
        variantLabel: item.variant.label,
      }),
    );

    dispatch(
      removeCartAsync({
        productId,
        variantLabel: item.variant.label,
      }),
    );
  };
  return (
    <div className="flex items-center justify-between gap-4 border border-gray-200 px-4 py-2 rounded-xl bg-white m-2 ">
      {/* Left: image + name + variant */}
      <div className="flex items-center gap-3">
        <img
          src={image}
          alt={item.name}
          className="w-14 h-14 object-contain rounded-lg shrink-0"
        />
        <div>
          <h3 className="text-[15px] font-semibold text-gray-800">
            {item.name}
          </h3>
          <p className="text-xs font-semibold text-slate-600 -mt-1">
            {item.variant.label}
          </p>
        </div>
      </div>

      {/* Right: price + qty control + remove */}
      <div className="flex items-center gap-4 shrink-0">
        <p className="font-semibold text-gray-800 text-sm">
          ₹{price * item.quantity}
        </p>
        <CartItemQtyControl item={item} />
        <button
          onClick={handleRemove}
          className="text-red-400 text-sm hover:text-red-600 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
