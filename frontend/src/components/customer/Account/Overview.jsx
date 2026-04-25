import { Mail, Phone, CalendarDays, ChevronRight, MapPin } from "lucide-react";

export default function Overview({ user, onNavigate }) {
  const recentOrders = user?.recentOrders ?? [];
  const defaultAddress = user?.addresses?.find((a) => a.isDefault);

  return (
    <div className="space-y-5">
      {/* Greeting banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-400 rounded-2xl p-6 text-white">
        <p className="text-green-100 text-sm font-medium">Welcome back 👋</p>
        <h1 className="text-2xl font-bold mt-0.5">{user?.name}</h1>
        <p className="text-green-100 text-sm mt-1">
          You have {user?.totalOrders ?? 0} total orders with us.
        </p>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700 text-[15px]">
            Personal Information
          </h2>
          <button
            onClick={() => onNavigate("settings")}
            className="text-green-500 text-xs font-medium hover:underline"
          >
            Edit all
          </button>
        </div>

        {[
          { Icon: Mail, label: "Email", value: user?.email },
          { Icon: Phone, label: "Phone", value: user?.phone },
          {
            Icon: CalendarDays,
            label: "Member since",
            value: user?.joinedDate,
          },
        ].map(({ Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0"
          >
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <Icon size={16} className="text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">
                {label}
              </p>
              <p className="text-gray-700 text-sm font-medium mt-0.5">
                {value ?? "—"}
              </p>
            </div>
            {label !== "Member since" && (
              <button
                onClick={() => onNavigate("settings")}
                className="text-green-500 text-xs font-medium hover:underline"
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700 text-[15px]">
            Recent Orders
          </h2>
          <button
            onClick={() => onNavigate("orders")}
            className="text-green-500 text-xs font-medium hover:underline flex items-center gap-1"
          >
            View all <ChevronRight size={13} />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">
            No orders yet.
          </p>
        ) : (
          recentOrders.slice(0, 2).map((order) => (
            <div
              key={order.id}
              className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-green-50 transition-colors duration-150 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                {order.image}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-700">
                  {order.id}
                </p>
                <p className="text-xs text-gray-400">
                  {order.date} · {order.items} items
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-gray-800">{order.total}</p>
                <span className="text-[11px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full group-hover:bg-white transition-colors">
                  {order.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Default Address */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700 text-[15px]">
            Default Address
          </h2>
          <button
            onClick={() => onNavigate("addresses")}
            className="text-green-500 text-xs font-medium hover:underline flex items-center gap-1"
          >
            Manage <ChevronRight size={13} />
          </button>
        </div>

        <div className="px-5 py-4">
          {defaultAddress ? (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={16} className="text-green-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {defaultAddress.name}
                </p>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                  {defaultAddress.line1}, {defaultAddress.city},<br />
                  {defaultAddress.state} — {defaultAddress.pincode}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No default address saved.</p>
          )}
        </div>
      </div>
    </div>
  );
}
