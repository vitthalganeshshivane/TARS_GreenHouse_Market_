import { useState } from "react";
import {
  Search,
  IndianRupee,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import StatusBadge from "../../../components/Vendor/dashboard/StatusBadge";
import Pagination from "../../../components/Vendor/dashboard/Pagination";

const transactions = [
  {
    id: "#TXN8821",
    customer: "Priya Sharma",
    customerId: "#CUST001",
    date: "01 Jun 2025",
    amount: "₹486",
    method: "UPI",
    status: "complete",
    orderId: "#ORD7821",
  },
  {
    id: "#TXN8822",
    customer: "Rahul Verma",
    customerId: "#CUST002",
    date: "01 Jun 2025",
    amount: "₹234",
    method: "COD",
    status: "pending",
    orderId: "#ORD7822",
  },
  {
    id: "#TXN8823",
    customer: "Sunita Patel",
    customerId: "#CUST003",
    date: "01 Jun 2025",
    amount: "₹750",
    method: "Card",
    status: "complete",
    orderId: "#ORD7823",
  },
  {
    id: "#TXN8824",
    customer: "Amit Joshi",
    customerId: "#CUST004",
    date: "01 Jun 2025",
    amount: "₹520",
    method: "UPI",
    status: "complete",
    orderId: "#ORD7824",
  },
  {
    id: "#TXN8825",
    customer: "Kavya Reddy",
    customerId: "#CUST005",
    date: "01 Jun 2025",
    amount: "₹310",
    method: "COD",
    status: "failed",
    orderId: "#ORD7825",
  },
  {
    id: "#TXN8826",
    customer: "Deepak Nair",
    customerId: "#CUST006",
    date: "31 May 2025",
    amount: "₹285",
    method: "UPI",
    status: "complete",
    orderId: "#ORD7826",
  },
  {
    id: "#TXN8827",
    customer: "Meera Singh",
    customerId: "#CUST007",
    date: "31 May 2025",
    amount: "₹395",
    method: "COD",
    status: "pending",
    orderId: "#ORD7827",
  },
  {
    id: "#TXN8828",
    customer: "Sanjay Kumar",
    customerId: "#CUST008",
    date: "31 May 2025",
    amount: "₹180",
    method: "Card",
    status: "canceled",
    orderId: "#ORD7828",
  },
  {
    id: "#TXN8829",
    customer: "Anita Gupta",
    customerId: "#CUST009",
    date: "30 May 2025",
    amount: "₹620",
    method: "UPI",
    status: "complete",
    orderId: "#ORD7829",
  },
  {
    id: "#TXN8830",
    customer: "Vikram Sharma",
    customerId: "#CUST010",
    date: "30 May 2025",
    amount: "₹240",
    method: "COD",
    status: "complete",
    orderId: "#ORD7830",
  },
];

const tabs = ["All", "Completed", "Pending", "Failed"];

const methodBadge = (method) => {
  const colors = {
    UPI: "bg-purple-50 text-purple-700 border border-purple-100",
    COD: "bg-orange-50 text-orange-700 border border-orange-100",
    Card: "bg-blue-50 text-blue-700 border border-blue-100",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${colors[method] || "bg-gray-100 text-gray-600"}`}
    >
      {method}
    </span>
  );
};

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filtered = transactions.filter((t) => {
    const matchTab =
      activeTab === "All" ||
      (activeTab === "Completed" && t.status === "complete") ||
      (activeTab === "Pending" && t.status === "pending") ||
      (activeTab === "Failed" &&
        (t.status === "failed" || t.status === "canceled"));
    const matchSearch =
      t.customer.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const totalRevenue = transactions
    .filter((t) => t.status === "complete")
    .reduce(
      (sum, t) => sum + parseFloat(t.amount.replace("₹", "").replace(",", "")),
      0,
    );

  return (
    <div className="space-y-5">
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
              <p className="text-xs text-gray-400">Last 7 days</p>
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            ₹{totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-green-600 font-semibold mt-1">
            ↑ 14.4% vs last week
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Completed</p>
              <p className="text-xs text-gray-400">Last 7 days</p>
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {transactions.filter((t) => t.status === "complete").length}
          </p>
          <p className="text-xs text-green-600 font-semibold mt-1">
            ↑ 20% success rate
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
            {transactions.filter((t) => t.status === "pending").length}
          </p>
          <p className="text-xs text-yellow-600 font-semibold mt-1">
            COD orders pending
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
              <p className="text-xs text-gray-400">Last 7 days</p>
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {
              transactions.filter(
                (t) => t.status === "failed" || t.status === "canceled",
              ).length
            }
          </p>
          <p className="text-xs text-red-500 font-semibold mt-1">
            ↓ 15% refund rate
          </p>
        </div>
      </div>

      {/* Payment Methods Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            method: "UPI",
            icon: "📱",
            count: transactions.filter((t) => t.method === "UPI").length,
            color: "from-purple-50 to-violet-50",
            border: "border-purple-100",
            text: "text-purple-700",
          },
          {
            method: "Cash on Delivery",
            icon: "💵",
            count: transactions.filter((t) => t.method === "COD").length,
            color: "from-orange-50 to-amber-50",
            border: "border-orange-100",
            text: "text-orange-700",
          },
          {
            method: "Card",
            icon: "💳",
            count: transactions.filter((t) => t.method === "Card").length,
            color: "from-blue-50 to-sky-50",
            border: "border-blue-100",
            text: "text-blue-700",
          },
        ].map((pm) => (
          <div
            key={pm.method}
            className={`bg-gradient-to-br ${pm.color} border ${pm.border} rounded-2xl p-4`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{pm.icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-800">{pm.method}</p>
                <p className={`text-xs font-semibold ${pm.text}`}>
                  {pm.count} transactions
                </p>
              </div>
              <div className="ml-auto">
                <p className="text-lg font-extrabold text-gray-800">
                  {Math.round((pm.count / transactions.length) * 100)}%
                </p>
                <p className="text-xs text-gray-400">share</p>
              </div>
            </div>
          </div>
        ))}
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
          {tabs.map((tab) => {
            const counts = {
              All: transactions.length,
              Completed: transactions.filter((t) => t.status === "complete")
                .length,
              Pending: transactions.filter((t) => t.status === "pending")
                .length,
              Failed: transactions.filter(
                (t) => t.status === "failed" || t.status === "canceled",
              ).length,
            };
            return (
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
            );
          })}
        </div>

        <div className="overflow-x-auto">
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
              {paginated.map((txn, idx) => (
                <tr
                  key={idx}
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
                    <button className="text-xs font-semibold text-green-700 hover:text-green-800 hover:underline">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
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
    </div>
  );
}
