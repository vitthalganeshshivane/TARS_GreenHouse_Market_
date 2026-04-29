import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import Overview from "./Overview";
import MyOrders from "./MyOrders";
import AddressPage from "./Address";

import AccountSettings from "./AccountSetting";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "orders", label: "My Orders", Icon: Package },
  { id: "address", label: "Address", Icon: MapPin },
  { id: "wishlist", label: "Wishlist", Icon: Heart },
  { id: "settings", label: "Settings", Icon: Settings },
];

export default function AccountLayout() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "U";

  const tabProps = { user };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-green-400 via-green-500 to-emerald-400" />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Sidebar ── */}
          <aside className="lg:w-72 flex-shrink-0">
            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
              <div className="h-16 bg-gradient-to-r from-green-500 to-emerald-400 relative">
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                  <div className="w-14 h-14 rounded-full bg-white p-0.5 shadow-md">
                    <div className="w-full h-full rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg tracking-wide">
                        {initials}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-9 pb-5 px-5 text-center">
                <h2 className="font-bold text-gray-800 text-[17px] tracking-tight">
                  {user?.name}
                </h2>
                <p className="text-gray-400 text-[13px] mt-0.5">
                  {user?.email}
                </p>
                <p className="text-[12px] text-gray-400 mt-1">
                  Member since {user?.joinedDate}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                  {[
                    { label: "Orders", value: user?.totalOrders ?? 0 },
                    { label: "Wishlist", value: user?.wishlistCount ?? 0 },
                    { label: "Addresses", value: user?.savedAddresses ?? 0 },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="text-green-600 font-bold text-[18px] leading-none">
                        {s.value}
                      </p>
                      <p className="text-gray-400 text-[11px] mt-1">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {NAV_ITEMS.map(({ id, label, Icon }, idx) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all duration-200
                      ${idx !== NAV_ITEMS.length - 1 ? "border-b border-gray-50" : ""}
                      ${
                        isActive
                          ? "text-green-600 bg-green-50"
                          : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
                      }`}
                  >
                    <Icon
                      size={17}
                      className={isActive ? "text-green-500" : "text-gray-400"}
                    />
                    {label}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-5 rounded-full bg-green-500" />
                    )}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  logout();
                  toast.success("Logout Successful");
                  navigate("/login");
                }}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 border-t border-gray-100"
              >
                <LogOut size={17} />
                Log out
              </button>
            </nav>
          </aside>

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0">
            {activeTab === "overview" && (
              <Overview {...tabProps} onNavigate={setActiveTab} />
            )}
            {activeTab === "orders" && <MyOrders {...tabProps} />}
            {activeTab === "address" && <AddressPage />}
            {/* {activeTab === "wishlist" && <Wishlist {...tabProps} />} */}
            {activeTab === "settings" && <AccountSettings {...tabProps} />}
          </main>
        </div>
      </div>
    </div>
  );
}
