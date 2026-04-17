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
import API from "../../../api/axios";
import NotificationPanel from "./NotificationPanel";
import NotificationDetailsModal from "./NotificationDetailsModal";

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

const getNotificationsFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.notifications)) return data.notifications;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export default function Topbar({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const title = getPageTitle(location.pathname);

  const params = new URLSearchParams(location.search);
  const [search, setSearch] = useState(params.get("search") || "");
  const [profileOpen, setProfileOpen] = useState(false);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const nextParams = new URLSearchParams(location.search);
    setSearch(nextParams.get("search") || "");
  }, [location.search]);

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get("/notification/unread-count");
      setUnreadCount(res.data?.unread || 0);
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setNotificationLoading(true);
      const res = await API.get("/notification");
      setNotifications(getNotificationsFromResponse(res.data));
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setNotificationLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    if (notificationOpen) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [notificationOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
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

  const handleMarkAllAsRead = async () => {
    try {
      await API.put("/notification/read-all");

      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true })),
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const handleOpenNotification = async (notification) => {
    try {
      if (!notification.isRead) {
        await API.put(`/notification/${notification._id}/read`);

        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id ? { ...item, isRead: true } : item,
          ),
        );

        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }

      setSelectedNotification({
        ...notification,
        isRead: true,
      });
      setDetailsOpen(true);
    } catch (error) {
      console.error("Failed to open notification", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      const target = notifications.find((item) => item._id === id);

      await API.delete(`/notification/${id}`);

      setNotifications((prev) => prev.filter((item) => item._id !== id));

      if (target && !target.isRead) {
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }

      if (selectedNotification?._id === id) {
        setSelectedNotification(null);
        setDetailsOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  const handleGoToReference = (notification) => {
    setDetailsOpen(false);
    setNotificationOpen(false);

    if (notification.referenceType === "Order" && notification.referenceId) {
      navigate(`/vendor/orders?search=${notification.referenceId}`);
      return;
    }

    if (notification.referenceType === "Product" && notification.referenceId) {
      navigate(`/vendor/products?search=${notification.referenceId}`);
    }
  };

  const displayName = user?.name || "Vendor";
  const displayEmail = user?.email || "";
  const avatarLetter = displayName.charAt(0).toUpperCase() || "V";
  const profileImage = user?.image || "";

  useEffect(() => {
    fetchUnreadCount();
  }, [location.pathname]);

  return (
    <>
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

          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setNotificationOpen((prev) => !prev)}
              className="relative p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-500" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-red-500 rounded-full border-2 border-white text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <NotificationPanel
                notifications={notifications}
                unreadCount={unreadCount}
                loading={notificationLoading}
                onClose={() => setNotificationOpen(false)}
                onOpenNotification={handleOpenNotification}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDeleteNotification={handleDeleteNotification}
              />
            )}
          </div>

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
                  <p className="text-xs text-gray-400 truncate">
                    {displayEmail}
                  </p>
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

      <NotificationDetailsModal
        notification={selectedNotification}
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedNotification(null);
        }}
        onGoToReference={handleGoToReference}
      />
    </>
  );
}
