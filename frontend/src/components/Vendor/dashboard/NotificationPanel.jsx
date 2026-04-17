import { Bell, CheckCheck, Trash2 } from "lucide-react";
import Loader from "../../Loader";

const getTimeAgo = (value) => {
  if (!value) return "";

  const now = new Date();
  const date = new Date(value);
  const diffMs = now - date;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const getTypeBadge = (type) => {
  const styles = {
    order: "bg-green-50 text-green-700",
    stock: "bg-yellow-50 text-yellow-700",
    payment: "bg-blue-50 text-blue-700",
    delivery: "bg-purple-50 text-purple-700",
    system: "bg-gray-100 text-gray-700",
  };

  return styles[type] || "bg-gray-100 text-gray-700";
};

export default function NotificationPanel({
  notifications,
  unreadCount,
  loading,
  onClose,
  onOpenNotification,
  onMarkAllAsRead,
  onDeleteNotification,
}) {
  return (
    <div className="absolute right-0 top-12 w-[360px] bg-white border border-gray-100 rounded-2xl shadow-lg z-40 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <p className="text-sm font-bold text-gray-800">Notifications</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
          </p>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Mark all read
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="px-4 py-10 text-sm text-gray-500 text-center">
            <Loader compact />
          </div>
        ) : notifications.length ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? "bg-green-50/40" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onOpenNotification(notification)}
                    className="flex-1 text-left min-w-0"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {!notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wide ${getTypeBadge(notification.type)}`}
                      >
                        {notification.type}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {notification.title}
                    </p>

                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {notification.message}
                    </p>

                    <p className="text-[11px] text-gray-400 mt-2">
                      {getTimeAgo(notification.createdAt)}
                    </p>
                  </button>

                  <button
                    onClick={() => onDeleteNotification(notification._id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-10 text-center">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              No notifications yet
            </p>
            <p className="text-xs text-gray-400 mt-1">
              New order and stock alerts will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
