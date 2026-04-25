const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTypeBadge = (type) => {
  const styles = {
    order: "bg-green-50 text-green-700 border border-green-100",
    stock: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    payment: "bg-blue-50 text-blue-700 border border-blue-100",
    delivery: "bg-purple-50 text-purple-700 border border-purple-100",
    system: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  return styles[type] || "bg-gray-100 text-gray-700 border border-gray-200";
};

export default function NotificationDetailsModal({
  notification,
  open,
  onClose,
  onGoToReference,
}) {
  if (!open || !notification) return null;

  const hasReference = notification.referenceId && notification.referenceType;

  const referenceLabel =
    notification.referenceType === "Order"
      ? "Go to Order"
      : notification.referenceType === "Product"
        ? "Go to Product"
        : "Open Reference";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white shadow-xl max-h-[90vh] overflow-y-auto my-auto">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Notification Details
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatDateTime(notification.createdAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide ${getTypeBadge(notification.type)}`}
            >
              {notification.type}
            </span>

            {!notification.isRead && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                Unread
              </span>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
            <p className="text-sm font-bold text-gray-800">
              {notification.title}
            </p>
            <p className="text-sm text-gray-600 leading-6 mt-2">
              {notification.message}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Notification Type
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {notification.type || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Created At
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {formatDateTime(notification.createdAt)}
              </p>
            </div>
          </div>

          {hasReference && (
            <div className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Reference
              </p>
              <p className="text-sm text-gray-700">
                {notification.referenceType}: {notification.referenceId}
              </p>

              <button
                onClick={() => onGoToReference(notification)}
                className="mt-3 px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                {referenceLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
