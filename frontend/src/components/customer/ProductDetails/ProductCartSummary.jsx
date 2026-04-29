import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import EmptyCart from "../../../assets/empty-cart.json";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import lottie from "lottie-web";
import { useEffect, useRef } from "react";

function EmptyCartAnimation() {
  const ref = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: ref.current,
      animationData: EmptyCart,
      renderer: "svg",
      loop: true,
      autoplay: true,
    });
    return () => anim.destroy();
  }, []);

  return <div ref={ref} className="w-48 h-48" />;
}

export default function ProductCartSummary() {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items || []);

  const subTotal = cartItems.reduce(
    (total, item) => total + item.variant.priceAtTime * item.quantity,
    0,
  );

  const deliveryFee = 0;
  const total = subTotal + deliveryFee;

  return (
    <div className="sticky top-20 bg-white rounded-2xl border border-gray-150 p-5 mt-10">
      <h2 className="font-semibold text-lg mb-4">Cart Summary</h2>

      {cartItems && cartItems.length > 0 ? (
        <div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between  pb-2"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>

                <p className="font-medium">
                  ₹{item.variant.priceAtTime * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subTotal}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/cart")}
            className="w-full mt-5 bg-green-600 text-white py-3 rounded-xl font-medium"
          >
            Proceed to Checkout
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center py-6">
          <EmptyCartAnimation />

          <p className="text-sm text-gray-500 mt-2">Your cart is empty</p>
        </div>
      )}
    </div>
  );
}
