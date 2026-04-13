import { useState } from "react";
import {
  ShoppingCart,
  IndianRupee,
  Clock,
  AlertTriangle,
  Package,
  TrendingUp,
  ArrowUpRight,
  MoreVertical,
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

const salesData = [
  { day: "Sun", sales: 8200 },
  { day: "Mon", sales: 12400 },
  { day: "Tue", sales: 9800 },
  { day: "Wed", sales: 16500 },
  { day: "Thu", sales: 14200 },
  { day: "Fri", sales: 18900 },
  { day: "Sat", sales: 21000 },
];

const recentOrders = [
  {
    id: "#ORD7821",
    customer: "Priya Sharma",
    items: "Tomatoes, Onions, Rice",
    amount: "₹486",
    status: "delivered",
    time: "10:30 am",
  },
  {
    id: "#ORD7822",
    customer: "Rahul Verma",
    items: "Milk, Bread, Eggs",
    amount: "₹234",
    status: "pending",
    time: "11:15 am",
  },
  {
    id: "#ORD7823",
    customer: "Sunita Patel",
    items: "Atta, Sugar, Dal",
    amount: "₹750",
    status: "packed",
    time: "11:45 am",
  },
  {
    id: "#ORD7824",
    customer: "Amit Joshi",
    items: "Butter, Cheese, Paneer",
    amount: "₹520",
    status: "out for delivery",
    time: "12:00 pm",
  },
  {
    id: "#ORD7825",
    customer: "Kavya Reddy",
    items: "Bananas, Apples, Grapes",
    amount: "₹310",
    status: "delivered",
    time: "12:30 pm",
  },
];

const topProducts = [
  {
    name: "Basmati Rice (5kg)",
    category: "Grains",
    sold: 148,
    revenue: "₹11,100",
    emoji: "🌾",
  },
  {
    name: "Amul Milk (1L)",
    category: "Dairy",
    sold: 234,
    revenue: "₹12,870",
    emoji: "🥛",
  },
  {
    name: "Tomatoes (1kg)",
    category: "Vegetables",
    sold: 312,
    revenue: "₹9,360",
    emoji: "🍅",
  },
  {
    name: "Alphonso Mangoes",
    category: "Fruits",
    sold: 89,
    revenue: "₹13,350",
    emoji: "🥭",
  },
];

const lowStockAlerts = [
  { name: "Tata Salt (1kg)", stock: 4, unit: "packs", threshold: 10 },
  { name: "Sunflower Oil (1L)", stock: 6, unit: "bottles", threshold: 15 },
  { name: "Besan (500g)", stock: 3, unit: "packs", threshold: 10 },
  { name: "Green Chillies", stock: 2, unit: "kg", threshold: 5 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-green-700 text-white px-3 py-2 rounded-xl text-sm shadow-lg">
        <p className="font-bold">{label}</p>
        <p>₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [chartPeriod, setChartPeriod] = useState("week");
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Today's Orders"
          subtitle="Last 24 hours"
          value="127"
          trendValue="+14.4%"
          trend="up"
          icon={ShoppingCart}
          iconBg="bg-green-50"
          accent="text-green-600"
        />
        <StatCard
          title="Today's Revenue"
          subtitle="Last 24 hours"
          value="₹18,450"
          trendValue="+10.2%"
          trend="up"
          icon={IndianRupee}
          iconBg="bg-emerald-50"
          accent="text-emerald-600"
        />
        <StatCard
          title="Pending Orders"
          subtitle="Needs action"
          value="23"
          trendValue="-5.1%"
          trend="down"
          icon={Clock}
          iconBg="bg-yellow-50"
          accent="text-yellow-600"
        />
        <StatCard
          title="Low Stock Alerts"
          subtitle="Items below threshold"
          value="8"
          trend="down"
          trendValue="+2 new"
          icon={AlertTriangle}
          iconBg="bg-red-50"
          accent="text-red-500"
        />
      </div>

      {/* Chart + Low Stock */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Sales Chart */}
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

          {/* Summary stats */}
          <div className="grid grid-cols-4 gap-3 mb-5 pb-4 border-b border-gray-50">
            {[
              { label: "Customers", value: "1.2k" },
              { label: "Total Products", value: "348" },
              { label: "Stock Items", value: "294" },
              { label: "Revenue", value: "₹1.28L" },
            ].map((s) => (
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
              data={salesData}
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

        {/* Low Stock Alerts */}
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
                  {lowStockAlerts.length} items need restock
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard/inventory")}
              className="text-xs font-semibold text-green-600 hover:underline flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {lowStockAlerts.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.stock} {item.unit} left
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-16 h-1.5 bg-red-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${Math.min((item.stock / item.threshold) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-red-500 font-semibold mt-0.5">
                    ⚠ Restock
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/dashboard/inventory")}
            className="mt-4 w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-colors border border-red-100"
          >
            Manage Inventory
          </button>
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <div>
              <h2 className="font-bold text-gray-800 text-base">
                Recent Orders
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Today's order activity
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard/orders")}
              className="flex items-center gap-1 text-xs font-semibold text-green-600 hover:underline"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
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
                {recentOrders.map((order, idx) => (
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
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-gray-50">
            <button
              onClick={() => navigate("/dashboard/orders")}
              className="w-full py-2 text-sm font-semibold text-green-700 hover:text-green-800 flex items-center justify-center gap-1"
            >
              <Eye className="w-4 h-4" />
              View all orders
            </button>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <div>
              <h2 className="font-bold text-gray-800 text-base">
                Top Products
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Best sellers this week
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard/products")}
              className="text-xs font-semibold text-green-600 hover:underline flex items-center gap-1"
            >
              All products <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {topProducts.map((product, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-2xl flex-shrink-0">
                  {product.emoji}
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
                    {product.revenue}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly summary */}
          <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <p className="text-xs font-bold text-green-700">
                This Week's Performance
              </p>
            </div>
            <p className="text-xl font-extrabold text-green-800">₹1,28,450</p>
            <p className="text-xs text-green-600 font-medium">
              +18.3% from last week
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
