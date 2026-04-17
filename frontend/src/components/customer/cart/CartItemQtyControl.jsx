import { useDispatch } from "react-redux";
import {
  optimisticUpdate,
  updateCartAsync,
} from "../../../redux/slices/cartSlice";
import { Minus, Plus } from "lucide-react";

export default function CartItemQtyControl({ item }) {
  const dispatch = useDispatch();

  const productId = item.product?._id || item.product;

  const handleIncrease = () => {
    const newQty = item.quantity + 1;
    dispatch(
      optimisticUpdate({
        productId,
        variantLabel: item.variant.label,
        quantity: newQty,
      }),
    );

    // 🔥 Backend sync
    dispatch(
      updateCartAsync({
        productId,
        variantLabel: item.variant.label,
        quantity: newQty,
      }),
    );
  };

  const handleDecrease = () => {
    if (item.quantity === 1) return;

    const newQty = item.quantity - 1;

    dispatch(
      optimisticUpdate({
        productId,
        variantLabel: item.variant.label,
        quantity: newQty,
      }),
    );

    dispatch(
      updateCartAsync({
        productId,
        variantLabel: item.variant.label,
        quantity: newQty,
      }),
    );
  };

  return (
    <div className="flex items-center gap-2">
      <div className="border-2 border-green-500 rounded">
        <button
          className="px-2 text-green-500 cursor-pointer"
          onClick={handleDecrease}
        >
          <Minus className="h-3 w-3" strokeWidth={3} />
        </button>

        <span className="w-3 text-center font-bold text-sm text-slate-500">
          {item.quantity}
        </span>

        <button
          onClick={handleIncrease}
          className="px-2 text-green-500 cursor-pointer"
        >
          <Plus className="h-3 w-3" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
