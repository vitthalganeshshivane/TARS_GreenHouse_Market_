const statusConfig = {
  // Order statuses
  pending: {
    label: "Pending",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  packed: {
    label: "Packed",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  "out for delivery": {
    label: "Out for Delivery",
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
  delivered: {
    label: "Delivered",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },

  // Stock statuses
  "in stock": {
    label: "In Stock",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  "low stock": {
    label: "Low Stock",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  "out of stock": {
    label: "Out of Stock",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },

  // Payment/transaction statuses
  success: {
    label: "Success",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  failed: {
    label: "Failed",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  paid: {
    label: "Paid",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  unpaid: {
    label: "Unpaid",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  complete: {
    label: "Complete",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  canceled: {
    label: "Canceled",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
};

export default function StatusBadge({ status }) {
  const key = status?.toLowerCase();
  const config = statusConfig[key] || {
    label: status,
    bg: "bg-gray-50",
    text: "text-gray-700",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  );
}
