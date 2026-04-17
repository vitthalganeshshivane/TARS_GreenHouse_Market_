import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Warehouse,
  Tag,
  CreditCard,
  Settings,
  LogOut,
  Leaf,
  ChevronRight,
  Store,
  X,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/vendor" },
  { label: "Orders", icon: ShoppingCart, path: "/vendor/orders" },
  { label: "Products", icon: Package, path: "/vendor/products" },
  { label: "Inventory", icon: Warehouse, path: "/vendor/inventory" },
  { label: "Categories", icon: Tag, path: "/vendor/categories" },
  { label: "Transactions", icon: CreditCard, path: "/vendor/transactions" },
  { label: "Settings", icon: Settings, path: "/vendor/settings" },
];

export default function Sidebar({
  collapsed,
  isMobile,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const storeName = user?.store?.storeName || user?.name || "Vendor Store";
  const userEmail = user?.email || "vendor@example.com";

  const handleLogout = () => {
    logout();
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
    navigate("/login");
  };

  const handleNavigate = (path) => {
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
    navigate(path);
  };

  return (
    <>
      {isMobile && mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`${
          isMobile
            ? `fixed top-0 left-0 z-50 h-screen w-[240px] transform transition-transform duration-300 ${
                mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : `flex flex-col h-screen bg-white border-r border-gray-100 transition-all duration-300 shadow-sm ${
                collapsed ? "w-[70px]" : "w-[240px]"
              }`
        } bg-white border-r border-gray-100 shadow-sm`}
        style={{ minWidth: isMobile ? 240 : collapsed ? 70 : 240 }}
      >
        <div className="flex items-center justify-between gap-2 px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-green-600 flex-shrink-0">
              <Leaf className="w-5 h-5 text-white" />
            </div>

            {(!collapsed || isMobile) && (
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-green-700 font-800 text-lg font-extrabold tracking-tight truncate">
                  Kirana<span className="text-green-500">Plus</span>
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  Vendor Dashboard
                </span>
              </div>
            )}
          </div>

          {isMobile && (
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {(!collapsed || isMobile) && (
            <p className="text-[10px] uppercase text-gray-400 font-700 font-bold px-4 mb-2 tracking-widest">
              Main Menu
            </p>
          )}

          <ul className="space-y-1 px-2">
            {navItems.map(({ label, icon: Icon, path }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  end={path === "/vendor"}
                  onClick={() => {
                    if (isMobile) setMobileSidebarOpen(false);
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 group ${
                      isActive
                        ? "bg-green-600 text-white shadow-md shadow-green-200"
                        : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 ${
                          isActive
                            ? "text-white"
                            : "text-gray-400 group-hover:text-green-600"
                        }`}
                      />
                      {(!collapsed || isMobile) && (
                        <span className="flex-1">{label}</span>
                      )}
                      {(!collapsed || isMobile) && isActive && (
                        <ChevronRight className="w-4 h-4 opacity-70" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-gray-100 p-3 space-y-2">
          <button
            onClick={() => handleNavigate("/vendor/settings")}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-green-50 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Store className="w-4 h-4 text-green-600" />
            </div>

            {(!collapsed || isMobile) && (
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-bold text-gray-800 leading-tight truncate">
                  {storeName}
                </p>
                <p className="text-xs text-gray-400 truncate">{userEmail}</p>
              </div>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-semibold"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || isMobile) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
