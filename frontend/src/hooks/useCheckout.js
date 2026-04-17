import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrderAsync } from "../redux/slices/orderSlice";
import { createPaymentSessionAsync } from "../redux/slices/paymentSlice";
import { openCashfreeCheckout } from "../utils/cashfree";

export default function useCheckout() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const addresses = useSelector((state) => state.address.addresses);
  const orderState = useSelector((state) => state.order);
  const paymentState = useSelector((state) => state.payment);

  console.log("Product item:", cartItems);

  const defaultAddress = useMemo(
    () => addresses.find((a) => a.isDefault),
    [addresses],
  );

  const subTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.variant.priceAtTime * item.quantity,
        0,
      ),
    [cartItems],
  );

  // const deliveryFee = subTotal >= 300 ? 0 : 40;
  const deliveryFee = 0;
  const platformFee = 0;
  const total = subTotal + deliveryFee + platformFee;

  const buildOrderItems = () => {
    return cartItems.map((item) => ({
      productId: item.product?._id || item.product,
      variant: item.variant.label,
      quantity: item.quantity,
    }));
  };

  const placeCODOrder = async () => {
    if (!cartItems.length) {
      return { ok: false, message: "Cart is empty" };
    }

    if (!defaultAddress?._id) {
      return { ok: false, message: "Please select a delivery address" };
    }

    const resultAction = await dispatch(
      createOrderAsync({
        items: buildOrderItems(),
        shippingAddress: defaultAddress._id,
        paymentMethod: "COD",
      }),
    );

    if (createOrderAsync.fulfilled.match(resultAction)) {
      return { ok: true, order: resultAction.payload };
    }

    return {
      ok: false,
      message: resultAction.payload?.message || "Failed to place COD order",
    };
  };

  const startUPIPayment = async () => {
    if (!cartItems.length) {
      return { ok: false, message: "Cart is empty" };
    }

    if (!defaultAddress?._id) {
      return { ok: false, message: "Please select a delivery address" };
    }

    const resultAction = await dispatch(
      createPaymentSessionAsync({
        shippingAddress: defaultAddress._id,
      }),
    );

    console.log("payment resultAction:", resultAction);

    if (!createPaymentSessionAsync.fulfilled.match(resultAction)) {
      return {
        ok: false,
        message:
          resultAction.payload?.message || "Failed to create payment session",
      };
    }

    const session = resultAction.payload.data;

    try {
      await openCashfreeCheckout(session.paymentSessionId);

      return {
        ok: true,
        orderCode: session.orderCode,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message || "Cashfree checkout failed",
      };
    }
  };

  return {
    cartItems,
    defaultAddress,
    subTotal,
    deliveryFee,
    platformFee,
    total,
    orderLoading: orderState.loading,
    paymentLoading: paymentState.loading,
    orderError: orderState.error,
    paymentError: paymentState.error,
    placeCODOrder,
    startUPIPayment,
  };
}
