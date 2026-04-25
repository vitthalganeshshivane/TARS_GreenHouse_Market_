import { useEffect, useMemo, useState } from "react";
import {
  ShoppingCart,
  IndianRupee,
  Clock,
  AlertTriangle,
  Package,
  TrendingUp,
  ArrowUpRight,
  Eye,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatCard from "../../../components/Vendor/dashboard/StatCard";
import StatusBadge from "../../../components/Vendor/dashboard/StatusBadge";
import { useNavigate } from "react-router-dom";
import API from "../../../api/axios";
import Loader from "../../../components/Loader";
import { useAuth } from "../../../hooks/useAuth";

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

const getProductsFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const formatCompactCurrency = (value) => {
  const amount = Number(value || 0);

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }

  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }

  return `₹${amount}`;
};

const formatTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isSameDay = (dateA, dateB) => {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

const getPercentageTrend = (current, previous) => {
  if (previous === 0 && current === 0) {
    return { trend: "up", text: "0%" };
  }

  if (previous === 0 && current > 0) {
    return { trend: "up", text: "+100%" };
  }

  const percentage = ((current - previous) / previous) * 100;

  return {
    trend: percentage >= 0 ? "up" : "down",
    text: `${percentage >= 0 ? "+" : "-"}${Math.abs(percentage).toFixed(1)}%`,
  };
};

const getRangeSubtitle = (range) => {
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-green-700 text-white px-3 py-2 rounded-xl text-sm shadow-lg">
        <p className="font-bold">{label}</p>
        <p>{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }

  return null;
};

const isWithinRange = (date, range) => {
  const target = new Date(date);
  const now = new Date();

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

const isWithinPreviousRange = (date, range) => {
  const target = new Date(date);
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfYesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfTwoMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 2,
    1,
  );

  const startOfThisYear = new Date(now.getFullYear(), 0, 1);
  const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
  const startOfTwoYearsAgo = new Date(now.getFullYear() - 2, 0, 1);

  const previous7DaysEnd = new Date(now);
  previous7DaysEnd.setDate(now.getDate() - 6);
  previous7DaysEnd.setHours(0, 0, 0, 0);

  const previous7DaysStart = new Date(previous7DaysEnd);
  previous7DaysStart.setDate(previous7DaysEnd.getDate() - 7);

  switch (range) {
    case "today":
      return target >= startOfYesterday && target < startOfToday;

    case "last7days":
      return target >= previous7DaysStart && target < previous7DaysEnd;

    case "thisMonth":
      return target >= startOfLastMonth && target < startOfThisMonth;

    case "lastMonth":
      return target >= startOfTwoMonthsAgo && target < startOfLastMonth;

    case "thisYear":
      return target >= startOfLastYear && target < startOfThisYear;

    case "lastYear":
      return target >= startOfTwoYearsAgo && target < startOfLastYear;

    default:
      return false;
  }
};

export default function DashboardPage() {
  const [chartPeriod, setChartPeriod] = useState("week");
  const [dateRange, setDateRange] = useState("last7days");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [ordersRes, productsRes] = await Promise.all([
          API.get("/order/vendor"),
          API.get("/product"),
        ]);

        setOrders(getOrdersFromResponse(ordersRes.data));
        setProducts(getProductsFromResponse(productsRes.data));
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const vendorProducts = useMemo(() => {
    return products.filter((product) => {
      const vendorId =
        typeof product?.vendor === "object"
          ? product?.vendor?._id
          : product?.vendor;

      return vendorId === user?._id;
    });
  }, [products, user?._id]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => isWithinRange(order.createdAt, dateRange));
  }, [orders, dateRange]);

  const previousPeriodOrders = useMemo(() => {
    return orders.filter((order) =>
      isWithinPreviousRange(order.createdAt, dateRange),
    );
  }, [orders, dateRange]);

  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const previousTotalOrders = previousPeriodOrders.length;

    const totalRevenue = filteredOrders
      .filter((order) =>
        ["confirmed", "shipped", "delivered"].includes(order.orderStatus),
      )
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    const previousRevenue = previousPeriodOrders
      .filter((order) =>
        ["confirmed", "shipped", "delivered"].includes(order.orderStatus),
      )
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    const pendingOrders = filteredOrders.filter((order) =>
      ["placed", "payment_pending"].includes(order.orderStatus),
    ).length;

    const completedOrders = filteredOrders.filter(
      (order) => order.orderStatus === "delivered",
    ).length;

    const previousCompletedOrders = previousPeriodOrders.filter(
      (order) => order.orderStatus === "delivered",
    ).length;

    const cancelledOrders = filteredOrders.filter(
      (order) => order.orderStatus === "cancelled",
    ).length;

    const previousCancelledOrders = previousPeriodOrders.filter(
      (order) => order.orderStatus === "cancelled",
    ).length;

    const lowStockProducts = vendorProducts
      .map((product) => {
        const totalStock = (product?.variants || []).reduce(
          (sum, variant) => sum + Number(variant?.stock || 0),
          0,
        );

        return {
          ...product,
          totalStock,
        };
      })
      .filter((product) => product.totalStock > 0 && product.totalStock < 10);

    return {
      totalOrders,
      totalOrdersTrend: getPercentageTrend(totalOrders, previousTotalOrders),
      totalRevenue,
      totalRevenueTrend: getPercentageTrend(totalRevenue, previousRevenue),
      pendingOrders,
      completedOrders,
      completedOrdersTrend: getPercentageTrend(
        completedOrders,
        previousCompletedOrders,
      ),
      cancelledOrders,
      cancelledOrdersTrend: getPercentageTrend(
        cancelledOrders,
        previousCancelledOrders,
      ),
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
    };
  }, [filteredOrders, previousPeriodOrders, vendorProducts]);

  const chartData = useMemo(() => {
    const now = new Date();
    const points = [];

    if (chartPeriod === "week") {
      for (let i = 6; i >= 0; i -= 1) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);

        const sales = orders
          .filter((order) => isSameDay(new Date(order.createdAt), date))
          .filter((order) =>
            ["confirmed", "shipped", "delivered"].includes(order.orderStatus),
          )
          .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

        points.push({
          day: date.toLocaleDateString("en-IN", { weekday: "short" }),
          sales,
        });
      }
    } else {
      const daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
      ).getDate();

      for (let i = 1; i <= daysInMonth; i += 1) {
        const date = new Date(now.getFullYear(), now.getMonth(), i);

        const sales = orders
          .filter((order) => isSameDay(new Date(order.createdAt), date))
          .filter((order) =>
            ["confirmed", "shipped", "delivered"].includes(order.orderStatus),
          )
          .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

        points.push({
          day: String(i),
          sales,
        });
      }
    }

    return points;
  }, [orders, chartPeriod]);

  const summaryStats = useMemo(() => {
    const uniqueCustomers = new Set(
      orders.map((order) => order?.user?._id).filter(Boolean),
    ).size;

    const totalProducts = vendorProducts.length;

    const stockItems = vendorProducts.reduce((sum, product) => {
      return (
        sum +
        (product?.variants || []).reduce(
          (variantSum, variant) => variantSum + Number(variant?.stock || 0),
          0,
        )
      );
    }, 0);

    const lifetimeRevenue = orders
      .filter((order) =>
        ["confirmed", "shipped", "delivered"].includes(order.orderStatus),
      )
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    return [
      { label: "Customers", value: uniqueCustomers.toLocaleString("en-IN") },
      { label: "Total Products", value: totalProducts.toLocaleString("en-IN") },
      { label: "Stock Items", value: stockItems.toLocaleString("en-IN") },
      { label: "Revenue", value: formatCompactCurrency(lifetimeRevenue) },
    ];
  }, [orders, vendorProducts]);

  const recentOrders = useMemo(() => {
    return [...filteredOrders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((order) => ({
        id: order.orderId || order._id,
        customer: order?.user?.name || "Customer",
        items: (order?.items || [])
          .map((item) => `${item.title} (${item.variant})`)
          .join(", "),
        amount: formatCurrency(order.totalAmount),
        status: order.orderStatus,
        time: formatTime(order.createdAt),
      }));
  }, [filteredOrders]);

  const topProducts = useMemo(() => {
    const map = new Map();

    filteredOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.product || `${item.title}-${item.variant || ""}`;

        if (!map.has(key)) {
          map.set(key, {
            key,
            name: item.title,
            category: "Product",
            sold: 0,
            revenue: 0,
            thumbnail: item.thumbnail || "",
          });
        }

        const product = map.get(key);
        product.sold += Number(item.quantity || 0);
        product.revenue += Number(item.price || 0) * Number(item.quantity || 0);
      });
    });

    return Array.from(map.values())
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 4)
      .map((product) => {
        const source = vendorProducts.find(
          (item) => item._id === product.key || item.title === product.name,
        );

        return {
          ...product,
          category: source?.category?.name || "Product",
          revenueLabel: formatCurrency(product.revenue),
        };
      });
  }, [filteredOrders, vendorProducts]);

  if (loading) {
    return (
      <Loader
        title="Loading dashboard"
        subtitle="Preparing your store insights..."
        plain
      />
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
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
          subtitle={getRangeSubtitle(dateRange)}
          value={stats.totalOrders.toLocaleString("en-IN")}
          trendValue={stats.totalOrdersTrend.text}
          trend={stats.totalOrdersTrend.trend}
          icon={ShoppingCart}
          iconBg="bg-green-50"
          accent="text-green-600"
        />
        <StatCard
          title="Revenue"
          subtitle={getRangeSubtitle(dateRange)}
          value={formatCurrency(stats.totalRevenue)}
          trendValue={stats.totalRevenueTrend.text}
          trend={stats.totalRevenueTrend.trend}
          icon={IndianRupee}
          iconBg="bg-emerald-50"
          accent="text-emerald-600"
        />
        <StatCard
          title="Completed"
          subtitle={getRangeSubtitle(dateRange)}
          value={stats.completedOrders.toLocaleString("en-IN")}
          trendValue={stats.completedOrdersTrend.text}
          trend={stats.completedOrdersTrend.trend}
          icon={Clock}
          iconBg="bg-yellow-50"
          accent="text-yellow-600"
        />
        <StatCard
          title="Cancelled"
          subtitle={getRangeSubtitle(dateRange)}
          value={stats.cancelledOrders.toLocaleString("en-IN")}
          trendValue={stats.cancelledOrdersTrend.text}
          trend={stats.cancelledOrdersTrend.trend}
          icon={AlertTriangle}
          iconBg="bg-red-50"
          accent="text-red-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-800 text-base">
                Weekly Sales Report
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Revenue trend for this week
              </p>
            </div>
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
              {["week", "month"].map((p) => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                    chartPeriod === p
                      ? "bg-white text-green-700 shadow-sm border border-green-100"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {p === "week" ? "This week" : "This month"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-5 pb-4 border-b border-gray-50">
            {summaryStats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-base font-extrabold text-gray-800">
                  {s.value}
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={chartData}
              margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#16a34a"
                strokeWidth={2.5}
                fill="url(#salesGrad)"
                dot={{ r: 4, fill: "#16a34a", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, fill: "#16a34a" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-sm">
                  Low Stock Alerts
                </h2>
                <p className="text-xs text-red-400">
                  {stats.lowStockProducts.length} items need restock
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/vendor/inventory")}
              className="text-xs font-semibold text-green-600 hover:underline flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {stats.lowStockProducts.slice(0, 4).map((item, idx) => (
              <div
                key={item._id || idx}
                className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.totalStock} {item.unit} left
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-16 h-1.5 bg-red-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${Math.min((item.totalStock / 10) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-red-500 font-semibold mt-0.5">
                    Restock
                  </p>
                </div>
              </div>
            ))}

            {!stats.lowStockProducts.length && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-500 text-center">
                No low stock alerts right now.
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/vendor/inventory")}
            className="mt-4 w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-colors border border-red-100"
          >
            Manage Inventory
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <div>
              <h2 className="font-bold text-gray-800 text-base">
                Recent Orders
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {getRangeSubtitle(dateRange)} order activity
              </p>
            </div>
            <button
              onClick={() => navigate("/vendor/orders")}
              className="flex items-center gap-1 text-xs font-semibold text-green-600 hover:underline"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full">
              <thead>
                <tr className="bg-green-50">
                  <th className="text-left text-xs font-bold text-green-800 px-5 py-3">
                    Order ID
                  </th>
                  <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                    Customer
                  </th>
                  <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                    Items
                  </th>
                  <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                    Amount
                  </th>
                  <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length ? (
                  recentOrders.map((order, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm font-bold text-green-700">
                        {order.id}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-gray-800">
                          {order.customer}
                        </p>
                        <p className="text-xs text-gray-400">{order.time}</p>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-500 max-w-[150px] truncate">
                        {order.items}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-bold text-gray-800">
                        {order.amount}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-10 text-center text-sm text-gray-500"
                    >
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-gray-50">
            <button
              onClick={() => navigate("/vendor/orders")}
              className="w-full py-2 text-sm font-semibold text-green-700 hover:text-green-800 flex items-center justify-center gap-1"
            >
              <Eye className="w-4 h-4" />
              View all orders
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <div>
              <h2 className="font-bold text-gray-800 text-base">
                Top Products
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Best sellers in {getRangeSubtitle(dateRange).toLowerCase()}
              </p>
            </div>
            <button
              onClick={() => navigate("/vendor/products")}
              className="text-xs font-semibold text-green-600 hover:underline flex items-center gap-1"
            >
              All products <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {topProducts.length ? (
              topProducts.map((product, idx) => (
                <div
                  key={product.key || idx}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {product.category} • {product.sold} sold
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-700">
                      {product.revenueLabel}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-500 text-center">
                No product sales data yet.
              </div>
            )}
          </div>

          <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <p className="text-xs font-bold text-green-700">
                {chartPeriod === "week"
                  ? "This Week's Performance"
                  : "This Month's Performance"}
              </p>
            </div>
            <p className="text-xl font-extrabold text-green-800">
              {formatCurrency(
                chartData.reduce(
                  (sum, item) => sum + Number(item.sales || 0),
                  0,
                ),
              )}
            </p>
            <p className="text-xs text-green-600 font-medium">
              Revenue generated in the selected period
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
