import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, Package } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import StatusBadge from "../../../components/Vendor/dashboard/StatusBadge";
import Pagination from "../../../components/Vendor/dashboard/Pagination";
import API from "../../../api/axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";

const ITEMS_PER_PAGE = 8;

const getProductsFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getTotalStock = (product) =>
  (product?.variants || []).reduce(
    (sum, variant) => sum + Number(variant?.stock || 0),
    0,
  );

const getDisplayPrice = (product) => {
  const prices = (product?.variants || [])
    .map((variant) => Number(variant?.discountPrice || variant?.price || 0))
    .filter((price) => !Number.isNaN(price) && price > 0);

  return prices.length ? `Rs ${Math.min(...prices)}` : "-";
};

const getStatus = (product) => {
  const totalStock = getTotalStock(product);
  if (!product?.isAvailable || totalStock <= 0) return "out of stock";
  if (totalStock <= 10) return "low stock";
  return "in stock";
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchFromQuery = queryParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(searchFromQuery);
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/product");
      setProducts(getProductsFromResponse(res.data));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setSearch(searchFromQuery);
    setCurrentPage(1);
  }, [searchFromQuery]);

  const categories = useMemo(() => {
    const dynamicCategories = [
      ...new Set(
        products.map((product) => product?.category?.name).filter(Boolean),
      ),
    ];
    return ["All", ...dynamicCategories];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const text =
        `${product?.title || ""} ${product?.sku || ""}`.toLowerCase();
      const matchSearch = text.includes(search.toLowerCase());
      const matchCategory =
        category === "All" || product?.category?.name === category;
      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const summary = useMemo(() => {
    return {
      total: products.length,
      inStock: products.filter((product) => getStatus(product) === "in stock")
        .length,
      lowStock: products.filter((product) => getStatus(product) === "low stock")
        .length,
      outOfStock: products.filter(
        (product) => getStatus(product) === "out of stock",
      ).length,
    };
  }, [products]);

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;

    try {
      setActionLoadingId(deleteTarget._id);
      await API.delete(`/product/${deleteTarget._id}`);
      setProducts((prev) =>
        prev.filter((product) => product._id !== deleteTarget._id),
      );
      setDeleteTarget(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete product.");
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Products",
            value: summary.total,
            color: "text-green-700",
            bg: "bg-green-50",
          },
          {
            label: "In Stock",
            value: summary.inStock,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Low Stock",
            value: summary.lowStock,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
          },
          {
            label: "Out of Stock",
            value: summary.outOfStock,
            color: "text-red-600",
            bg: "bg-red-50",
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`${item.bg} rounded-2xl p-4 border border-white shadow-sm`}
          >
            <p className={`text-2xl font-extrabold ${item.color}`}>
              {item.value}
            </p>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">Product List</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl w-48 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              />
            </div>
            <button
              onClick={() => navigate("/vendor/products/add")}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 overflow-x-auto border-b border-gray-50">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setCurrentPage(1);
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                category === cat
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              {cat}
            </button>
          ))}
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
                  SKU
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Category
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Price
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Stock
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-bold text-green-800 px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : paginated.length ? (
                paginated.map((product) => {
                  const totalStock = getTotalStock(product);
                  const status = getStatus(product);
                  const image = product?.thumbnail || product?.images?.[0];

                  return (
                    <tr
                      key={product._id}
                      className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {image ? (
                              <img
                                src={image}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {product.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              {product?.brand || "No brand"} • per{" "}
                              {product?.unit}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-mono text-gray-500">
                        {product?.sku || "-"}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-lg">
                          {product?.category?.name || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-bold text-gray-800">
                        {getDisplayPrice(product)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-sm font-bold ${totalStock === 0 ? "text-red-500" : totalStock <= 10 ? "text-yellow-600" : "text-gray-800"}`}
                        >
                          {totalStock} {product?.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                            title="Edit"
                            onClick={() =>
                              navigate(`/vendor/products/edit/${product._id}`)
                            }
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors disabled:opacity-50"
                            title="Delete"
                            disabled={actionLoadingId === product._id}
                            onClick={() => setDeleteTarget(product)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 pb-5">
          <Pagination
            current={currentPage}
            total={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">
                {deleteTarget?.title}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
