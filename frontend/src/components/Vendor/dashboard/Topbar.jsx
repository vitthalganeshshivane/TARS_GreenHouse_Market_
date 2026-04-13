import { useEffect, useRef, useState } from "react";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const pageTitles = {
  "/vendor": "Dashboard",
  "/vendor/orders": "Order Management",
  "/vendor/products": "Products",
  "/vendor/products/add": "Add Product",
  "/vendor/products/edit": "Edit Product",
  "/vendor/inventory": "Inventory",
  "/vendor/categories": "Categories",
  "/vendor/transactions": "Transactions",
  "/vendor/settings": "Settings",
};

function getPageTitle(pathname) {
  if (pathname.startsWith("/vendor/products/edit/")) {
    return "Edit Product";
  }

  return pageTitles[pathname] || "Dashboard";
}

export default function Topbar({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const title = getPageTitle(location.pathname);

  const params = new URLSearchParams(location.search);
  const [search, setSearch] = useState(params.get("search") || "");
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    const nextParams = new URLSearchParams(location.search);
    setSearch(nextParams.get("search") || "");
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    const query = search.trim();
    const encoded = query ? `?search=${encodeURIComponent(query)}` : "";

    if (location.pathname.startsWith("/vendor/products")) {
      navigate(`/vendor/products${encoded}`);
      return;
    }

    if (location.pathname.startsWith("/vendor/orders")) {
      navigate(`/vendor/orders${encoded}`);
      return;
    }

    if (location.pathname.startsWith("/vendor/inventory")) {
      navigate(`/vendor/inventory${encoded}`);
      return;
    }

    if (location.pathname.startsWith("/vendor/categories")) {
      navigate(`/vendor/categories${encoded}`);
      return;
    }

    navigate(`/vendor/products${encoded}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/login");
  };

  const displayName = user?.name || "Vendor";
  const displayEmail = user?.email || "";
  const avatarLetter = displayName.charAt(0).toUpperCase() || "V";
  const profileImage = user?.image || "";

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <form
          onSubmit={handleSubmit}
          className="relative hidden md:flex items-center"
        >
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-20 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all"
          />
          <button
            type="submit"
            className="absolute right-1 px-3 py-1.5 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Search
          </button>
        </form>

        <button className="relative p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                avatarLetter
              )}
            </div>

            <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white border border-gray-100 rounded-2xl shadow-lg z-30 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-800 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-400 truncate">{displayEmail}</p>
              </div>

              <div className="p-2">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/vendor/settings");
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm font-semibold text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
