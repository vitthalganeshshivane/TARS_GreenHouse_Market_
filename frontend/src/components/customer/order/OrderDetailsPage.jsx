import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleOrderAsync } from "../../../redux/slices/orderSlice";
import { useNavigate, useParams } from "react-router";
import { CheckCircle2, ArrowLeft, MapPin, Receipt } from "lucide-react";

export default function OrderDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentOrder, loading, error } = useSelector((state) => state.order);
  //   console.log("order:", currentOrder);

  useEffect(() => {
    dispatch(fetchSingleOrderAsync(currentOrder._id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] py-6">
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center text-gray-500 mt-20">
            Loading order...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] py-6">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-xl p-5 text-center text-red-500">
            {typeof error === "string" ? error : error?.message}
          </div>
        </div>
      </div>
    );
  }

  if (!currentOrder) return null;

  const address = currentOrder.shippingAddress;

  const subtotal = currentOrder.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-4">
      <div className="max-w-xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => navigate("/")}>
            <ArrowLeft size={18} className="text-black/80" />
          </button>
          <h1 className="text-[16px] font-semibold text-black/80">
            Order Details
          </h1>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-xl p-5 mb-4 text-center">
          <CheckCircle2 size={44} className="mx-auto text-green-600 mb-3" />
          <h2 className="text-lg font-semibold text-black/85">
            Order placed successfully
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Your order has been confirmed.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Order ID</p>
              <p className="font-semibold text-black/85">
                {currentOrder.orderId}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Payment</p>
              <p className="font-semibold text-black/85">
                {currentOrder.paymentMethod}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Status</p>
              <p className="font-semibold text-black/85">
                {currentOrder.orderStatus || "Pending"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500">Amount</p>
              <p className="font-semibold text-black/85">
                ₹{currentOrder.totalAmount}
              </p>
            </div>
          </div>
        </div>

        {/* Address Card */}
        {address && (
          <div className="bg-white rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-green-600" />
              <h3 className="font-semibold text-black/85">Delivery Address</h3>
            </div>

            <p className="text-sm font-medium text-black/80">
              {address.fullName}
            </p>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              {address.addressLine}, {address.city}, {address.state} -{" "}
              {address.pincode}
            </p>
          </div>
        )}

        {/* Items Card */}
        <div className="bg-white rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Receipt size={16} className="text-green-600" />
            <h3 className="font-semibold text-black/85">Ordered Items</h3>
          </div>

          <div className="space-y-4">
            {currentOrder.items.map((item, index) => (
              <div
                key={index}
                className="flex gap-3 border-b last:border-b-0 pb-3 last:pb-0"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <p className="text-sm font-medium text-black/85">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{item.variant}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Qty: {item.quantity}
                  </p>
                </div>

                <div className="text-sm font-semibold text-black/85">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bill Summary */}
        <div className="bg-white rounded-xl p-4 mb-4">
          <h3 className="font-semibold text-black/85 mb-3">Bill Summary</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="border-t pt-3 flex justify-between font-semibold text-black/85">
              <span>Total Paid</span>
              <span>₹{currentOrder.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-white border rounded-xl py-3 text-sm font-medium text-black/80"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="bg-green-600 text-white rounded-xl py-3 text-sm font-medium"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
}
