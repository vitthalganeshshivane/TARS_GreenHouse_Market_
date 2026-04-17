import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

import { clearCartLocal, fetchCart } from "../../../redux/slices/cartSlice";
import { resetOrderState } from "../../../redux/slices/orderSlice";

import CartItemCard from "./CartItemCard";
import CartAddressCard from "./CartAddressCard";
import CartBillDetails from "./CartBillDetails";
import CartPaymentMethod from "./CartPaymentMethod";
import CartCheckoutAction from "./CartCheckoutAction";

import useCheckout from "../../../hooks/useCheckout";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const cartItems = useSelector((state) => state.cart.items);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // const subTotal = cartItems.reduce(
  //   (total, item) => total + item.variant.priceAtTime * item.quantity,
  //   0,
  // );

  const {
    cartItems,
    subTotal,
    orderLoading,
    orderError,
    placeCODOrder,
    startUPIPayment,
  } = useCheckout();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handlePlaceOrder = async () => {
    if (paymentMethod === "cod") {
      const result = await placeCODOrder();

      if (result.ok) {
        dispatch(clearCartLocal);
        dispatch(resetOrderState);
        navigate(`/order/${result.order._id}`);
      } else {
        alert(result.message);
      }
      return;
    }

    const upiResult = await startUPIPayment();
    if (!upiResult.ok) {
      alert(upiResult.message);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] py-4">
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center mt-20 text-gray-500">Cart is empty</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-4">
      <div className="flex items-center gap-2 mb-4 px-4">
        <ArrowLeft size={17} strokeWidth={2} className="text-black/80" />
        <div className="text-[16px] font-semibold text-black/80">Checkout</div>
      </div>
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white px-2 py-2 rounded-xl">
          <div className="font-semibold text-black/90 ml-2">Items</div>
          {cartItems.map((item) => (
            <CartItemCard key={item._id} item={item} />
          ))}
        </div>

        <CartAddressCard />

        <CartBillDetails item={cartItems} subtotal={subTotal} />

        <CartPaymentMethod
          selectedMethod={paymentMethod}
          onChangeMethod={setPaymentMethod}
        />

        <CartCheckoutAction
          paymentMethod={paymentMethod}
          onPlaceOrder={handlePlaceOrder}
          onPayOnline={handlePlaceOrder}
          items={cartItems}
          total={subTotal}
          loading={orderLoading}
        />
      </div>
    </div>
  );
}
