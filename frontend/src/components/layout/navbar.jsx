import SearchProduct from "../product/searchProduct";
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
  Leaf,
} from "lucide-react";
import NavbarBtn from "./navbarBtn";
import { Link, useNavigate } from "react-router";
import { useDeviceType } from "@/lib/device";
import { Navigations } from "./navigation";
import { useState } from "react";
import Sidebar from "./sidebar";

export default function Navbar() {
  const { isDesktop } = useDeviceType();
  const [sideBar, setSideBar] = useState(false);
  const navigate = useNavigate();

  const desktop = (
    <div>
      <nav className="flex-wrap flex flex-col md:flex-row w-full justify-between items-center py-2 px-4 md:px-2 gap-3 md:gap-0">
        {/* <div className="flex items-center justify-between gap-2 md:gap-4 w-full md:w-auto ">
          <img
            className="h-5 md:h-7 flex-shrink-0"
            src="https://brandlogos.net/wp-content/uploads/2025/08/bigbasket-logo_brandlogos.net_n0gb0-768x171.png"
            alt="logo"
          />
        </div> */}

        <div className="flex items-center gap-1">
          <Leaf className="h-7 w-7 fill-emerald-700 text-emerald-700" />
          <span className="text-xl font-bold text-green-800">
            Greenhouse Market
          </span>
        </div>

        <div>
          <SearchProduct />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-3 w-full lg:w-auto justify-between lg:justify-end flex-wrap ">
          {/* <Button
            variant="outline"
            className="bg-white text-primary text-xs md:text-sm px-3 hidden sm:flex"
          >
            Become Vendor
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button> */}

          <div className="flex items-center justify-between gap-4">
            <NavbarBtn icon={<Recycle />} text="Compare" link="/compare" />
            <NavbarBtn icon={<Heart />} text="Wishlist" link="/wishlist" />
            <NavbarBtn icon={<ShoppingCart />} text="Cart" link="/cart" />
            <NavbarBtn icon={<User />} text="Account" link="/account" />
          </div>
        </div>
      </nav>

      {/* BOTTOM NAV */}
      <nav className="w-full border-t border-gray-200 py-2 flex  lg:flex-row items-center justify-between gap-3 border-b border-gray-200">
        <div className="flex items-center gap-3 md:gap-6 lg:w-auto overflow-x-auto scrollbar-hide">
          <Button
            onClick={() => navigate("/all-products")}
            className="bg-green-500 cursor-pointer text-white flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm whitespace-nowrap"
          >
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
        </div>

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
  );

  const mobile = (
    <div className="w-full bg-white">
      <nav className="w-full py-2 px-2 flex items-center justify-between">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setSideBar(true)}
          className="flex-shrink-0"
        >
          <Menu />
        </Button>

        <img
          className="h-6 absolute left-1/2 transform -translate-x-1/2"
          src="https://brandlogos.net/wp-content/uploads/2025/08/bigbasket-logo_brandlogos.net_n0gb0-768x171.png"
          alt="logo"
        />

        <div className="flex gap-2">
          <NavbarBtn icon={<Heart />} text="Wishlist" link="/wishlist" />
          <NavbarBtn icon={<ShoppingCart />} text="Cart" link="/cart" />
        </div>
      </nav>
    </div>
  );

  return (
    <>
      <Sidebar isOpen={sideBar} onClose={() => setSideBar(false)} />
      {isDesktop ? desktop : mobile}
      {/* <div className=" justify-center hidden md:flex">
            <Navigations />
      </div> */}
    </>
  );
}
