import { useSelector } from "react-redux";

export default function CartCheckoutAction({
  paymentMethod,
  onPlaceOrder,
  onPayOnline,
  items,
  total,
  loading = false,
}) {
  //   const items = useSelector((state) => state.cart.items);
  const addresses = useSelector((state) => state.address.addresses);

  const defaultAddress = addresses.find((a) => a.isDefault);

  //   const total = items.reduce(
  //     (sum, item) => sum + item.variant.priceAtTime * item.quantity,
  //     0,
  //   );

  const isDisabled = !items.length || !defaultAddress;

  const handleClick = () => {
    if (isDisabled) return;

    if (paymentMethod === "cod") {
      onPlaceOrder();
    } else {
      onPayOnline();
    }
  };

  return (
    <div className="bg-white rounded-xl mt-4 p-4 border">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-500">Payment Method</span>
        <span className="text-sm font-medium text-black/80">
          {paymentMethod === "cod" ? "Cash on Delivery" : "UPI"}
        </span>
      </div>

      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`w-full py-3 rounded-lg font-medium transition ${
          isDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {loading
          ? "Processing..."
          : paymentMethod === "cod"
            ? "Place Order"
            : `Pay ₹${total} & Place Order`}
      </button>

      {!defaultAddress && (
        <p className="text-xs text-red-500 mt-2">
          Add delivery address to continue
        </p>
      )}
    </div>
  );
}
