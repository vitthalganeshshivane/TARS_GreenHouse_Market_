import { useEffect, useMemo, useState } from "react";
import { Search, CheckCircle, RefreshCw, XCircle } from "lucide-react";
import StatusBadge from "../../../components/Vendor/dashboard/StatusBadge";
import StatCard from "../../../components/Vendor/dashboard/StatCard";
import Pagination from "../../../components/Vendor/dashboard/Pagination";
import { ShoppingCart, Plus } from "lucide-react";
import { useLocation } from "react-router-dom";
import API from "../../../api/axios";
import Loader from "../../../components/Loader";

const tabs = [
  "All Orders",
  "Placed",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const getOrdersFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const formatOrderId = (order) => {
  if (order?.orderId) return order.orderId;
  if (order?._id) return `#${order._id.slice(-6).toUpperCase()}`;
  return "-";
};

const formatAmount = (amount) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
};

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getItemsText = (items = []) => {
  return items.map((item) => `${item.title} (${item.variant})`).join(", ");
};

const getAddressText = (shippingAddress) => {
  if (!shippingAddress) return "-";
  return shippingAddress.addressLine || "-";
};

const paymentBadge = (method) => {
  const colors = {
    UPI: "bg-purple-50 text-purple-700",
    COD: "bg-orange-50 text-orange-700",
    ONLINE: "bg-blue-50 text-blue-700",
    Card: "bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${colors[method] || "bg-gray-100 text-gray-600"}`}
    >
      {method || "-"}
    </span>
  );
};

function OrderDetailsModal({ order, open, onClose }) {
  if (!open || !order) return null;

  const formatAmount = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 overflow-y-auto scrollbar-hide">
      <div className="w-full max-w-4xl rounded-2xl border border-gray-100 bg-white shadow-xl max-h-[90vh] overflow-y-auto scrollbar-hide my-auto">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Order Details</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {order.orderId || order._id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
              <h4 className="text-sm font-bold text-gray-800 mb-3">
                Customer Information
              </h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Name:</span>{" "}
                  {order?.user?.name || "-"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Phone:</span>{" "}
                  {order?.user?.phone || "-"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Email:</span>{" "}
                  {order?.user?.email || "-"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
              <h4 className="text-sm font-bold text-gray-800 mb-3">
                Order Information
              </h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Order ID:</span>{" "}
                  {order?.orderId || "-"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Date:</span>{" "}
                  {formatDate(order?.createdAt)}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Payment Method:</span>{" "}
                  {order?.paymentMethod || "-"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Payment Status:</span>{" "}
                  {order?.paymentStatus || "-"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Order Status:</span>{" "}
                  {order?.orderStatus || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
            <h4 className="text-sm font-bold text-gray-800 mb-3">
              Shipping Address
            </h4>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Full Name:</span>{" "}
                {order?.shippingAddress?.fullName || "-"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Address:</span>{" "}
                {order?.shippingAddress?.addressLine || "-"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">City:</span>{" "}
                {order?.shippingAddress?.city || "-"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">State:</span>{" "}
                {order?.shippingAddress?.state || "-"}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Pincode:</span>{" "}
                {order?.shippingAddress?.pincode || "-"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h4 className="text-sm font-bold text-gray-800">Ordered Items</h4>
            </div>

            <div className="divide-y divide-gray-100">
              {(order?.items || []).map((item, index) => (
                <div key={index} className="flex items-center gap-4 px-4 py-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-green-50 flex items-center justify-center flex-shrink-0">
                    {item?.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No Image</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {item?.title || "-"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Variant: {item?.variant || "-"}
                    </p>
                  </div>

                  <div className="text-sm text-gray-600 font-medium">
                    Qty: {item?.quantity || 0}
                  </div>

                  <div className="text-sm font-bold text-gray-800">
                    {formatAmount(item?.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-gray-100 pt-4">
            <div className="text-right">
              <p className="text-xs text-gray-400 font-medium">Total Amount</p>
              <p className="text-2xl font-extrabold text-gray-900">
                {formatAmount(order?.totalAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const rangeOptions = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
];

const isValidDate = (value) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

const getRangeDates = (rangeKey) => {
  const now = new Date();

  let currentStart;
  let currentEnd = new Date(now);
  let previousStart;
  let previousEnd;

  if (rangeKey === "today") {
    currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - 1);
    previousEnd = new Date(currentStart);
  } else if (rangeKey === "7d") {
    currentStart = new Date(now);
    currentStart.setDate(currentStart.getDate() - 6);
    currentStart.setHours(0, 0, 0, 0);

    previousEnd = new Date(currentStart);
    previousStart = new Date(previousEnd);
    previousStart.setDate(previousStart.getDate() - 7);
  } else if (rangeKey === "30d") {
    currentStart = new Date(now);
    currentStart.setDate(currentStart.getDate() - 29);
    currentStart.setHours(0, 0, 0, 0);

    previousEnd = new Date(currentStart);
    previousStart = new Date(previousEnd);
    previousStart.setDate(previousStart.getDate() - 30);
  } else if (rangeKey === "month") {
    currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
    previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    previousEnd = new Date(currentStart);
  } else {
    currentStart = new Date(now.getFullYear(), 0, 1);
    previousStart = new Date(now.getFullYear() - 1, 0, 1);
    previousEnd = new Date(now.getFullYear(), 0, 1);
  }

  return {
    currentStart,
    currentEnd,
    previousStart,
    previousEnd,
  };
};

const isWithinRange = (dateValue, start, end) => {
  if (!isValidDate(dateValue)) return false;
  const date = new Date(dateValue);
  return date >= start && date < end;
};

const getRangeLabel = (rangeKey) => {
  if (rangeKey === "today") return "Today";
  if (rangeKey === "7d") return "Last 7 days";
  if (rangeKey === "30d") return "Last 30 days";
  if (rangeKey === "month") return "This month";
  return "This year";
};

const getCompareLabel = (rangeKey) => {
  if (rangeKey === "today") return "vs yesterday";
  if (rangeKey === "7d") return "vs previous 7 days";
  if (rangeKey === "30d") return "vs previous 30 days";
  if (rangeKey === "month") return "vs last month";
  return "vs last year";
};

const formatTrendValue = (current, previous) => {
  if (previous === 0 && current === 0) {
    return { trend: "up", text: "0%" };
  }

  if (previous === 0 && current > 0) {
    return { trend: "up", text: "+100%" };
  }

  const percentage = ((current - previous) / previous) * 100;
  const rounded = Math.abs(percentage).toFixed(1);

  return {
    trend: percentage >= 0 ? "up" : "down",
    text: `${percentage >= 0 ? "+" : "-"}${rounded}%`,
  };
};

export default function OrdersPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchFromQuery = queryParams.get("search") || "";

  const [activeTab, setActiveTab] = useState("All Orders");
  const [search, setSearch] = useState(searchFromQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("7d");

  const stats = useMemo(() => {
    const { currentStart, currentEnd, previousStart, previousEnd } =
      getRangeDates(selectedRange);

    const currentOrders = orders.filter((order) =>
      isWithinRange(order.createdAt, currentStart, currentEnd),
    );

    const previousOrders = orders.filter((order) =>
      isWithinRange(order.createdAt, previousStart, previousEnd),
    );

    const currentTotal = currentOrders.length;
    const previousTotal = previousOrders.length;

    const currentPlaced = currentOrders.filter(
      (order) => order.orderStatus === "placed",
    ).length;
    const previousPlaced = previousOrders.filter(
      (order) => order.orderStatus === "placed",
    ).length;

    const currentDelivered = currentOrders.filter(
      (order) => order.orderStatus === "delivered",
    ).length;
    const previousDelivered = previousOrders.filter(
      (order) => order.orderStatus === "delivered",
    ).length;

    const currentCancelled = currentOrders.filter(
      (order) => order.orderStatus === "cancelled",
    ).length;
    const previousCancelled = previousOrders.filter(
      (order) => order.orderStatus === "cancelled",
    ).length;

    return {
      subtitle: getRangeLabel(selectedRange),
      compareLabel: getCompareLabel(selectedRange),

      total: {
        value: currentTotal,
        ...formatTrendValue(currentTotal, previousTotal),
      },

      placed: {
        value: currentPlaced,
        ...formatTrendValue(currentPlaced, previousPlaced),
      },

      delivered: {
        value: currentDelivered,
        ...formatTrendValue(currentDelivered, previousDelivered),
      },

      cancelled: {
        value: currentCancelled,
        ...formatTrendValue(currentCancelled, previousCancelled),
      },
    };
  }, [orders, selectedRange]);

  const itemsPerPage = 8;

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
    setDetailsOpen(false);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/order/vendor");
      setOrders(getOrdersFromResponse(res.data));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setSearch(searchFromQuery);
    setCurrentPage(1);
  }, [searchFromQuery]);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const orderId = formatOrderId(order).toLowerCase();
      const customerName = order?.user?.name?.toLowerCase() || "";
      const matchSearch =
        customerName.includes(search.toLowerCase()) ||
        orderId.includes(search.toLowerCase()) ||
        (order?.orderId || "").toLowerCase().includes(search.toLowerCase()) ||
        (order?._id || "").toLowerCase().includes(search.toLowerCase());

      const status = order?.orderStatus || "";
      const matchTab =
        activeTab === "All Orders" ||
        status.toLowerCase() === activeTab.toLowerCase();

      return matchSearch && matchTab;
    });
  }, [orders, search, activeTab]);

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // eslint-disable-next-line no-unused-vars
  const summary = useMemo(() => {
    const completed = orders.filter(
      (order) => order.orderStatus === "delivered",
    ).length;

    const cancelled = orders.filter(
      (order) => order.orderStatus === "cancelled",
    ).length;

    const recentPlaced = orders.filter(
      (order) => order.orderStatus === "placed",
    ).length;

    return {
      total: orders.length,
      newOrders: recentPlaced,
      completed,
      cancelled,
    };
  }, [orders]);

  const handleStatusChange = async (orderId, status) => {
    try {
      setActionLoadingId(orderId);

      const res = await API.put(`/order/${orderId}/status`, { status });
      const updatedOrder = res.data?.order;

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: updatedOrder?.orderStatus || status }
            : order,
        ),
      );
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to update order status.",
      );
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end">
        <select
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
          className="px-3 py-2 text-sm font-semibold bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
        >
          {rangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          subtitle={stats.subtitle}
          value={stats.total.value.toLocaleString("en-IN")}
          trendValue={stats.total.text}
          trend={stats.total.trend}
          icon={ShoppingCart}
          iconBg="bg-green-50"
          accent="text-green-600"
        />

        <StatCard
          title="New Orders"
          subtitle={stats.subtitle}
          value={stats.placed.value.toLocaleString("en-IN")}
          trendValue={stats.placed.text}
          trend={stats.placed.trend}
          icon={Plus}
          iconBg="bg-blue-50"
          accent="text-blue-600"
        />

        <StatCard
          title="Completed"
          subtitle={stats.subtitle}
          value={stats.delivered.value.toLocaleString("en-IN")}
          trendValue={stats.delivered.text}
          trend={stats.delivered.trend}
          icon={CheckCircle}
          iconBg="bg-emerald-50"
          accent="text-emerald-600"
        />

        <StatCard
          title="Cancelled"
          subtitle={stats.subtitle}
          value={stats.cancelled.value.toLocaleString("en-IN")}
          trendValue={stats.cancelled.text}
          trend={stats.cancelled.trend}
          icon={XCircle}
          iconBg="bg-red-50"
          accent="text-red-500"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">Order List</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl w-52 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              />
            </div>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 px-5 pt-3 overflow-x-auto border-b border-gray-100 scrollbar-hide">
          {tabs.map((tab) => {
            const count =
              tab === "All Orders"
                ? orders.length
                : orders.filter(
                    (order) =>
                      (order?.orderStatus || "").toLowerCase() ===
                      tab.toLowerCase(),
                  ).length;

            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-t-xl transition-all border-b-2 ${
                  activeTab === tab
                    ? "text-green-700 border-green-600 bg-green-50"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab}{" "}
                {count > 0 && (
                  <span className="ml-1 text-xs opacity-70">({count})</span>
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="px-5 pt-4">
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              {error}
            </div>
          </div>
        )}

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full">
            <thead>
              <tr className="bg-green-50">
                <th className="text-left text-xs font-bold text-green-800 px-5 py-3 w-10">
                  No.
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Order ID
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Customer
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Items
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Payment
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Amount
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Date
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    <Loader
                      title="Loading orders"
                      subtitle="Fetching your latest order activity..."
                      plain
                    />
                  </td>
                </tr>
              ) : paginated.length ? (
                paginated.map((order, idx) => (
                  <tr
                    key={order._id || idx}
                    className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm text-gray-500">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>

                    <td className="px-4 py-3.5 text-sm font-bold text-green-700">
                      {formatOrderId(order)}
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-gray-800">
                        {order?.user?.name || "-"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order?.user?.phone || "-"}
                      </p>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-gray-500 max-w-[160px]">
                      <p className="truncate">{getItemsText(order.items)}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                        {getAddressText(order.shippingAddress)}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      {paymentBadge(order.paymentMethod)}
                    </td>

                    <td className="px-4 py-3.5 text-sm font-bold text-gray-800">
                      {formatAmount(order.totalAmount)}
                    </td>

                    <td className="px-4 py-3.5 text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={order.orderStatus} />
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenDetails(order)}
                          className="px-3 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          View
                        </button>

                        <select
                          value={order.orderStatus || "placed"}
                          disabled={actionLoadingId === order._id}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="px-3 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 disabled:opacity-60"
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 pb-5">
          <Pagination
            current={currentPage}
            total={Math.max(totalPages, 1)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        open={detailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
}
