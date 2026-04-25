import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { verifyPaymentStatusAsync } from "../../../redux/slices/paymentSlice";
import { clearCartLocal } from "../../../redux/slices/cartSlice";
import { resetOrderState } from "../../../redux/slices/orderSlice";

export default function PaymentStatusPage() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const orderId = searchParams.get("order_id");

    if (!orderId) return;

    const verify = async () => {
      const result = await dispatch(verifyPaymentStatusAsync(orderId));

      if (verifyPaymentStatusAsync.fulfilled.match(result)) {
        const order = result.payload.order;

        if (order.paymentStatus === "paid") {
          dispatch(clearCartLocal());
          dispatch(resetOrderState());
          navigate(`/order/${order._id}`);
        } else {
          alert("Payment not successful yet");
        }
      } else {
        alert("Failed to verify payment");
      }
    };

    verify();
  }, [searchParams, dispatch, navigate]);

  return <div className="p-4">Checking payment status...</div>;
}
