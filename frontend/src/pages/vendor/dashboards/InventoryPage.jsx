import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Search, AlertTriangle, RefreshCw, Plus, Package } from "lucide-react";
import StatusBadge from "../../../components/Vendor/dashboard/StatusBadge";
import Pagination from "../../../components/Vendor/dashboard/Pagination";
import API from "../../../api/axios";

const filterOptions = ["All", "In Stock", "Low Stock", "Out of Stock"];

const getProductsFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getVariantStatus = (stock) => {
  if (stock === 0) return "out of stock";
  if (stock < 5) return "low stock";
  return "in stock";
};

const getBarColor = (status) => {
  if (status === "out of stock") return "bg-red-500";
  if (status === "low stock") return "bg-yellow-500";
  return "bg-green-500";
};

const getStockPercent = (stock) => {
  if (stock === 0) return 0;
  if (stock < 5) return Math.min(stock * 20, 100);
  return 100;
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

export default function InventoryPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchFromQuery = queryParams.get("search") || "";
  const [search, setSearch] = useState(searchFromQuery);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    setSearch(searchFromQuery);
    setCurrentPage(1);
  }, [searchFromQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get("/product");
        setProducts(getProductsFromResponse(res.data));
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load inventory data.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const inventoryData = useMemo(() => {
    return products.flatMap((product) =>
      (product?.variants || []).map((variant, index) => {
        const stock = Number(variant?.stock || 0);
        const status = getVariantStatus(stock);

        return {
          id: `${product?._id || product?.id || "product"}-${index}`,
          productId: product?._id,
          name: product?.title || "-",
          variantLabel: variant?.label || "-",
          stock,
          unit: product?.unit || "-",
          category: product?.category || "-",
          status,
          lastRestocked: formatDate(product?.updatedAt || product?.createdAt),
          image: product?.thumbnail || product?.images?.[0] || "",
          sku: variant?.sku || product?.sku || "-",
        };
      }),
    );
  }, [products]);

  const filtered = useMemo(() => {
    return inventoryData.filter((item) => {
      const searchText =
        `${item.name} ${item.variantLabel} ${item.category} ${item.sku}`.toLowerCase();

      const matchSearch = searchText.includes(search.toLowerCase());
      const matchFilter =
        filter === "All" || item.status.toLowerCase() === filter.toLowerCase();

      return matchSearch && matchFilter;
    });
  }, [inventoryData, search, filter]);

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const lowStockCount = inventoryData.filter(
    (item) => item.status === "low stock",
  ).length;
  const outOfStockCount = inventoryData.filter(
    (item) => item.status === "out of stock",
  ).length;
  const inStockCount = inventoryData.filter(
    (item) => item.status === "in stock",
  ).length;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Items",
            value: inventoryData.length,
            bg: "bg-white",
            color: "text-gray-800",
            border: "border-gray-100",
            icon: "📦",
          },
          {
            label: "In Stock",
            value: inStockCount,
            bg: "bg-green-50",
            color: "text-green-700",
            border: "border-green-100",
            icon: "✅",
          },
          {
            label: "Low Stock",
            value: lowStockCount,
            bg: "bg-yellow-50",
            color: "text-yellow-700",
            border: "border-yellow-100",
            icon: "⚠️",
          },
          {
            label: "Out of Stock",
            value: outOfStockCount,
            bg: "bg-red-50",
            color: "text-red-700",
            border: "border-red-100",
            icon: "❌",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} rounded-2xl p-4 border ${s.border} shadow-sm`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{s.icon}</span>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            </div>
            <p className="text-xs text-gray-500 font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {lowStockCount + outOfStockCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-orange-800 text-sm">
              ⚠️ Attention Required
            </p>
            <p className="text-xs text-orange-600 mt-0.5">
              {lowStockCount} item(s) are running low and {outOfStockCount}{" "}
              item(s) are out of stock. Please restock soon.
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-orange-600 text-white text-xs font-semibold rounded-xl hover:bg-orange-700 transition-colors flex-shrink-0">
            <RefreshCw className="w-3.5 h-3.5" /> Restock Now
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">
            Inventory Management
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl w-48 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 px-5 py-3 overflow-x-auto border-b border-gray-50">
          {filterOptions.map((f) => {
            const counts = {
              All: inventoryData.length,
              "In Stock": inStockCount,
              "Low Stock": lowStockCount,
              "Out of Stock": outOfStockCount,
            };

            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  filter === f
                    ? f === "Low Stock"
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      : f === "Out of Stock"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-green-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                {f === "Low Stock" && "⚠️ "}
                {f === "Out of Stock" && "❌ "}
                {f}
                <span className="opacity-70">({counts[f]})</span>
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-green-50">
                <th className="text-left text-xs font-bold text-green-800 px-5 py-3">
                  Product
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Variant
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Category
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Stock Left
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Unit
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Stock Level
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Last Restocked
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
                    Loading inventory...
                  </td>
                </tr>
              ) : paginated.length ? (
                paginated.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className={`border-t border-gray-50 hover:bg-gray-50 transition-colors ${
                      item.status === "out of stock"
                        ? "bg-red-50/30"
                        : item.status === "low stock"
                          ? "bg-yellow-50/30"
                          : ""
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-4.5 h-4.5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400">{item.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-gray-700">
                        {item.variantLabel}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-lg">
                        {item.category.name}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`text-sm font-bold ${
                          item.stock === 0
                            ? "text-red-600"
                            : item.stock < 5
                              ? "text-yellow-600"
                              : "text-gray-800"
                        }`}
                      >
                        {item.stock}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-sm text-gray-600 font-medium">
                      {item.unit}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="w-24">
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getBarColor(item.status)}`}
                            style={{ width: `${getStockPercent(item.stock)}%` }}
                          ></div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {item.stock === 0
                            ? "Empty"
                            : `${Math.round(getStockPercent(item.stock))}%`}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="px-4 py-3.5 text-xs text-gray-500">
                      {item.lastRestocked}
                    </td>

                    <td className="px-4 py-3.5">
                      <button className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold rounded-lg transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Restock
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    No inventory items found.
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
    </div>
  );
}
