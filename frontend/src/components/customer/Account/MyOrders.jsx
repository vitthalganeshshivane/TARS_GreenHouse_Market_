import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  CalendarDays,
  CreditCard,
  MapPin,
  Loader2,
} from "lucide-react";
import { fetchMyOrdersAsync } from "../../../redux/slices/orderSlice";

export default function MyOrders() {
  const dispatch = useDispatch();
  const { myOrders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchMyOrdersAsync());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center justify-center gap-3 text-gray-500">
        <Loader2 className="animate-spin" size={18} />
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 text-red-500">
        {error}
      </div>
    );
  }

  if (!myOrders || myOrders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4">
          <Package className="text-green-500" size={24} />
        </div>
        <h2 className="text-lg font-bold text-gray-800">No orders yet</h2>
        <p className="text-sm text-gray-500 mt-2">
          You have not placed any order yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-white">
      {myOrders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-[16px] font-bold text-gray-800">
                Order #{order.orderId}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <CalendarDays size={14} />
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                <span className="flex items-center gap-1">
                  <CreditCard size={14} />
                  {order.paymentMethod}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <span className="text-lg font-bold text-green-600">
                ₹{order.totalAmount}
              </span>
              <span className="text-sm font-medium text-gray-500 capitalize">
                {order.orderStatus || "Pending"}
              </span>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-start border border-gray-100 rounded-xl p-3"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-100"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Variant: {item.variant}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-800 text-sm">
                      ₹{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {order.shippingAddress && (
              <div className="border-t border-gray-100 pt-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={15} />
                  Delivery Address
                </h5>
                <p className="text-sm text-gray-500 leading-6">
                  {order.shippingAddress.fullName},{" "}
                  {order.shippingAddress.addressLine},{" "}
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.pincode}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
