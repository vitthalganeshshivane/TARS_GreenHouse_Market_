import { useEffect, useMemo, useState } from "react";
import {
  Search,
  IndianRupee,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  Package,
  MapPin,
  User,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import StatusBadge from "../../../components/Vendor/dashboard/StatusBadge";
import Pagination from "../../../components/Vendor/dashboard/Pagination";
import API from "../../../api/axios";
import Loader from "../../../components/Loader";

const tabs = ["All", "Completed", "Pending", "Failed"];

const rangeOptions = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last7days" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "This Year", value: "thisYear" },
  { label: "Last Year", value: "lastYear" },
];

const getOrdersFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeMethod = (method) => {
  if (!method) return "N/A";
  if (method === "ONLINE") return "UPI";
  return method;
};

const normalizeStatus = (paymentStatus, orderStatus) => {
  if (paymentStatus === "paid") return "complete";
  if (paymentStatus === "failed" || orderStatus === "cancelled")
    return "failed";
  if (paymentStatus === "cod_pending") return "pending";
  if (paymentStatus === "pending") return "pending";
  return paymentStatus || "pending";
};

const getTransactionId = (order) => {
  if (order.paymentId) return order.paymentId;
  if (order.orderId) return `TXN-${order.orderId.replace("ORD-", "")}`;
  return `TXN-${String(order._id || "")
    .slice(-6)
    .toUpperCase()}`;
};

const isWithinRange = (date, range) => {
  const target = new Date(date);
  const now = new Date();

  if (Number.isNaN(target.getTime())) return false;

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfTomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const startOfThisYear = new Date(now.getFullYear(), 0, 1);
  const startOfNextYear = new Date(now.getFullYear() + 1, 0, 1);

  const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
  const endOfLastYear = new Date(now.getFullYear(), 0, 1);

  const last7DaysStart = new Date(now);
  last7DaysStart.setDate(now.getDate() - 6);
  last7DaysStart.setHours(0, 0, 0, 0);

  switch (range) {
    case "today":
      return target >= startOfToday && target < startOfTomorrow;
    case "last7days":
      return target >= last7DaysStart && target < startOfTomorrow;
    case "thisMonth":
      return target >= startOfThisMonth && target < startOfNextMonth;
    case "lastMonth":
      return target >= startOfLastMonth && target < endOfLastMonth;
    case "thisYear":
      return target >= startOfThisYear && target < startOfNextYear;
    case "lastYear":
      return target >= startOfLastYear && target < endOfLastYear;
    default:
      return true;
  }
};

const getRangeLabel = (range) => {
  switch (range) {
    case "today":
      return "Today";
    case "last7days":
      return "Last 7 days";
    case "thisMonth":
      return "This month";
    case "lastMonth":
      return "Last month";
    case "thisYear":
      return "This year";
    case "lastYear":
      return "Last year";
    default:
      return "Overview";
  }
};

const methodBadge = (method) => {
  const colors = {
    UPI: "bg-purple-50 text-purple-700 border border-purple-100",
    ONLINE: "bg-purple-50 text-purple-700 border border-purple-100",
    COD: "bg-orange-50 text-orange-700 border border-orange-100",
    CARD: "bg-blue-50 text-blue-700 border border-blue-100",
    Card: "bg-blue-50 text-blue-700 border border-blue-100",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
        colors[method] || "bg-gray-100 text-gray-600"
      }`}
    >
      {normalizeMethod(method)}
    </span>
  );
};

function TransactionDetailsModal({ transaction, onClose }) {
  if (!transaction) return null;

  const address = transaction.shippingAddress;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Transaction Details
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{transaction.id}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(90vh-82px)] scrollbar-hide">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-green-50 border border-green-100">
              <p className="text-xs text-green-700 font-semibold mb-1">
                Amount
              </p>
              <p className="text-xl font-extrabold text-green-800">
                {transaction.amount}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-500 font-semibold mb-1">Method</p>
              <div>{methodBadge(transaction.method)}</div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-500 font-semibold mb-1">Status</p>
              <StatusBadge status={transaction.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-green-600" />
                <h3 className="text-sm font-bold text-gray-800">Customer</h3>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">
                  {transaction.customer}
                </p>
                <p className="text-xs text-gray-400">
                  {transaction.customerEmail}
                </p>
                <p className="text-xs text-gray-400">
                  {transaction.customerId}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-green-600" />
                <h3 className="text-sm font-bold text-gray-800">Payment</h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-400">Order ID</span>
                  <span className="font-semibold text-gray-700">
                    {transaction.orderId}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-400">Payment Status</span>
                  <span className="font-semibold text-gray-700 capitalize">
                    {transaction.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-400">Order Status</span>
                  <span className="font-semibold text-gray-700 capitalize">
                    {transaction.orderStatus?.replaceAll("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-400">Date</span>
                  <span className="font-semibold text-gray-700">
                    {transaction.date}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-green-600" />
              <h3 className="text-sm font-bold text-gray-800">Order Items</h3>
            </div>

            <div className="space-y-3">
              {transaction.items.length ? (
                transaction.items.map((item, index) => (
                  <div
                    key={`${item.product || item.title}-${index}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div className="w-11 h-11 rounded-xl bg-green-50 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-green-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.variant} • Qty {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-bold text-gray-800">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No items found.</p>
              )}
            </div>
          </div>

          {address && (
            <div className="rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-green-600" />
                <h3 className="text-sm font-bold text-gray-800">
                  Shipping Address
                </h3>
              </div>

              <p className="text-sm font-semibold text-gray-800">
                {address.fullName || transaction.customer}
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {address.addressLine}
                {address.city ? `, ${address.city}` : ""}
                {address.state ? `, ${address.state}` : ""}
                {address.pincode ? ` - ${address.pincode}` : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("last7days");
  const [orders, setOrders] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
  const location = useLocation();

  const searchFromQuery = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get("search") || "";
  }, [location.search]);

  useEffect(() => {
    setSearch(searchFromQuery);
    setCurrentPage(1);
  }, [searchFromQuery]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get("/order/vendor");
        setOrders(getOrdersFromResponse(res.data));
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load transactions.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const transactions = useMemo(() => {
    return orders.map((order) => {
      const status = normalizeStatus(order.paymentStatus, order.orderStatus);

      return {
        id: getTransactionId(order),
        customer: order?.user?.name || "Customer",
        customerEmail: order?.user?.email || "-",
        customerId: order?.user?._id
          ? `#${String(order.user._id).slice(-6).toUpperCase()}`
          : "-",
        date: formatDate(order.createdAt),
        rawDate: order.createdAt,
        amount: formatCurrency(order.totalAmount),
        rawAmount: Number(order.totalAmount || 0),
        method: order.paymentMethod || "N/A",
        status,
        paymentStatus: order.paymentStatus || "pending",
        orderStatus: order.orderStatus || "-",
        orderId: order.orderId || order._id,
        orderMongoId: order._id,
        items: order.items || [],
        shippingAddress: order.shippingAddress,
      };
    });
  }, [orders]);

  const dateFilteredTransactions = useMemo(() => {
    return transactions.filter((txn) => isWithinRange(txn.rawDate, dateRange));
  }, [transactions, dateRange]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return dateFilteredTransactions.filter((t) => {
      const matchTab =
        activeTab === "All" ||
        (activeTab === "Completed" && t.status === "complete") ||
        (activeTab === "Pending" && t.status === "pending") ||
        (activeTab === "Failed" &&
          (t.status === "failed" || t.status === "canceled"));

      const matchSearch =
        !keyword ||
        t.customer.toLowerCase().includes(keyword) ||
        t.id.toLowerCase().includes(keyword) ||
        String(t.orderId || "")
          .toLowerCase()
          .includes(keyword);

      return matchTab && matchSearch;
    });
  }, [activeTab, dateFilteredTransactions, search]);

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const counts = useMemo(() => {
    return {
      All: dateFilteredTransactions.length,
      Completed: dateFilteredTransactions.filter((t) => t.status === "complete")
        .length,
      Pending: dateFilteredTransactions.filter((t) => t.status === "pending")
        .length,
      Failed: dateFilteredTransactions.filter(
        (t) => t.status === "failed" || t.status === "canceled",
      ).length,
    };
  }, [dateFilteredTransactions]);

  const totalRevenue = useMemo(() => {
    return dateFilteredTransactions
      .filter((t) => t.status === "complete")
      .reduce((sum, t) => sum + t.rawAmount, 0);
  }, [dateFilteredTransactions]);

  const paymentMethods = useMemo(() => {
    const upiCount = dateFilteredTransactions.filter(
      (t) => normalizeMethod(t.method) === "UPI",
    ).length;

    const codCount = dateFilteredTransactions.filter(
      (t) => normalizeMethod(t.method) === "COD",
    ).length;

    const cardCount = dateFilteredTransactions.filter(
      (t) => normalizeMethod(t.method) === "CARD",
    ).length;

    return [
      {
        method: "UPI",
        icon: "UPI",
        count: upiCount,
        color: "from-purple-50 to-violet-50",
        border: "border-purple-100",
        text: "text-purple-700",
      },
      {
        method: "Cash on Delivery",
        icon: "COD",
        count: codCount,
        color: "from-orange-50 to-amber-50",
        border: "border-orange-100",
        text: "text-orange-700",
      },
      {
        method: "Card",
        icon: "CARD",
        count: cardCount,
        color: "from-blue-50 to-sky-50",
        border: "border-blue-100",
        text: "text-blue-700",
      },
    ];
  }, [dateFilteredTransactions]);

  if (loading) {
    return (
      <Loader
        title="Loading transactions"
        subtitle="Fetching your payment history..."
        plain
      />
    );
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
        <select
          value={dateRange}
          onChange={(e) => {
            setDateRange(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
        >
          {rangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">
                Total Revenue
              </p>
              <p className="text-xs text-gray-400">
                {getRangeLabel(dateRange)}
              </p>
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-xs text-green-600 font-semibold mt-1">
            Successful payments
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Completed</p>
              <p className="text-xs text-gray-400">
                {getRangeLabel(dateRange)}
              </p>
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {counts.Completed}
          </p>
          <p className="text-xs text-green-600 font-semibold mt-1">
            Paid transactions
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Pending</p>
              <p className="text-xs text-gray-400">Awaiting payment</p>
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {counts.Pending}
          </p>
          <p className="text-xs text-yellow-600 font-semibold mt-1">
            COD / pending orders
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">
                Failed / Cancelled
              </p>
              <p className="text-xs text-gray-400">
                {getRangeLabel(dateRange)}
              </p>
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {counts.Failed}
          </p>
          <p className="text-xs text-red-500 font-semibold mt-1">
            Failed payments
          </p>
        </div>
      </div>

      {/* Payment Methods Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paymentMethods.map((pm) => {
          const share = dateFilteredTransactions.length
            ? Math.round((pm.count / dateFilteredTransactions.length) * 100)
            : 0;

          return (
            <div
              key={pm.method}
              className={`bg-gradient-to-br ${pm.color} border ${pm.border} rounded-2xl p-4`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold px-2 py-1 rounded-lg bg-white/70 text-gray-700">
                  {pm.icon}
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-800">{pm.method}</p>
                  <p className={`text-xs font-semibold ${pm.text}`}>
                    {pm.count} transactions
                  </p>
                </div>
                <div className="ml-auto">
                  <p className="text-lg font-extrabold text-gray-800">
                    {share}%
                  </p>
                  <p className="text-xs text-gray-400">share</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">Payment History</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl w-52 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-5 py-3 overflow-x-auto border-b border-gray-50">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              {tab} ({counts[tab]})
            </button>
          ))}
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full">
            <thead>
              <tr className="bg-green-50">
                <th className="text-left text-xs font-bold text-green-800 px-5 py-3">
                  Transaction ID
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Customer
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Order ID
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Date
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Amount
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Method
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
              {paginated.length ? (
                paginated.map((txn) => (
                  <tr
                    key={txn.id}
                    className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm font-bold text-green-700">
                      {txn.id}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-gray-800">
                        {txn.customer}
                      </p>
                      <p className="text-xs text-gray-400">{txn.customerId}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono text-gray-600">
                      {txn.orderId}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">
                      {txn.date}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-bold text-gray-800">
                      {txn.amount}
                    </td>
                    <td className="px-4 py-3.5">{methodBadge(txn.method)}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={txn.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => setSelectedTransaction(txn)}
                        className="text-xs font-semibold text-green-700 hover:text-green-800 hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    No transactions found.
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

      <TransactionDetailsModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
