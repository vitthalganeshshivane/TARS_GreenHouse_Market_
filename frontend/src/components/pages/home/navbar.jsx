import SearchProduct from "../../searchProduct";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Recycle,
  Heart,
  ShoppingCart,
  User,
  Grid,
  Star,
  PhoneCall,
  Menu,
} from "lucide-react";
import NavbarBtn from "../../navbarBtn";
import { Link } from "react-router";
import { useDeviceType } from "../../../lib/device";
import { Navigations } from "./navigation";
import { useState } from "react";
import Sidebar from "./sidebar";

export default function Navbar() {
  const { isDesktop } = useDeviceType();
  const [sideBar, setSideBar] = useState(false);

  const desktop = (
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* TOP NAV */}
        <nav className="flex flex-col lg:flex-row w-full justify-between items-center py-3 gap-3">
          {/* LEFT */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <img
              className="h-7 md:h-9 flex-shrink-0"
              src="https://brandlogos.net/wp-content/uploads/2025/08/bigbasket-logo_brandlogos.net_n0gb0-768x171.png"
              alt="logo"
            />

            <div className="flex-1">
              <SearchProduct />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 md:gap-3 w-full lg:w-auto justify-between lg:justify-end flex-wrap">
            <Button
              variant="outline"
              className="bg-white text-primary text-xs md:text-sm px-3 hidden sm:flex"
            >
              Become Vendor
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            <div className="flex items-center gap-1">
              <NavbarBtn icon={<Recycle />} link="/compare" />
              <NavbarBtn icon={<Heart />} link="/wishlist" />
              <NavbarBtn icon={<ShoppingCart />} link="/cart" />
              <NavbarBtn icon={<User />} link="/account" />
            </div>
          </div>
        </nav>

        {/* BOTTOM NAV */}
        <nav className="w-full border-t border-gray-200 py-2 flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* LEFT */}
          <div className="flex items-center gap-3 md:gap-6 w-full lg:w-auto overflow-x-auto scrollbar-hide">
            <Button className="bg-green-500 text-white flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm whitespace-nowrap">
              <Grid className="w-4 h-4" />
              Browse All Categories
            </Button>

            <Link
              to="/hot-deals"
              className="flex items-center gap-2 text-xs md:text-sm font-medium whitespace-nowrap"
            >
              <Star className="w-4 h-4" />
              Hot Deals
            </Link>

            <div className="hidden xl:block">
              <Navigations />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 md:gap-3 text-sm">
            <PhoneCall className="text-primary w-5 h-5" />

            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-primary text-sm md:text-base">
                7828767035
              </span>
              <span className="text-[10px] md:text-xs text-gray-500">
                24/7 Support Center
              </span>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );

  const mobile = (
    <div className="w-full border-b bg-white">
      <div className="flex items-center justify-between px-4 py-2">
        <Button size="icon" variant="ghost" onClick={() => setSideBar(true)}>
          <Menu />
        </Button>

        <img
          className="h-6"
          src="https://brandlogos.net/wp-content/uploads/2025/08/bigbasket-logo_brandlogos.net_n0gb0-768x171.png"
          alt="logo"
        />

        <div className="flex gap-2">
          <NavbarBtn icon={<Heart />} link="/wishlist" />
          <NavbarBtn icon={<ShoppingCart />} link="/cart" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Sidebar isOpen={sideBar} onClose={() => setSideBar(false)} />
      {isDesktop ? desktop : mobile}
    </>
  );
}
